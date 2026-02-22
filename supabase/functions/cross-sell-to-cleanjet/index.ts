import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { z } from 'npm:zod@3';
import { buildQuoteEmail } from '../_shared/email.ts';

const RequestSchema = z.object({
  cross_sell_event_id: z.string().uuid().optional(),
  lead_id: z.string().uuid(),
  contact_id: z.string().uuid().optional(),
  renovation_type: z.array(z.string()).default(['renovation']),
  bedrooms: z.number().int().min(1).default(3),
  dust_level: z.enum(['light', 'medium', 'heavy']).default('medium'),
  site_id: z.string().uuid().optional(),
  worker_id: z.string().uuid().optional(),
});

const BASE_RATES = { light: 18000, medium: 25000, heavy: 35000 } as const;
const MINIMUM_CENTS = 35000;

const CLEANJET_FOOTER = [
  '45-point cleaning checklist on every visit',
  'Bond-back guarantee on end of tenancy cleans',
  'Auckland-wide service',
  'cleanjet.co.nz · hello@cleanjet.co.nz',
];

const SCHEDULING_INSERT = `
<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="padding:16px;background-color:#ECFEFF;border-radius:8px;border-left:4px solid #0891B2;">
      <p style="margin:0;font-size:14px;color:#164E63;font-weight:600;">🗓 Your Post-Build Clean is Ready to Schedule</p>
      <p style="margin:4px 0 0;font-size:13px;color:#155E75;">AKF Construction referred you to CleanJet for your post-renovation clean. We'll confirm your booking time once you accept this quote. Flexible morning and afternoon slots available Mon–Sat.</p>
    </td>
  </tr>
</table>`;

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { status: 200 });
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ data: null, error: parsed.error.flatten() }, { status: 400 });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { cross_sell_event_id, lead_id, bedrooms, dust_level, renovation_type, site_id, worker_id } = parsed.data;

    let contact_id = parsed.data.contact_id;
    let contactEmail: string | null = null;
    let contactName = 'Valued Customer';

    if (!contact_id) {
      const { data: lead } = await supabase
        .from('leads')
        .select('contact_id')
        .eq('id', lead_id)
        .single();
      contact_id = lead?.contact_id;
    }

    if (contact_id) {
      const { data: contact } = await supabase
        .from('contacts')
        .select('full_name, email')
        .eq('id', contact_id)
        .single();
      contactEmail = contact?.email ?? null;
      contactName = contact?.full_name ?? 'Valued Customer';
    }

    if (!contactEmail) {
      console.error('[cross-sell-to-cleanjet] No contact email found for lead', lead_id);
      return Response.json({ data: null, error: 'Contact email not found' }, { status: 422 });
    }

    const baseRate = BASE_RATES[dust_level];
    const baseTotal = Math.max(baseRate * bedrooms, MINIMUM_CENTS);
    const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const line_items = [
      {
        description: `Post-build clean — ${bedrooms} bedroom(s), ${dust_level} construction dust`,
        quantity: bedrooms,
        unit_price: baseRate,
        total: baseTotal,
      },
    ];

    const resolvedSiteId = site_id ?? Deno.env.get('CLEANJET_SITE_ID') ?? '';
    const resolvedWorkerId = worker_id ?? Deno.env.get('CLEANJET_DEFAULT_WORKER_ID') ?? '';

    if (!resolvedSiteId || !resolvedWorkerId || !contact_id) {
      return Response.json({ data: null, error: 'Missing site_id, worker_id, or contact_id' }, { status: 422 });
    }

    const { data: quote, error: quoteErr } = await supabase
      .from('quotes')
      .insert({
        site_id: resolvedSiteId,
        worker_id: resolvedWorkerId,
        contact_id,
        lead_id,
        status: 'draft',
        total_amount: baseTotal,
        currency: 'NZD',
        ai_generated: false,
        ai_model: 'deterministic',
        notes: `Cross-sell post-build clean from AKF Construction referral. Renovation: ${renovation_type.join(', ')}.`,
        valid_until: validUntil,
        service_duration_hours: Math.max(bedrooms * 1.5, 2.0),
        cleaners_required: bedrooms >= 4 || dust_level === 'heavy' ? 2 : 1,
        ai_notes: { referred_by: 'akf', cross_sell_event_id },
      })
      .select('id')
      .single();

    if (quoteErr || !quote) {
      console.error('[cross-sell-to-cleanjet][db]', quoteErr?.message);
      return Response.json({ data: null, error: 'Failed to create quote' }, { status: 500 });
    }

    await supabase
      .from('quote_line_items')
      .insert(line_items.map((item, idx) => ({
        quote_id: quote.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.total,
        sort_order: idx,
      })));

    const totalFormatted = `${(baseTotal / 100).toFixed(2)} NZD`;
    const html = buildQuoteEmail({
      brandName: 'CleanJet',
      brandColour: '#0891B2',
      contactName,
      quoteId: quote.id,
      lineItems: line_items,
      totalAmount: baseTotal,
      currency: 'NZD',
      validUntil,
      notes: `Complimentary quote prepared following your AKF Construction renovation — ${renovation_type.join(', ')}.`,
      brandInsert: SCHEDULING_INSERT,
      footerLines: CLEANJET_FOOTER,
      phone: '09-XXX-XXXX',
      acceptUrl: `${Deno.env.get('SUPABASE_URL')}/functions/v1/quote-accept?quote_id=${quote.id}`,
    });

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'hello@cleanjet.co.nz',
        to: contactEmail,
        subject: `Your Post-Build Clean Quote from CleanJet — $${totalFormatted}`,
        html,
      }),
    });

    if (resendRes.ok && cross_sell_event_id) {
      await supabase
        .from('cross_sell_events')
        .update({ status: 'accepted' })
        .eq('id', cross_sell_event_id);
    }

    console.log(`[cross-sell-to-cleanjet] quote_id=${quote.id} sent_to=${contactEmail} total=${baseTotal}`);

    return Response.json({
      data: { quote_id: quote.id, status: 'sent', sent_to: contactEmail, total_amount: baseTotal },
      error: null,
    });
  } catch (err) {
    console.error('[cross-sell-to-cleanjet][unhandled]', err instanceof Error ? err.message : String(err));
    return Response.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
});

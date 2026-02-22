import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { z } from 'npm:zod@3';
import { buildQuoteEmail } from '../_shared/email.ts';

const RequestSchema = z.object({
  quote_id: z.string().uuid(),
  send_to: z.string().email().optional(),
});

const FINANCING_INSERT = `
<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="padding:16px;background-color:#FEF3C7;border-radius:8px;border-left:4px solid #D97706;">
      <p style="margin:0;font-size:14px;color:#92400E;font-weight:600;">💳 Finance Available — Pay from $0 Upfront</p>
      <p style="margin:4px 0 0;font-size:13px;color:#78350F;">GEM Visa · Q Mastercard · ANZ · Westpac interest-free options available. Ask us about 12-month no-interest finance.</p>
    </td>
  </tr>
</table>`;

const PRIME_FOOTER = [
  'Master Electricians New Zealand member',
  'SEANZ certified solar installer',
  '12-month workmanship guarantee',
  'Unit 2, 41 Smales Road, East Tāmaki, Auckland 2013',
  'info@theprimeelectrical.co.nz · 09-390-3620',
];

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

    const { data: quote, error: quoteErr } = await supabase
      .from('quotes')
      .select('id, total_amount, currency, notes, valid_until, contact_id, status')
      .eq('id', parsed.data.quote_id)
      .single();

    if (quoteErr || !quote) {
      return Response.json({ data: null, error: 'Quote not found' }, { status: 404 });
    }

    const { data: lineItems, error: itemsErr } = await supabase
      .from('quote_line_items')
      .select('description, quantity, unit_price, total')
      .eq('quote_id', parsed.data.quote_id)
      .order('sort_order');

    if (itemsErr) {
      return Response.json({ data: null, error: 'Failed to fetch line items' }, { status: 500 });
    }

    const { data: contact, error: contactErr } = await supabase
      .from('contacts')
      .select('full_name, email')
      .eq('id', quote.contact_id)
      .single();

    if (contactErr || !contact) {
      return Response.json({ data: null, error: 'Contact not found' }, { status: 404 });
    }

    const recipientEmail = parsed.data.send_to ?? contact.email;
    const totalFormatted = `${(quote.total_amount / 100).toFixed(2)} NZD`;

    const html = buildQuoteEmail({
      brandName: 'Prime Electrical',
      brandColour: '#D97706',
      contactName: contact.full_name ?? 'Valued Customer',
      quoteId: quote.id,
      lineItems: lineItems ?? [],
      totalAmount: quote.total_amount,
      currency: quote.currency,
      validUntil: quote.valid_until ?? null,
      notes: quote.notes ?? null,
      brandInsert: FINANCING_INSERT,
      footerLines: PRIME_FOOTER,
      phone: '09-390-3620',
      acceptUrl: `${Deno.env.get('SUPABASE_URL')}/functions/v1/quote-accept?quote_id=${quote.id}`,
    });

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'quotes@theprimeelectrical.co.nz',
        to: recipientEmail,
        subject: `Your Prime Electrical Quote — $${totalFormatted}`,
        html,
      }),
    });

    if (!resendRes.ok) {
      const errBody = await resendRes.text();
      console.error('[quote-send-electrical][resend]', resendRes.status, errBody);
      return Response.json({ data: null, error: 'Email delivery failed' }, { status: 502 });
    }

    await supabase
      .from('quotes')
      .update({ status: 'sent' })
      .eq('id', parsed.data.quote_id);

    console.log(`[quote-send-electrical] quote_id=${parsed.data.quote_id} sent_to=${recipientEmail}`);

    return Response.json({
      data: { quote_id: parsed.data.quote_id, status: 'sent', sent_to: recipientEmail },
      error: null,
    });
  } catch (err) {
    console.error('[quote-send-electrical][unhandled]', err instanceof Error ? err.message : String(err));
    return Response.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
});

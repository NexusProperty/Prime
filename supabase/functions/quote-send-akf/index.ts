import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { z } from 'npm:zod@3';
import { buildQuoteEmail } from '../_shared/email.ts';

const RequestSchema = z.object({
  quote_id: z.string().uuid(),
  send_to: z.string().email().optional(),
});

const AKF_FOOTER = [
  'Licensed Building Practitioner (LBP)',
  'Established 2010 · 10-year structural guarantee',
  '2/41 Smales Rd, East Tāmaki, Auckland 2013',
  'info@akfconstruction.co.nz · 09-951-8763',
];

function buildConsentInsert(consentRequired: boolean, consentNotes: string | null): string {
  if (!consentRequired) return '';
  return `
<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="padding:16px;background-color:#FFFBEB;border-radius:8px;border-left:4px solid #F59E0B;">
      <p style="margin:0;font-size:14px;color:#78350F;font-weight:600;">📋 Auckland Council Building Consent</p>
      <p style="margin:4px 0 0;font-size:13px;color:#92400E;">This project may require building consent. Consent fee included as a line item above. AKF Construction manages the full consent application on your behalf. Processing typically takes 20 working days.</p>
      ${consentNotes ? `<p style="margin:4px 0 0;font-size:12px;color:#B45309;font-style:italic;">${consentNotes}</p>` : ''}
    </td>
  </tr>
</table>`;
}

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
      .select('id, total_amount, currency, notes, valid_until, contact_id, status, consent_required, consent_notes')
      .eq('id', parsed.data.quote_id)
      .single();

    if (quoteErr || !quote) {
      return Response.json({ data: null, error: 'Quote not found' }, { status: 404 });
    }

    const { data: lineItems } = await supabase
      .from('quote_line_items')
      .select('description, quantity, unit_price, total')
      .eq('quote_id', parsed.data.quote_id)
      .order('sort_order');

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
    const consentInsert = buildConsentInsert(quote.consent_required ?? false, quote.consent_notes ?? null);

    const html = buildQuoteEmail({
      brandName: 'AKF Construction',
      brandColour: '#1E293B',
      contactName: contact.full_name ?? 'Valued Customer',
      quoteId: quote.id,
      lineItems: lineItems ?? [],
      totalAmount: quote.total_amount,
      currency: quote.currency,
      validUntil: quote.valid_until ?? null,
      notes: quote.notes ?? null,
      brandInsert: consentInsert,
      footerLines: AKF_FOOTER,
      phone: '09-951-8763',
      acceptUrl: `${Deno.env.get('SUPABASE_URL')}/functions/v1/quote-accept?quote_id=${quote.id}`,
    });

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'quotes@akfconstruction.co.nz',
        to: recipientEmail,
        subject: `Your AKF Construction Quote — $${totalFormatted}`,
        html,
      }),
    });

    if (!resendRes.ok) {
      const errBody = await resendRes.text();
      console.error('[quote-send-akf][resend]', resendRes.status, errBody);
      return Response.json({ data: null, error: 'Email delivery failed' }, { status: 502 });
    }

    await supabase
      .from('quotes')
      .update({ status: 'sent' })
      .eq('id', parsed.data.quote_id);

    console.log(`[quote-send-akf] quote_id=${parsed.data.quote_id} sent_to=${recipientEmail} consent=${quote.consent_required}`);

    return Response.json({
      data: { quote_id: parsed.data.quote_id, status: 'sent', sent_to: recipientEmail },
      error: null,
    });
  } catch (err) {
    console.error('[quote-send-akf][unhandled]', err instanceof Error ? err.message : String(err));
    return Response.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
});

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { z } from 'npm:zod@3';

const RequestSchema = z.object({
  quote_id: z.string().uuid(),
  min_hours_since_sent: z.number().int().min(1).default(24),
});

function buildFollowupHtml(
  contactName: string,
  quoteId: string,
  totalAmount: number,
  acceptUrl: string,
): string {
  const totalFormatted = `$${(totalAmount / 100).toFixed(2)} NZD`;
  const quoteRef = quoteId.substring(0, 8).toUpperCase();

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Quote Follow-up — Prime Electrical</title></head>
<body style="margin:0;padding:0;background-color:#F1F5F9;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07);">
      <tr>
        <td style="background-color:#D97706;padding:28px 32px;">
          <span style="font-size:22px;font-weight:700;color:#FFFFFF;">Prime Electrical</span>
        </td>
      </tr>
      <tr><td style="padding:28px 32px;">
        <p style="margin:0 0 16px;font-size:16px;color:#111827;">Hi ${contactName},</p>
        <p style="margin:0 0 16px;font-size:15px;color:#4B5563;">
          We wanted to follow up on your quote (<strong>${quoteRef}</strong>) for <strong>${totalFormatted}</strong> that we sent you recently.
        </p>
        <p style="margin:0 0 24px;font-size:15px;color:#4B5563;">
          If you have any questions about the quote, pricing, or would like to discuss the scope of work, we'd love to hear from you. You can also accept directly:
        </p>
        <div style="text-align:center;">
          <a href="${acceptUrl}" style="display:inline-block;padding:14px 32px;background-color:#D97706;color:#FFFFFF;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">
            Accept Quote
          </a>
        </div>
        <p style="margin:24px 0 0;font-size:14px;color:#6B7280;">
          Or call us: <a href="tel:09-390-3620" style="color:#D97706;font-weight:600;">09-390-3620</a><br>
          Email: <a href="mailto:info@theprimeelectrical.co.nz" style="color:#D97706;">info@theprimeelectrical.co.nz</a>
        </p>
      </td></tr>
      <tr><td style="padding:16px 32px;border-top:1px solid #E2E8F0;">
        <p style="margin:0;font-size:11px;color:#9CA3AF;">
          Prime Electrical · Unit 2, 41 Smales Road, East Tāmaki, Auckland 2013<br>
          This is a follow-up for your pending quote. Reply to opt out of reminders.
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
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
      .select('id, total_amount, currency, status, contact_id, ai_notes, updated_at')
      .eq('id', parsed.data.quote_id)
      .single();

    if (quoteErr || !quote) {
      return Response.json({ data: null, error: 'Quote not found' }, { status: 404 });
    }

    if (quote.status !== 'sent') {
      return Response.json({
        data: null,
        error: `Quote status is '${quote.status}' — follow-up only applies to 'sent' quotes`,
      }, { status: 409 });
    }

    const sentAt = new Date(quote.updated_at).getTime();
    const hoursSinceSent = (Date.now() - sentAt) / (1000 * 60 * 60);
    if (hoursSinceSent < parsed.data.min_hours_since_sent) {
      return Response.json({
        data: null,
        error: `Quote was sent ${hoursSinceSent.toFixed(1)}h ago — minimum is ${parsed.data.min_hours_since_sent}h`,
      }, { status: 429 });
    }

    if (!quote.contact_id) {
      return Response.json({ data: null, error: 'Quote has no associated contact' }, { status: 422 });
    }

    const { data: contact, error: contactErr } = await supabase
      .from('contacts')
      .select('full_name, email')
      .eq('id', quote.contact_id)
      .single();

    if (contactErr || !contact?.email) {
      return Response.json({ data: null, error: 'Contact not found or missing email' }, { status: 404 });
    }

    const acceptUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/quote-accept?quote_id=${quote.id}`;
    const html = buildFollowupHtml(
      contact.full_name ?? 'Valued Customer',
      quote.id,
      quote.total_amount,
      acceptUrl,
    );

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'quotes@theprimeelectrical.co.nz',
        to: contact.email,
        subject: `Following up on your Prime Electrical quote — $${(quote.total_amount / 100).toFixed(2)} NZD`,
        html,
      }),
    });

    if (!resendRes.ok) {
      const errBody = await resendRes.text();
      console.error('[quote-followup][resend]', resendRes.status, errBody);
      return Response.json({ data: null, error: 'Email delivery failed' }, { status: 502 });
    }

    const existingNotes = (quote.ai_notes as Record<string, unknown>) ?? {};
    await supabase
      .from('quotes')
      .update({
        ai_notes: {
          ...existingNotes,
          followup_sent_at: new Date().toISOString(),
          followup_count: ((existingNotes.followup_count as number) ?? 0) + 1,
        },
      })
      .eq('id', parsed.data.quote_id);

    console.log(`[quote-followup] quote_id=${parsed.data.quote_id} sent_to=${contact.email}`);

    return Response.json({
      data: { quote_id: parsed.data.quote_id, sent_to: contact.email, status: 'followup_sent' },
      error: null,
    });
  } catch (err) {
    console.error('[quote-followup][unhandled]', err instanceof Error ? err.message : String(err));
    return Response.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
});

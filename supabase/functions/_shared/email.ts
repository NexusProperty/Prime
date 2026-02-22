import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

export type QuoteEmailParams = {
  brandName: string;
  brandColour: string;
  contactName: string;
  quoteId: string;
  lineItems: Array<{ description: string; quantity: number; unit_price: number; total: number }>;
  totalAmount: number;
  currency: string;
  validUntil: string | null;
  notes: string | null;
  brandInsert: string;
  footerLines: string[];
  phone: string;
  acceptUrl: string;
};

export function buildQuoteEmail(params: QuoteEmailParams): string {
  const formatCents = (cents: number): string =>
    `$${(cents / 100).toLocaleString('en-NZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${params.currency}`;

  const lineItemRows = params.lineItems.map((item, i) => `
    <tr style="background-color:${i % 2 === 0 ? '#F8FAFC' : '#FFFFFF'};">
      <td style="padding:10px 12px;font-size:14px;color:#374151;">${item.description}</td>
      <td style="padding:10px 12px;font-size:14px;color:#374151;text-align:center;white-space:nowrap;">${item.quantity}</td>
      <td style="padding:10px 12px;font-size:14px;color:#374151;text-align:right;white-space:nowrap;">${formatCents(item.unit_price)}</td>
      <td style="padding:10px 12px;font-size:14px;color:#374151;text-align:right;white-space:nowrap;font-weight:600;">${formatCents(item.total)}</td>
    </tr>`).join('');

  const notesRow = params.notes
    ? `<tr><td style="padding:16px 32px 0;"><p style="margin:0;font-size:13px;color:#6B7280;font-style:italic;"><strong>Notes:</strong> ${params.notes}</p></td></tr>`
    : '';

  const validUntilFragment = params.validUntil
    ? `&nbsp;&nbsp;·&nbsp;&nbsp;<strong style="color:#374151;">Valid Until:</strong> ${params.validUntil}`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Your Quote from ${params.brandName}</title></head>
<body style="margin:0;padding:0;background-color:#F1F5F9;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F1F5F9;padding:32px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07);">
      <tr>
        <td style="background-color:${params.brandColour};padding:28px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td><span style="font-size:22px;font-weight:700;color:#FFFFFF;letter-spacing:-0.5px;">${params.brandName}</span></td>
            <td align="right"><span style="font-size:13px;color:rgba(255,255,255,0.8);">📍 Auckland, NZ</span></td>
          </tr></table>
        </td>
      </tr>
      <tr><td style="padding:28px 32px 0;">
        <p style="margin:0 0 8px;font-size:16px;color:#111827;">Hi ${params.contactName},</p>
        <p style="margin:0;font-size:15px;color:#4B5563;">Here's your quote from ${params.brandName}:</p>
      </td></tr>
      <tr><td style="padding:16px 32px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8FAFC;border-radius:8px;border:1px solid #E2E8F0;">
          <tr><td style="padding:12px 16px;font-size:13px;color:#6B7280;">
            <strong style="color:#374151;">Quote Reference:</strong> ${params.quoteId.substring(0, 8).toUpperCase()}${validUntilFragment}
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:20px 32px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:8px;overflow:hidden;border:1px solid #E2E8F0;">
          <tr style="background-color:${params.brandColour};">
            <th style="padding:10px 12px;font-size:12px;font-weight:600;color:#FFFFFF;text-align:left;text-transform:uppercase;letter-spacing:0.5px;">Description</th>
            <th style="padding:10px 12px;font-size:12px;font-weight:600;color:#FFFFFF;text-align:center;text-transform:uppercase;letter-spacing:0.5px;">Qty</th>
            <th style="padding:10px 12px;font-size:12px;font-weight:600;color:#FFFFFF;text-align:right;text-transform:uppercase;letter-spacing:0.5px;">Unit Price</th>
            <th style="padding:10px 12px;font-size:12px;font-weight:600;color:#FFFFFF;text-align:right;text-transform:uppercase;letter-spacing:0.5px;">Total</th>
          </tr>
          ${lineItemRows}
          <tr style="background-color:#1E293B;">
            <td colspan="3" style="padding:14px 12px;font-size:15px;font-weight:700;color:#FFFFFF;text-align:right;">TOTAL</td>
            <td style="padding:14px 12px;font-size:15px;font-weight:700;color:#FFFFFF;text-align:right;white-space:nowrap;">${formatCents(params.totalAmount)}</td>
          </tr>
        </table>
      </td></tr>
      <tr><td style="padding:16px 32px 0;">
        <table width="100%" cellpadding="0" cellspacing="0"><tr><td>${params.brandInsert}</td></tr></table>
      </td></tr>
      <tr><td style="padding:24px 32px 0;text-align:center;">
        <a href="${params.acceptUrl}" style="display:inline-block;padding:14px 32px;background-color:${params.brandColour};color:#FFFFFF;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;letter-spacing:0.2px;">Accept This Quote</a>
        <p style="margin:12px 0 0;font-size:14px;color:#6B7280;">Or call us: <a href="tel:${params.phone}" style="color:${params.brandColour};font-weight:600;">${params.phone}</a></p>
      </td></tr>
      ${notesRow}
      <tr><td style="padding:24px 32px;border-top:1px solid #E2E8F0;">
        <p style="margin:0;font-size:12px;color:#9CA3AF;line-height:1.6;">${params.footerLines.join('<br>')}</p>
        <p style="margin:12px 0 0;font-size:11px;color:#D1D5DB;">This quote was generated by ${params.brandName} AI quoting system. Prices are estimates — final pricing confirmed after site assessment.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

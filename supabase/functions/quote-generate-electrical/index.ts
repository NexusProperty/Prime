import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { z } from 'npm:zod@3';
import { callOpenRouter, checkIdempotency, insertQuoteWithLineItems } from '../_shared/quotes.ts';

const RequestSchema = z.object({
  job_description: z.string().min(10),
  service_type: z.enum(['essential', 'comfort', 'solar_smart']),
  property_type: z.enum(['residential', 'commercial', 'industrial']),
  property_size: z.enum(['1-2 bed', '3-4 bed', '5+ bed', 'small commercial', 'large commercial']).optional(),
  site_id: z.string().uuid(),
  worker_id: z.string().uuid(),
  contact_id: z.string().uuid(),
  lead_id: z.string().uuid().optional(),
  idempotency_key: z.string().optional(),
});

const SYSTEM_PROMPT = `You are a quoting assistant for Prime Electrical, a licensed electrical contractor in Auckland, New Zealand.

SERVICES: Fault finding & diagnostics, power points, lighting circuits, switchboard upgrades, RCD protection, heat pump installation (Daikin/Panasonic/Mitsubishi), EV charger installation, solar systems (SEANZ-certified), smart home automation (Control4/KNX/DALI).

PRICING (NZD cents — e.g. $150.00 = 15000):
- Labour rate: $120–$150/hour. Always itemise labour hours separately.
- Fault finding / callout: 15000–30000
- Standard power point installation: 8000–15000 each
- Switchboard upgrade (single phase): 250000–500000
- Switchboard upgrade (3-phase): 450000–800000
- RCD/RCBO installation: 30000–60000 per device
- Heat pump supply + install (2.5kW): 180000–250000
- Heat pump supply + install (5kW): 280000–380000
- EV charger (7kW Type 2): 120000–200000
- Solar system (6.6kW + 5kW battery): 1500000–2200000
- Smart home (DALI lighting 10 zones): 800000–2000000

RULES:
1. Break every distinct task into its own line item.
2. Separate labour (hours) from materials/supply where applicable.
3. quantity for labour = hours (decimal ok, e.g. 2.5). unit_price = hourly rate in cents.
4. total MUST equal quantity × unit_price (integer, rounded).
5. valid_until should be 30 days from today unless complexity suggests otherwise.
6. If job description is ambiguous, estimate for the most likely residential scenario.

Return ONLY valid JSON — no explanation, no markdown:
{
  "line_items": [
    { "description": "string", "quantity": number, "unit_price": number, "total": number }
  ],
  "total_amount": number,
  "notes": "string or null",
  "valid_until": "YYYY-MM-DD or null"
}`;

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { status: 200 });
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ data: null, error: parsed.error.flatten() }, { status: 400 });
    }

    const { job_description, site_id, worker_id, contact_id, lead_id, idempotency_key } = parsed.data;

    if (idempotency_key) {
      const existing = await checkIdempotency(idempotency_key);
      if (existing) {
        return Response.json({ data: { ...existing, idempotent: true }, error: null });
      }
    }

    const model = Deno.env.get('OPENROUTER_MODEL') ?? 'anthropic/claude-3.5-sonnet';
    const llmOutput = await callOpenRouter(SYSTEM_PROMPT, job_description, model);

    const quoteId = await insertQuoteWithLineItems(llmOutput, {
      site_id,
      worker_id,
      contact_id,
      lead_id,
      idempotency_key,
      ai_model: model,
    });

    console.log(`[quote-generate-electrical] quote_id=${quoteId} total=${llmOutput.total_amount} items=${llmOutput.line_items.length}`);

    return Response.json({
      data: {
        quote_id: quoteId,
        status: 'draft',
        total_amount: llmOutput.total_amount,
        currency: 'NZD',
        line_items: llmOutput.line_items,
      },
      error: null,
    });
  } catch (err) {
    console.error('[quote-generate-electrical][unhandled]', err instanceof Error ? err.message : String(err));
    return Response.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
});

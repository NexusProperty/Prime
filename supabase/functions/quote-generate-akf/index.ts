import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { z } from 'npm:zod@3';
import { LLMQuoteOutputSchema, callOpenRouter, checkIdempotency, insertQuoteWithLineItems } from '../_shared/quotes.ts';

const RequestSchema = z.object({
  job_description: z.string().min(10),
  service_type: z.enum(['renovation', 'deck', 'new_build', 'fencing', 'landscaping']),
  property_type: z.enum(['residential', 'commercial']).optional(),
  property_location: z.string().optional(),
  site_id: z.string().uuid(),
  worker_id: z.string().uuid(),
  contact_id: z.string().uuid(),
  lead_id: z.string().uuid().optional(),
  idempotency_key: z.string().optional(),
});

const AKFLLMOutputSchema = LLMQuoteOutputSchema.extend({
  consent_required: z.boolean(),
  consent_notes: z.string().nullable().optional(),
});

const SYSTEM_PROMPT = `You are a quoting assistant for AKF Construction Ltd, a licensed general contractor in Auckland, New Zealand. Established 2010.

SERVICES: Residential renovations (kitchens, bathrooms, structural alterations), architectural decks, new builds and extensions, fencing and boundaries, landscaping.

PRICING (NZD cents — e.g. $15,000.00 = 1500000):
- Builder labour rate: $90–$120/hour
- Kitchen renovation (mid-range, full gut): 3500000–6000000
- Kitchen renovation (premium): 6000000–10000000
- Bathroom renovation (standard): 1800000–3500000
- Bathroom renovation (ensuite, premium): 3500000–6000000
- Hardwood deck: 90000–120000 per m² installed
- Composite deck (Trex/Millboard): 70000–100000 per m² installed
- Pine deck: 50000–70000 per m² installed
- Glass balustrade: 45000–60000 per linear metre
- Stairs (single flight): 250000–450000
- Pergola addition: 1000000–2000000
- Horizontal slat privacy fencing: 20000–45000 per linear metre
- Pool fence (glass): 40000–70000 per linear metre
- Retaining wall (concrete block): 120000–350000 per m²
- Driveway (concrete): 10000–18000 per m²
- New build: 350000–650000 per m²

BUILDING CONSENT RULES (Auckland Council):
Consent IS REQUIRED for:
- Any structural work (removing/adding walls, beams)
- Decks more than 1.5m above ground level
- All new builds and extensions > 10m²
- Retaining walls more than 1.5m high
- Any alterations to plumbing or drainage
When consent is required, add a line item:
  { "description": "Auckland Council Building Consent (estimated)", "quantity": 1, "unit_price": [fee], "total": [fee] }
  Consent fee guide: project < $20k → 250000; $20k–$100k → 500000; > $100k → 900000
Set consent_required: true and explain in consent_notes.

RULES:
1. Break every distinct task into its own line item.
2. Separate materials from labour where meaningful.
3. total MUST equal quantity × unit_price (integer, rounded).
4. valid_until: 30 days for standard jobs; 14 days for jobs where materials pricing is volatile (steel, timber).
5. If scope unclear, estimate for residential mid-range finish.

Return ONLY valid JSON — no explanation, no markdown:
{
  "line_items": [
    { "description": "string", "quantity": number, "unit_price": number, "total": number }
  ],
  "total_amount": number,
  "notes": "string or null",
  "valid_until": "YYYY-MM-DD or null",
  "consent_required": true | false,
  "consent_notes": "string or null"
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

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': Deno.env.get('SUPABASE_URL') ?? '',
      },
      body: JSON.stringify({
        model,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: job_description },
        ],
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error('[quote-generate-akf][openrouter]', res.status, errBody);
      return Response.json({ data: null, error: 'LLM request failed' }, { status: 502 });
    }

    const json = await res.json();
    const raw = JSON.parse(json.choices[0].message.content);
    const akfParsed = AKFLLMOutputSchema.safeParse(raw);

    if (!akfParsed.success) {
      console.error('[quote-generate-akf][zod]', JSON.stringify(akfParsed.error.flatten()));
      return Response.json({ data: null, error: 'AI returned invalid quote structure' }, { status: 422 });
    }

    const { consent_required, consent_notes, ...baseLLMOutput } = akfParsed.data;

    const quoteId = await insertQuoteWithLineItems(baseLLMOutput, {
      site_id,
      worker_id,
      contact_id,
      lead_id,
      idempotency_key,
      ai_model: model,
      extra_fields: {
        consent_required: consent_required ?? false,
        consent_notes: consent_notes ?? null,
        ai_notes: { consent_required, consent_notes },
      },
    });

    console.log(`[quote-generate-akf] quote_id=${quoteId} total=${baseLLMOutput.total_amount} consent=${consent_required}`);

    return Response.json({
      data: {
        quote_id: quoteId,
        status: 'draft',
        total_amount: baseLLMOutput.total_amount,
        currency: 'NZD',
        line_items: baseLLMOutput.line_items,
        consent_required: consent_required ?? false,
        consent_notes: consent_notes ?? null,
      },
      error: null,
    });
  } catch (err) {
    console.error('[quote-generate-akf][unhandled]', err instanceof Error ? err.message : String(err));
    return Response.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
});

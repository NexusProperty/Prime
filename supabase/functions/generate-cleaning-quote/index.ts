import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { z } from 'npm:zod@3';
import { LLMQuoteOutputSchema, checkIdempotency, insertQuoteWithLineItems } from '../_shared/quotes.ts';

const RequestSchema = z.object({
  job_description: z.string().min(10),
  service_type: z.enum(['post_build', 'end_of_tenancy', 'deep_clean_custom', 'commercial']),
  property_type: z.enum(['apartment', 'house', 'townhouse', 'commercial']),
  bedrooms: z.number().int().min(1).optional(),
  bathrooms: z.number().int().min(1).optional(),
  area_m2: z.number().positive().optional(),
  property_condition: z.enum(['good', 'average', 'poor', 'post_renovation']).optional(),
  extras: z.array(z.string()).default([]),
  urgency: z.enum(['standard', 'urgent', 'same_day']).default('standard'),
  subscription: z.boolean().default(false),
  site_id: z.string().uuid(),
  worker_id: z.string().uuid(),
  contact_id: z.string().uuid().optional(),
  lead_id: z.string().uuid().optional(),
  idempotency_key: z.string().optional(),
  referred_by: z.enum(['akf_construction', 'prime_electrical', 'direct']).default('direct'),
});

const CleaningLLMOutputSchema = LLMQuoteOutputSchema.extend({
  recommended_service: z.enum(['regular', 'deep_clean', 'end_of_tenancy', 'post_build']),
  duration_hours: z.number().positive(),
});

const SYSTEM_PROMPT = `You are a quoting assistant for CleanJet, a professional residential cleaning service in Auckland, New Zealand.

SERVICES: Regular maintenance cleans, deep cleans, end of tenancy cleans, post-build/renovation cleans, commercial cleans.

PRICING (NZD cents — e.g. $79.00 = 7900):
- Regular clean: 4500–6000 per bedroom (minimum 7900 for 1-2 bed)
- Deep clean: 6500–8500 per bedroom (minimum 14900 for 1-2 bed)
- End of tenancy: base 24900 for 1-2 bed; add 8000 per additional bedroom
- Post-build clean (light dust — paint only): 18000 per bedroom (minimum 35000)
- Post-build clean (medium construction dust): 25000 per bedroom
- Post-build clean (heavy — structural, multiple trades): 35000 per bedroom
- Carpet steam clean: 6000–12000 per room (lower for regular, higher for heavily soiled)
- Oven deep clean: 6500–9000
- Internal window cleaning: 1500–2500 per window
- External window cleaning (add 50% to internal rate)
- Garage clean: 8000–15000
- Pet hair removal: 3000–6000 flat fee

URGENCY SURCHARGES:
- urgent (same-day or next-day): +25% to total
- standard: no surcharge

END OF TENANCY DEFAULTS:
Always include oven clean. If any carpet staining mentioned, include carpet steam. Include all bathrooms in the base price.

POST-BUILD ASSESSMENT:
Estimate dust level from renovation description:
- light: painting, tiling, minor cosmetic work
- medium: kitchen/bathroom renovation, plastering
- heavy: structural work, new builds, multiple trades on site

RULES:
1. Break into clear line items (base clean, each extra separately).
2. total MUST equal quantity × unit_price (integer, rounded).
3. Include recommended_service and duration_hours in output.
4. duration_hours: regular = 0.75h/room; deep = 1.25h/room; end of tenancy = 1.5h/room + extras.

Return ONLY valid JSON — no explanation, no markdown:
{
  "line_items": [
    { "description": "string", "quantity": number, "unit_price": number, "total": number }
  ],
  "total_amount": number,
  "notes": "string or null",
  "valid_until": "YYYY-MM-DD or null",
  "recommended_service": "regular | deep_clean | end_of_tenancy | post_build",
  "duration_hours": number
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

    const { job_description, site_id, worker_id, contact_id, lead_id, idempotency_key, urgency } = parsed.data;

    if (idempotency_key) {
      const existing = await checkIdempotency(idempotency_key);
      if (existing) {
        return Response.json({ data: { ...existing, idempotent: true }, error: null });
      }
    }

    const model = Deno.env.get('OPENROUTER_MODEL') ?? 'anthropic/claude-3.5-sonnet';

    const userMessage = urgency !== 'standard'
      ? `${job_description}\n\nURGENCY: ${urgency} — apply +25% surcharge to total.`
      : job_description;

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
          { role: 'user', content: userMessage },
        ],
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error('[generate-cleaning-quote][openrouter]', res.status, errBody);
      return Response.json({ data: null, error: 'LLM request failed' }, { status: 502 });
    }

    const json = await res.json();
    const raw = JSON.parse(json.choices[0].message.content);
    const cleaningParsed = CleaningLLMOutputSchema.safeParse(raw);

    if (!cleaningParsed.success) {
      console.error('[generate-cleaning-quote][zod]', JSON.stringify(cleaningParsed.error.flatten()));
      return Response.json({ data: null, error: 'AI returned invalid quote structure' }, { status: 422 });
    }

    const { recommended_service, duration_hours, ...baseLLMOutput } = cleaningParsed.data;
    const cleanersRequired = duration_hours > 4 || recommended_service === 'post_build' ? 2 : 1;

    const quoteId = await insertQuoteWithLineItems(baseLLMOutput, {
      site_id,
      worker_id,
      contact_id,
      lead_id,
      idempotency_key,
      ai_model: model,
      extra_fields: {
        service_duration_hours: duration_hours,
        cleaners_required: cleanersRequired,
        ai_notes: { recommended_service, duration_hours },
      },
    });

    console.log(`[generate-cleaning-quote] quote_id=${quoteId} total=${baseLLMOutput.total_amount} service=${recommended_service} duration=${duration_hours}h`);

    return Response.json({
      data: {
        quote_id: quoteId,
        status: 'draft',
        total_amount: baseLLMOutput.total_amount,
        currency: 'NZD',
        line_items: baseLLMOutput.line_items,
        recommended_service,
        duration_hours,
        cleaners_required: cleanersRequired,
      },
      error: null,
    });
  } catch (err) {
    console.error('[generate-cleaning-quote][unhandled]', err instanceof Error ? err.message : String(err));
    return Response.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
});

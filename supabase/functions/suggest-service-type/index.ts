import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { z } from 'npm:zod@3';

const RequestSchema = z.object({
  customer_description: z.string().min(5),
  property_bedrooms: z.number().int().positive().optional(),
  moving_out: z.boolean().optional(),
  post_renovation: z.boolean().optional(),
});

const RecommendationSchema = z.object({
  recommended_service: z.enum(['regular', 'deep_clean', 'end_of_tenancy', 'post_build']),
  confidence: z.enum(['high', 'medium', 'low']),
  reasoning: z.string(),
  price_range: z.object({
    min_cents: z.number().int().nonnegative(),
    max_cents: z.number().int().nonnegative(),
  }),
});

const SYSTEM_PROMPT = `You are a CleanJet booking assistant helping Auckland customers choose the right cleaning service.

SERVICE DEFINITIONS:
- regular: Routine maintenance clean. Light dust and vacuum. Not suitable for move-out or post-renovation.
- deep_clean: Thorough clean of all surfaces, inside appliances, behind furniture. Suitable for spring clean or neglected property.
- end_of_tenancy: Full move-out clean meeting bond requirements. Must include oven, all surfaces, carpet steam if stained.
- post_build: Specialist construction dust removal. Requires specialist equipment and HEPA filtration.

PRICE RANGES (NZD cents, based on 3 bedroom average):
- regular: 18000–22000
- deep_clean: 25000–35000
- end_of_tenancy: 32900–45000
- post_build: 54000–105000

Respond with JSON only:
{
  "recommended_service": "regular | deep_clean | end_of_tenancy | post_build",
  "confidence": "high | medium | low",
  "reasoning": "2-3 sentence explanation",
  "price_range": { "min_cents": number, "max_cents": number }
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

    const { customer_description, property_bedrooms, moving_out, post_renovation } = parsed.data;

    const contextHints = [
      property_bedrooms ? `Property has ${property_bedrooms} bedroom(s).` : '',
      moving_out ? 'Customer is moving out.' : '',
      post_renovation ? 'Property has undergone recent renovation/construction.' : '',
    ].filter(Boolean).join(' ');

    const userMessage = `${customer_description}${contextHints ? '\n\nContext: ' + contextHints : ''}`;

    const model = Deno.env.get('OPENROUTER_MODEL') ?? 'anthropic/claude-3.5-sonnet';

    const llmRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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

    if (!llmRes.ok) {
      console.error('[suggest-service-type][openrouter]', llmRes.status);
      return Response.json({ data: null, error: 'LLM request failed' }, { status: 502 });
    }

    const llmJson = await llmRes.json();
    const raw = JSON.parse(llmJson.choices[0].message.content);
    const recParsed = RecommendationSchema.safeParse(raw);

    if (!recParsed.success) {
      console.error('[suggest-service-type][zod]', JSON.stringify(recParsed.error.flatten()));
      return Response.json({ data: null, error: 'Invalid recommendation output' }, { status: 422 });
    }

    return Response.json({ data: recParsed.data, error: null });
  } catch (err) {
    console.error('[suggest-service-type][unhandled]', err instanceof Error ? err.message : String(err));
    return Response.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
});

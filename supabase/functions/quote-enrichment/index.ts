import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { z } from 'npm:zod@3';

const RequestSchema = z.object({
  quote_id: z.string().uuid(),
  include_cross_sell: z.boolean().default(true),
});

const EnrichmentOutputSchema = z.object({
  upsell_suggestions: z.array(z.object({
    description: z.string(),
    reason: z.string(),
    estimated_value_cents: z.number().int().nonnegative(),
  })).default([]),
  financing_recommended: z.boolean(),
  cross_sell_opportunities: z.array(z.object({
    brand: z.enum(['akf', 'cleanjet']),
    reason: z.string(),
    pitch: z.string(),
  })).default([]),
  review_notes: z.string(),
});

const ENRICHMENT_SYSTEM_PROMPT = `You are a quote quality reviewer for Prime Electrical, an Auckland electrical contractor.
You receive a completed quote and job description. Identify upsell opportunities, cross-sell signals, and pricing issues.

Respond with JSON only:
{
  "upsell_suggestions": [
    { "description": "string", "reason": "string", "estimated_value_cents": number }
  ],
  "financing_recommended": true | false,
  "cross_sell_opportunities": [
    { "brand": "akf | cleanjet", "reason": "string", "pitch": "string" }
  ],
  "review_notes": "string — 1-3 sentences on quote accuracy and completeness"
}

UPSELL TRIGGERS:
- Switchboard upgrade quoted → suggest EV-charger-ready conduit (+$800)
- Heat pump quoted → suggest smart thermostat integration (+$400)
- Solar quoted → suggest Tesla Powerwall or Enphase battery (+$8,000–$15,000)
- Any job > $1,200 → set financing_recommended: true

CROSS-SELL TRIGGERS (write to cross_sell_opportunities):
- Job description mentions renovation, building work, new kitchen/bathroom → brand: "akf"
- Job description mentions move-in, move-out, renovation clean, builder → brand: "cleanjet"`;

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
      .select('id, total_amount, notes, lead_id, contact_id, ai_notes')
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

    const lineItemsSummary = (lineItems ?? [])
      .map((i) => `- ${i.description}: qty ${i.quantity} × $${(i.unit_price / 100).toFixed(2)} = $${(i.total / 100).toFixed(2)}`)
      .join('\n');

    const userMessage = `Job notes: ${quote.notes ?? 'N/A'}

Line items:
${lineItemsSummary}

Total: $${(quote.total_amount / 100).toFixed(2)} NZD`;

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
          { role: 'system', content: ENRICHMENT_SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
      }),
    });

    if (!llmRes.ok) {
      console.error('[quote-enrichment][openrouter]', llmRes.status);
      return Response.json({ data: null, error: 'LLM request failed' }, { status: 502 });
    }

    const llmJson = await llmRes.json();
    const raw = JSON.parse(llmJson.choices[0].message.content);
    const enrichParsed = EnrichmentOutputSchema.safeParse(raw);

    if (!enrichParsed.success) {
      console.error('[quote-enrichment][zod]', JSON.stringify(enrichParsed.error.flatten()));
      return Response.json({ data: null, error: 'Invalid enrichment output' }, { status: 422 });
    }

    const enrichment = enrichParsed.data;

    await supabase
      .from('quotes')
      .update({ ai_notes: { ...((quote.ai_notes as object) ?? {}), enrichment } })
      .eq('id', parsed.data.quote_id);

    if (parsed.data.include_cross_sell && quote.lead_id) {
      for (const opportunity of enrichment.cross_sell_opportunities) {
        await supabase.from('cross_sell_events').insert({
          lead_id: quote.lead_id,
          source_brand: 'prime',
          target_brand: opportunity.brand,
          pitch: opportunity.pitch,
          status: 'triggered',
        });
      }
    }

    console.log(`[quote-enrichment] quote_id=${parsed.data.quote_id} upsells=${enrichment.upsell_suggestions.length} cross_sell=${enrichment.cross_sell_opportunities.length}`);

    return Response.json({ data: enrichment, error: null });
  } catch (err) {
    console.error('[quote-enrichment][unhandled]', err instanceof Error ? err.message : String(err));
    return Response.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
});

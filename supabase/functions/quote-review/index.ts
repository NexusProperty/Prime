import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { z } from 'npm:zod@3';

const RequestSchema = z.object({
  quote_id: z.string().uuid(),
  auto_send: z.boolean().default(false),
});

const ReviewOutputSchema = z.object({
  approved: z.boolean(),
  confidence_score: z.number().min(0).max(100),
  issues: z.array(z.string()).default([]),
  suggestions: z.array(z.string()).default([]),
  review_notes: z.string(),
});

const REVIEW_SYSTEM_PROMPT = `You are a senior quality reviewer for Prime Electrical, an Auckland residential and commercial electrician.
Review the provided electrical quote and determine if it is ready to send to the customer.

Respond with JSON only:
{
  "approved": true | false,
  "confidence_score": 0-100,
  "issues": ["string", ...],
  "suggestions": ["string", ...],
  "review_notes": "1-3 sentences"
}

APPROVAL CRITERIA:
- All line items have clear, customer-friendly descriptions
- Pricing is reasonable for Auckland electrical market (residential: $120-$180/hr labour)
- Total quote amount is plausible for the scope of work
- No duplicate line items
- Notes are professional and clear

REJECTION TRIGGERS (set approved: false):
- Total amount is suspiciously high (> $50,000 for residential without obvious reason)
- Total amount is suspiciously low (< $150 for any site visit)
- Line items are vague or contain internal codes
- Obvious pricing arithmetic errors (total != quantity × unit_price)
- Job description does not match the quoted work

Set confidence_score to 0-100 based on how confident you are in the quality of this quote.`;

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
      .select('id, total_amount, currency, notes, status, ai_notes, contact_id')
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

    const userMessage = `Quote status: ${quote.status}
Total: $${(quote.total_amount / 100).toFixed(2)} NZD

Line items:
${lineItemsSummary}

Job notes: ${quote.notes ?? 'N/A'}`;

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
          { role: 'system', content: REVIEW_SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
      }),
    });

    if (!llmRes.ok) {
      console.error('[quote-review][openrouter]', llmRes.status);
      return Response.json({ data: null, error: 'LLM request failed' }, { status: 502 });
    }

    const llmJson = await llmRes.json();
    const raw = JSON.parse(llmJson.choices[0].message.content);
    const reviewParsed = ReviewOutputSchema.safeParse(raw);

    if (!reviewParsed.success) {
      console.error('[quote-review][zod]', JSON.stringify(reviewParsed.error.flatten()));
      return Response.json({ data: null, error: 'Invalid review output' }, { status: 422 });
    }

    const review = reviewParsed.data;
    const newStatus = review.approved ? 'pending_review' : 'draft';

    await supabase
      .from('quotes')
      .update({
        status: newStatus,
        ai_notes: { ...((quote.ai_notes as object) ?? {}), review },
      })
      .eq('id', parsed.data.quote_id);

    if (review.approved && parsed.data.auto_send) {
      fetch(
        `${Deno.env.get('SUPABASE_URL')}/functions/v1/quote-send-electrical`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          },
          body: JSON.stringify({ quote_id: parsed.data.quote_id }),
        },
      ).catch((err) => { console.error('[quote-review][auto-send]', err); });
    }

    console.log(`[quote-review] quote_id=${parsed.data.quote_id} approved=${review.approved} confidence=${review.confidence_score}`);

    return Response.json({
      data: {
        quote_id: parsed.data.quote_id,
        approved: review.approved,
        confidence_score: review.confidence_score,
        issues: review.issues,
        suggestions: review.suggestions,
        review_notes: review.review_notes,
        new_status: newStatus,
      },
      error: null,
    });
  } catch (err) {
    console.error('[quote-review][unhandled]', err instanceof Error ? err.message : String(err));
    return Response.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
});

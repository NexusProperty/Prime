import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { z } from 'npm:zod@3';
import { createClient } from 'jsr:@supabase/supabase-js@2';

// ── Shared Zod Schemas ────────────────────────────────────────────────────────
// Values MUST match the SQL CHECK constraint in quotes table exactly.

export const QuoteStatusSchema = z.enum([
  'draft', 'pending_review', 'sent', 'accepted', 'rejected', 'expired',
]);

export const QuoteLineItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().positive(),
  unit_price: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
}).refine(
  (item) => item.total === Math.round(item.quantity * item.unit_price),
  { message: 'total must equal quantity × unit_price (rounded)' },
);

export const LLMQuoteOutputSchema = z.object({
  line_items: z.array(QuoteLineItemSchema).min(1),
  total_amount: z.number().int().nonnegative(),
  notes: z.string().nullable().optional(),
  valid_until: z.string().nullable().optional(),
});

export type LLMQuoteOutput = z.infer<typeof LLMQuoteOutputSchema>;
export type QuoteLineItem = z.infer<typeof QuoteLineItemSchema>;

// ── OpenRouter Call Helper ────────────────────────────────────────────────────

export async function callOpenRouter(
  systemPrompt: string,
  userMessage: string,
  model?: string,
): Promise<LLMQuoteOutput> {
  const resolvedModel = model ?? Deno.env.get('OPENROUTER_MODEL') ?? 'anthropic/claude-3.5-sonnet';

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': Deno.env.get('SUPABASE_URL') ?? '',
    },
    body: JSON.stringify({
      model: resolvedModel,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${body}`);
  }

  const json = await res.json();
  const raw = JSON.parse(json.choices[0].message.content);
  const parsed = LLMQuoteOutputSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(`LLM output failed Zod validation: ${JSON.stringify(parsed.error.flatten())}`);
  }

  return parsed.data;
}

// ── Quote DB Insert Helper ────────────────────────────────────────────────────

export type QuoteInsertParams = {
  site_id: string;
  worker_id: string;
  contact_id?: string;
  lead_id?: string;
  idempotency_key?: string;
  ai_model: string;
  extra_fields?: Record<string, unknown>;
};

export async function insertQuoteWithLineItems(
  llmOutput: LLMQuoteOutput,
  params: QuoteInsertParams,
): Promise<string> {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: quote, error: quoteErr } = await supabase
    .from('quotes')
    .insert({
      site_id: params.site_id,
      worker_id: params.worker_id,
      contact_id: params.contact_id ?? null,
      lead_id: params.lead_id ?? null,
      status: 'draft',
      total_amount: llmOutput.total_amount,
      currency: Deno.env.get('CURRENCY') ?? 'NZD',
      ai_generated: true,
      ai_model: params.ai_model,
      notes: llmOutput.notes ?? null,
      valid_until: llmOutput.valid_until ?? null,
      idempotency_key: params.idempotency_key ?? null,
      ...params.extra_fields,
    })
    .select('id')
    .single();

  if (quoteErr || !quote) {
    throw new Error(quoteErr?.message ?? 'Failed to insert quote');
  }

  const { error: itemsErr } = await supabase
    .from('quote_line_items')
    .insert(
      llmOutput.line_items.map((item, idx) => ({
        quote_id: quote.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.total,
        sort_order: idx,
      })),
    );

  if (itemsErr) {
    throw new Error(`Failed to insert line items: ${itemsErr.message}`);
  }

  return quote.id;
}

// ── Idempotency Check Helper ──────────────────────────────────────────────────

export async function checkIdempotency(
  idempotency_key: string,
): Promise<{ quote_id: string; status: string; total_amount: number; currency: string } | null> {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data } = await supabase
    .from('quotes')
    .select('id, status, total_amount, currency')
    .eq('idempotency_key', idempotency_key)
    .gte('created_at', new Date(Date.now() - 60_000).toISOString())
    .maybeSingle();

  if (!data) return null;

  return {
    quote_id: data.id,
    status: data.status,
    total_amount: data.total_amount,
    currency: data.currency,
  };
}

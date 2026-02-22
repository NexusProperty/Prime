---
name: ai-quote-implementation
description: Implement an AI quote generation Edge Function using Deno, Zod, and OpenRouter. Covers scaffolding, LLM prompt design, idempotency, DB persistence, and deployment.
when_to_use: When implementing the quote-generate or quote-send Supabase Edge Functions for the /ai-quote command. Activates after ai-quoting-architecture skill has confirmed the schema exists and the data model is validated.
evidence: User runs /ai-quote generate, asks to scaffold quote-generate Edge Function, or requests implementation of AI quoting logic.
---

# AI Quote Implementation Skill

## Overview

This skill implements the `quote-generate` Supabase Edge Function — the core of the AI quoting feature. It runs after `ai-quoting-architecture` has confirmed schema readiness and data model consistency. The function accepts a job description, calls OpenRouter to generate a structured quote, validates it with Zod, persists it to Supabase, and returns the quote ID.

**Key engineering constraints:**
- Deno runtime — no Node.js APIs
- All secrets via `Deno.env.get()` — never hardcoded
- Idempotency via `idempotency_key` — prevents duplicate quotes from retried calls
- Zod validates ALL incoming requests AND the LLM's JSON response
- Returns `{ data, error }` format — never throws uncaught exceptions

## Prerequisites

- `ai-quoting-architecture` skill must have run first and confirmed schema readiness
- `quotes` and `quote_line_items` tables exist in Supabase (created by `/ai-quote schema`)
- `workers` table exists in Supabase (created by `/ai-quote schema`)
- `OPENROUTER_API_KEY` set in Supabase Vault
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` set in Supabase Vault
- `BUSINESS_TYPE` set in Supabase Vault (e.g. `"electrical contracting"`)
- `BUSINESS_LOCATION` set in Supabase Vault (e.g. `"Auckland, New Zealand"`)
- `CURRENCY` set in Supabase Vault (e.g. `"NZD"`) — optional, defaults to NZD
- `edge-function-developer-fast` agent available

## Steps

### Step 1 — Scaffold `supabase/functions/quote-generate/index.ts`

Create the file with this structure:

```typescript
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ── Input Schema ──────────────────────────────────────────────────────────────
const RequestSchema = z.object({
  job_description: z.string().min(10, 'Job description must be at least 10 characters'),
  site_id: z.string().uuid(),
  worker_id: z.string().uuid(),
  contact_id: z.string().uuid(),
  idempotency_key: z.string().optional(),
})

// ── Quote Output Schema (must match Quote data model) ─────────────────────────
const QuoteLineItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().positive(),
  unit_price: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
}).refine(item => item.total === Math.round(item.quantity * item.unit_price), {
  message: 'total must equal quantity × unit_price',
})

const LLMOutputSchema = z.object({
  line_items: z.array(QuoteLineItemSchema).min(1),
  total_amount: z.number().int().nonnegative(),
  notes: z.string().nullable().optional(),
  valid_until: z.string().nullable().optional(),
})

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const body = await req.json()
    const parsed = RequestSchema.safeParse(body)
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ data: null, error: parsed.error.flatten() }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { job_description, site_id, worker_id, contact_id, idempotency_key } = parsed.data

    // ── Idempotency Check ───────────────────────────────────────────────────
    if (idempotency_key) {
      const { data: existing } = await supabase
        .from('quotes')
        .select('id, status, total_amount, currency')
        .eq('idempotency_key', idempotency_key)
        .gte('created_at', new Date(Date.now() - 60_000).toISOString())
        .maybeSingle()

      if (existing) {
        return new Response(
          JSON.stringify({ data: { quote_id: existing.id, status: existing.status, total_amount: existing.total_amount, currency: existing.currency, idempotent: true }, error: null }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // ── OpenRouter LLM Call ─────────────────────────────────────────────────
    const model = Deno.env.get('OPENROUTER_MODEL') ?? 'anthropic/claude-3.5-sonnet'
    const llmResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
          {
            role: 'system',
            content: `You are a quoting assistant for a ${Deno.env.get('BUSINESS_TYPE') ?? 'contracting'} business in ${Deno.env.get('BUSINESS_LOCATION') ?? 'your region'}.
Given a job description, produce a detailed quote broken into specific line items.
All prices are in ${Deno.env.get('CURRENCY') ?? 'NZD'} cents (e.g. $150.00 = 15000).
Be specific — break every distinct task into its own line item.
Return ONLY valid JSON in this exact format:
{
  "line_items": [
    { "description": "string", "quantity": number, "unit_price": number, "total": number }
  ],
  "total_amount": number,
  "notes": "string or null",
  "valid_until": "YYYY-MM-DD or null"
}`,
          },
          { role: 'user', content: job_description },
        ],
      }),
    })

    if (!llmResponse.ok) {
      const err = await llmResponse.text()
      console.log(JSON.stringify({ level: 'error', source: 'openrouter', status: llmResponse.status, body: err }))
      return new Response(
        JSON.stringify({ data: null, error: 'LLM request failed' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const llmJson = await llmResponse.json()
    const llmContent = JSON.parse(llmJson.choices[0].message.content)
    const validated = LLMOutputSchema.safeParse(llmContent)

    if (!validated.success) {
      console.log(JSON.stringify({ level: 'error', source: 'zod', errors: validated.error.flatten() }))
      return new Response(
        JSON.stringify({ data: null, error: 'AI returned invalid quote structure' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { line_items, total_amount, notes, valid_until } = validated.data

    // ── DB Insert ───────────────────────────────────────────────────────────
    const { data: quote, error: quoteErr } = await supabase
      .from('quotes')
      .insert({
        site_id, worker_id, contact_id,
        status: 'draft',
        total_amount,
        currency: 'NZD',
        ai_generated: true,
        ai_model: model,
        notes: notes ?? null,
        valid_until: valid_until ?? null,
        idempotency_key: idempotency_key ?? null,
      })
      .select('id')
      .single()

    if (quoteErr || !quote) {
      return new Response(
        JSON.stringify({ data: null, error: quoteErr?.message ?? 'Failed to create quote' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    await supabase.from('quote_line_items').insert(
      line_items.map((item, idx) => ({
        quote_id: quote.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.total,
        sort_order: idx,
      }))
    )

    console.log(JSON.stringify({ level: 'info', event: 'quote_generated', quote_id: quote.id, total_amount, line_item_count: line_items.length }))

    return new Response(
      JSON.stringify({ data: { quote_id: quote.id, status: 'draft', total_amount, currency: 'NZD' }, error: null }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.log(JSON.stringify({ level: 'error', message: err instanceof Error ? err.message : String(err) }))
    return new Response(
      JSON.stringify({ data: null, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

**Success Criteria:** File created at `supabase/functions/quote-generate/index.ts`. No Node.js APIs. No hardcoded secrets. Zod validates both request and LLM response.

---

### Step 2 — Verify Zod Schema Matches SQL

Before creating any migration, cross-check:

| Zod field | SQL column | Type match |
|-----------|-----------|-----------|
| `status` z.enum([...]) | `CHECK (status IN (...))` | Values identical? |
| `total_amount` z.number().int() | `INTEGER` | Both integers (cents)? |
| `line_items[].total` refine | computed in app | `total = quantity × unit_price`? |
| `site_id` z.string().uuid() | `UUID REFERENCES sites(id)` | UUID type? |
| `idempotency_key` optional | `TEXT UNIQUE` | UNIQUE constraint present? |

**Success Criteria:** All mismatches identified and resolved before deployment.

---

### Step 3 — Add Idempotency Check

Confirm the Edge Function includes:
1. Accept `idempotency_key?: string` in request body
2. Query: `WHERE idempotency_key = $1 AND created_at > NOW() - INTERVAL '60 seconds'`
3. If found: return existing quote immediately with `{ idempotent: true }`
4. `quotes` table has `idempotency_key TEXT UNIQUE` column

**Success Criteria:** Idempotency logic present. Duplicate POST within 60s returns same quote_id.

---

### Step 4 — Handle All Error Paths

Ensure every failure has a named, logged response:

| Failure | Response code | Log level |
|---------|-------------|----------|
| Invalid request body (Zod) | 400 | warn |
| OpenRouter API error | 502 | error |
| LLM response fails Zod validation | 422 | error |
| DB insert fails | 500 | error |
| Uncaught exception | 500 | error |

**Success Criteria:** No silent failures. Every error returns `{ data: null, error: string }`.

---

### Step 5 — Deploy and Smoke Test

```bash
# Deploy the function
supabase functions deploy quote-generate

# Set required secrets (if not already set)
supabase secrets set OPENROUTER_API_KEY=sk-or-...
supabase secrets set OPENROUTER_MODEL=anthropic/claude-3.5-sonnet

# Smoke test
supabase functions invoke quote-generate --body '{
  "job_description": "Replace main switchboard and install 4 new power points in kitchen. Residential property in Ponsonby, Auckland.",
  "site_id": "[a real site UUID from sites table]",
  "worker_id": "[a real worker UUID from workers table]",
  "contact_id": "[a real contact UUID from contacts table]",
  "idempotency_key": "test-001"
}'
```

Expected response:
```json
{
  "data": {
    "quote_id": "uuid-here",
    "status": "draft",
    "total_amount": 185000,
    "currency": "NZD"
  },
  "error": null
}
```

**Success Criteria:** Function deployed. Smoke test returns valid quote_id. Re-running with same idempotency_key returns same quote_id with `idempotent: true`.

## Verification

After applying this skill, verify:
- [ ] `supabase/functions/quote-generate/index.ts` created and uses Deno.serve
- [ ] No Node.js APIs (no `require`, no `process.env`)
- [ ] All secrets via `Deno.env.get()` — no hardcoded values
- [ ] Zod validates both request body AND LLM JSON response
- [ ] `status` values in Zod enum match SQL CHECK constraint exactly
- [ ] Idempotency check present and queries within 60-second window
- [ ] All error paths return `{ data: null, error: string }` with appropriate status code
- [ ] Structured logging (`console.log(JSON.stringify(...))`) on key events and errors
- [ ] Function deployed successfully with `supabase functions deploy quote-generate`
- [ ] Smoke test returns valid quote_id

## Related

- Skill: `AIquote/ai-quoting-architecture-skill.md` — must run before this skill
- Command: `AIquote/ai-quote-command.md` — the `/ai-quote` command
- Agent: `agents/edge-function-developer-fast.md` — executes scaffolding
- Agent: `agents/database-migration-specialist-fast.md` — creates standalone migration file

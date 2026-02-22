# QUOTES-001 — Implementation Plan
## AI Quote Generation System — Prime Group (3 Brands)

**Status:** PLANNING → READY TO BUILD  
**Complexity:** Level 3  
**Created:** 2026-02-22  
**Supabase Project:** `tfdxlhkaziskkwwohtwd`  
**All functions live in:** `f:/Prime/supabase/functions/`  
**Migration target:** `f:/Prime/supabase/migrations/`

---

## Architecture Summary

All three Prime Group brands (Prime Electrical, AKF Construction, CleanJet) share one Supabase project. Quote functions are brand-specific Edge Functions that write to shared `quotes` and `quote_line_items` tables, isolated by `site_id`.

```
Customer submits lead/form
  ↓
LeadCaptureForm / BookingWizard (Next.js)
  ↓
quote-generate-[brand] (Supabase Edge Function)
  ↓
OpenRouter LLM → Zod validation
  ↓
INSERT quotes + quote_line_items
  ↓
(optional) quote-enrichment → cross_sell_events
  ↓
quote-send-[brand] → Resend email
  ↓
Customer receives formatted quote
```

### Confirmed Existing Infrastructure
- `contacts` table — Mission Control unified contact (FK target for quotes)
- `sites` table — 3 site rows: Prime Electrical, AKF Construction, CleanJet
- `leads` table — legacy lead capture (optional FK from quotes)
- `cross_sell_events` table — `source_brand`/`target_brand` as `site_brand` ENUM
- `site_brand` ENUM — `('prime', 'akf', 'cleanjet')` — reuse in new tables
- `update_updated_at()` trigger function — reuse on new tables
- `_shared/` folder — `env.ts`, `ingest.ts`, `rag.ts`, `security.ts`, `types.ts`

### Confirmed Code Patterns (from existing functions)
```typescript
// CORRECT imports — use these exactly:
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { z } from 'npm:zod@3';

// CORRECT entrypoint:
Deno.serve(async (req: Request): Promise<Response> => { ... });

// CORRECT logging:
console.error('[function-name][operation]', message);
console.log('[function-name] key=value key=value');

// CORRECT Supabase client:
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);
```

---

## Phase 1 — Schema Migration

**File to create:** `f:/Prime/supabase/migrations/20260222003_quotes_schema.sql`  
**Command after creation:** `supabase db push`

### Full Migration SQL

```sql
-- =============================================================================
-- QUOTES-001: AI Quote Generation System — Prime Group
-- Adds: workers, quotes, quote_line_items
-- Supabase project: tfdxlhkaziskkwwohtwd
-- =============================================================================

-- ── Quote Status Enum ──────────────────────────────────────────────────────────
-- Defined as a CHECK constraint (not ENUM type) to allow easy extension.
-- Values must be identical to Zod enum in Edge Functions.

-- ── Workers ───────────────────────────────────────────────────────────────────
-- Prime Group employees/contractors who create and own quotes.
-- site_id links to which brand this worker belongs to.

CREATE TABLE workers (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id     UUID        REFERENCES sites(id) ON DELETE SET NULL,
  full_name   TEXT        NOT NULL,
  email       TEXT        UNIQUE NOT NULL,
  role        TEXT        NOT NULL DEFAULT 'contractor'
                          CHECK (role IN ('admin', 'contractor', 'viewer')),
  is_active   BOOLEAN     NOT NULL DEFAULT true,
  metadata    JSONB       DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE workers IS 'Prime Group employees and contractors who generate and own quotes.';

CREATE TRIGGER workers_updated_at
  BEFORE UPDATE ON workers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE workers ENABLE ROW LEVEL SECURITY;

-- ── Quotes ────────────────────────────────────────────────────────────────────
-- One row per quote. Shared across all brands — isolated by site_id.
-- FKs to contacts (Mission Control layer), not customers (legacy layer).

CREATE TABLE quotes (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id         UUID        REFERENCES sites(id) ON DELETE SET NULL,
  worker_id       UUID        NOT NULL REFERENCES workers(id),
  contact_id      UUID        REFERENCES contacts(id) ON DELETE SET NULL,
  lead_id         UUID        REFERENCES leads(id) ON DELETE SET NULL,
  status          TEXT        NOT NULL DEFAULT 'draft'
                              CHECK (status IN (
                                'draft', 'pending_review', 'sent',
                                'accepted', 'rejected', 'expired'
                              )),
  total_amount    INTEGER     NOT NULL DEFAULT 0,  -- in cents
  currency        TEXT        NOT NULL DEFAULT 'NZD',
  ai_generated    BOOLEAN     NOT NULL DEFAULT false,
  ai_model        TEXT,
  ai_notes        JSONB       DEFAULT '{}',  -- enrichment results, cross-sell flags
  notes           TEXT,
  valid_until     DATE,
  idempotency_key TEXT        UNIQUE,  -- prevents duplicate AI calls
  -- AKF Construction fields
  consent_required        BOOLEAN DEFAULT false,
  consent_notes           TEXT,
  project_timeline_weeks  INTEGER,
  start_date_estimate     DATE,
  -- CleanJet fields
  service_duration_hours  NUMERIC(4,1),
  cleaners_required       SMALLINT DEFAULT 1,
  subscription_interval   TEXT
                          CHECK (subscription_interval IN (
                            'weekly', 'fortnightly', 'monthly'
                          )),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE quotes IS 'AI-generated and manual quotes. Shared across all brands, isolated by site_id.';
COMMENT ON COLUMN quotes.total_amount IS 'Total in cents. e.g. $150.00 = 15000.';
COMMENT ON COLUMN quotes.idempotency_key IS 'Prevents duplicate quotes from retried Edge Function calls.';
COMMENT ON COLUMN quotes.ai_notes IS 'JSONB blob: enrichment results, upsell suggestions, cross-sell flags, duration estimates.';

CREATE INDEX quotes_site_idx      ON quotes(site_id);
CREATE INDEX quotes_worker_idx    ON quotes(worker_id);
CREATE INDEX quotes_contact_idx   ON quotes(contact_id);
CREATE INDEX quotes_lead_idx      ON quotes(lead_id);
CREATE INDEX quotes_status_idx    ON quotes(status);
CREATE INDEX quotes_created_idx   ON quotes(created_at DESC);

CREATE TRIGGER quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- ── Quote Line Items ──────────────────────────────────────────────────────────
-- One row per line item. Cascade-deleted when parent quote is deleted.

CREATE TABLE quote_line_items (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id    UUID        NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  description TEXT        NOT NULL,
  quantity    NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit_price  INTEGER     NOT NULL DEFAULT 0,  -- in cents
  total       INTEGER     NOT NULL DEFAULT 0,  -- in cents; must equal quantity * unit_price
  sort_order  INTEGER     DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE quote_line_items IS 'Individual line items for each quote. Cascade-deleted with parent quote.';
COMMENT ON COLUMN quote_line_items.total IS 'Must equal quantity × unit_price. Validated in Zod before insert.';

CREATE INDEX quote_line_items_quote_idx ON quote_line_items(quote_id);

ALTER TABLE quote_line_items ENABLE ROW LEVEL SECURITY;

-- ── Helper View ───────────────────────────────────────────────────────────────
-- Convenience view for Mission Control dashboard: quotes with contact + worker names.

CREATE OR REPLACE VIEW quotes_summary AS
  SELECT
    q.id,
    q.site_id,
    s.name            AS site_name,
    q.contact_id,
    c.full_name       AS contact_name,
    c.email           AS contact_email,
    q.worker_id,
    w.full_name       AS worker_name,
    q.status,
    q.total_amount,
    q.currency,
    q.ai_generated,
    q.consent_required,
    q.service_duration_hours,
    q.valid_until,
    q.created_at
  FROM quotes q
  LEFT JOIN sites    s ON s.id = q.site_id
  LEFT JOIN contacts c ON c.id = q.contact_id
  LEFT JOIN workers  w ON w.id = q.worker_id;

COMMENT ON VIEW quotes_summary IS 'Flattened quote view for Mission Control dashboard.';
```

**Success gate:** `supabase db push` completes without error. Tables `workers`, `quotes`, `quote_line_items` visible in Supabase dashboard.

---

## Phase 2 — Shared Quote Helper Module

**File to create:** `f:/Prime/supabase/functions/_shared/quotes.ts`

This module is imported by all quote-generate Edge Functions to avoid duplicating Zod schemas and DB insert logic.

```typescript
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { z } from 'npm:zod@3';
import { createClient } from 'jsr:@supabase/supabase-js@2';

// ── Shared Zod Schemas ────────────────────────────────────────────────────────
// These MUST match the SQL CHECK constraint exactly.

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
  contact_id: string;
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
      contact_id: params.contact_id,
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
```

**Success gate:** File exists. No TypeScript errors when imported. All three P0 functions can import from `'../_shared/quotes.ts'`.

---

## Phase 3 — P0 Edge Functions (4 functions)

These are the highest-priority functions. Build and deploy all four before moving to Phase 4.

### 3a. `quote-generate-electrical` (Prime Electrical)

**File:** `f:/Prime/supabase/functions/quote-generate-electrical/index.ts`

**Structure:**
```typescript
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
Specialises in: fault finding, switchboard upgrades, heat pump installation (Daikin/Panasonic/Mitsubishi), EV charger installation, solar systems (SEANZ-certified), smart home automation (Control4/KNX/DALI).

Pricing in NZD cents (e.g. $150.00 = 15000). Auckland labour rate: $120–$150/hour.
Essential jobs (fault finding, power points, lighting): $150–$800
Heat pumps supply + install: $120,000–$350,000
EV charger installation: $80,000–$180,000
Solar systems: $800,000–$2,500,000
Smart home automation: $300,000–$2,000,000+

Break every distinct task into its own line item. Separate labour from materials where applicable.

Return ONLY valid JSON:
{
  "line_items": [{ "description": "string", "quantity": number, "unit_price": number, "total": number }],
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

    // Idempotency check
    if (idempotency_key) {
      const existing = await checkIdempotency(idempotency_key);
      if (existing) {
        return Response.json({ data: { ...existing, idempotent: true }, error: null });
      }
    }

    const model = Deno.env.get('OPENROUTER_MODEL') ?? 'anthropic/claude-3.5-sonnet';
    const llmOutput = await callOpenRouter(SYSTEM_PROMPT, job_description, model);

    const quoteId = await insertQuoteWithLineItems(llmOutput, {
      site_id, worker_id, contact_id, lead_id, idempotency_key, ai_model: model,
    });

    console.log(`[quote-generate-electrical] quote_id=${quoteId} total=${llmOutput.total_amount} items=${llmOutput.line_items.length}`);

    return Response.json({
      data: { quote_id: quoteId, status: 'draft', total_amount: llmOutput.total_amount, currency: 'NZD' },
      error: null,
    });
  } catch (err) {
    console.error('[quote-generate-electrical][unhandled]', err instanceof Error ? err.message : String(err));
    return Response.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
});
```

**Deploy:** `supabase functions deploy quote-generate-electrical`

**Smoke test:**
```bash
supabase functions invoke quote-generate-electrical --body '{
  "job_description": "Replace main switchboard and install 4 new power points in kitchen. Also need EV charger in garage. Residential in Ponsonby.",
  "service_type": "comfort",
  "property_type": "residential",
  "property_size": "3-4 bed",
  "site_id": "PRIME_ELECTRICAL_SITE_UUID",
  "worker_id": "WORKER_UUID",
  "contact_id": "CONTACT_UUID",
  "idempotency_key": "test-prime-001"
}'
```

---

### 3b. `quote-generate-akf` (AKF Construction)

**File:** `f:/Prime/supabase/functions/quote-generate-akf/index.ts`

**Key differences from electrical:**
- Extended LLM output schema includes `consent_required` and `consent_notes`
- These are stored in `quotes.ai_notes` JSONB and in `quotes.consent_required`/`quotes.consent_notes`
- `extra_fields` passed to `insertQuoteWithLineItems` includes consent fields

**Extended LLM Output Schema:**
```typescript
const AKFLLMOutputSchema = LLMQuoteOutputSchema.extend({
  consent_required: z.boolean(),
  consent_notes: z.string().nullable().optional(),
});
```

**Request Schema:**
```typescript
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
```

**System Prompt key parameters:**
- Business: "AKF Construction Ltd, licensed general contractor in Auckland, New Zealand"
- Labour rate: $80–$120/hour
- Pricing benchmarks: Kitchen reno ($30,000–$80,000), Bathroom ($15,000–$45,000), Deck hardwood ($900–$1,200/m²), composite ($700–$1,000/m²), pine ($500–$700/m²), New build ($3,500–$6,500/m²), Pool fencing glass ($400–$700/m linear), Horizontal slat fencing ($200–$450/m linear)
- Consent triggers: structural work, decks >1.5m above ground, new builds, retaining walls >1.5m, drainage/plumbing alterations
- Consent fees: $2,000–$15,000+ depending on project value; include as separate line item when applicable

**Output includes:** `consent_required` boolean flagged in response body + stored in `quotes.consent_required`

**Deploy:** `supabase functions deploy quote-generate-akf`

---

### 3c. `calculate-post-build-price` (CleanJet)

**File:** `f:/Prime/supabase/functions/calculate-post-build-price/index.ts`

**Purpose:** Dedicated pricing for AKF Construction cross-sell leads. Uses formula-based pricing (not LLM), fast and deterministic.

**Request Schema:**
```typescript
const RequestSchema = z.object({
  renovation_type: z.array(z.string()).min(1),
  property_bedrooms: z.number().int().min(1),
  area_m2: z.number().positive().optional(),
  construction_dust_level: z.enum(['light', 'medium', 'heavy']),
  extras_needed: z.array(z.string()).default([]),
  contact_id: z.string().uuid(),
  site_id: z.string().uuid(),
  worker_id: z.string().uuid(),
  referred_by_akf_lead_id: z.string().uuid().optional(),
  idempotency_key: z.string().optional(),
});
```

**Pricing formula (deterministic — no LLM call):**
```typescript
const BASE_RATES = { light: 18000, medium: 25000, heavy: 35000 }; // per bedroom in cents
const MINIMUM = 35000; // $350 minimum
const EXTRAS_PRICING: Record<string, number> = {
  windows: 2000,     // per window — default 8 windows
  carpet_steam: 9000, // per room
  oven: 7500,
  garage: 12000,
  pet_hair: 4500,
};

const baseTotal = Math.max(
  BASE_RATES[dust_level] * property_bedrooms,
  MINIMUM
);
// Add extras, build line_items array, calculate total
```

**Note:** This function does NOT call OpenRouter — it uses deterministic pricing. It still writes to `quotes` and `quote_line_items` with `ai_generated: false`.

**Deploy:** `supabase functions deploy calculate-post-build-price`

---

### 3d. `generate-cleaning-quote` (CleanJet)

**File:** `f:/Prime/supabase/functions/generate-cleaning-quote/index.ts`

**Purpose:** AI-powered quote for complex/non-standard cleaning jobs (end of tenancy, post-build custom, commercial).

**Request Schema:**
```typescript
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
  contact_id: z.string().uuid(),
  lead_id: z.string().uuid().optional(),
  idempotency_key: z.string().optional(),
  referred_by: z.enum(['akf_construction', 'prime_electrical', 'direct']).default('direct'),
});
```

**Extended LLM Output Schema:**
```typescript
const CleaningLLMOutputSchema = LLMQuoteOutputSchema.extend({
  recommended_service: z.enum(['regular', 'deep_clean', 'end_of_tenancy', 'post_build']),
  duration_hours: z.number().positive(),
});
```

**Extra fields stored in quotes:**
- `service_duration_hours` — from LLM output
- `cleaners_required` — calculated: if duration_hours > 4 or post_build → 2, else 1

**System Prompt key parameters:**
- Business: "CleanJet, professional residential cleaning service in Auckland, New Zealand"
- Regular ($45–$60/bedroom), Deep clean ($65–$85/bedroom), End of tenancy (base $249 for 1-2 bed; +$80/bedroom), Post-build ($150–$350/bedroom), Carpet steam ($60–$120/room), Oven ($65–$90), Windows ($15–$25/window), Garage ($80–$150), Pet hair (+$30–$60), Same-day surcharge (+25%)
- For post-build: assess dust level, paint splatters, adhesive residue
- For end of tenancy: default oven clean, recommend carpet steam for any staining

**Deploy:** `supabase functions deploy generate-cleaning-quote`

---

## Phase 4 — P1 Edge Functions (8 functions)

Deploy after all P0 functions are smoke-tested successfully.

### 4a. `quote-send-electrical` (Prime Electrical)

**File:** `f:/Prime/supabase/functions/quote-send-electrical/index.ts`

**Request Schema:** `{ quote_id: string (UUID), send_to?: string }`

**Process:**
1. Fetch quote + line items from DB
2. Fetch contact email (from contacts table via quote.contact_id)
3. Build HTML email with Prime Electrical branding (orange #F97316)
4. Send via Resend API (`RESEND_API_KEY`)
5. Update `quotes.status` → `'sent'`

**Email sections:**
- Prime Electrical header with logo
- Line items table (description | qty | unit price | total)
- Total formatted as `$X,XXX.XX NZD`
- Financing callout: GEM Visa, Q Mastercard, ANZ, Westpac — "Finance from $0 upfront"
- Valid until date
- CTA buttons: "Accept Quote" (webhook URL) + "Call us: 09-390-3620"
- Footer: Master Electricians NZ, SEANZ certified, 12-month workmanship guarantee

**Resend API call:**
```typescript
const res = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'quotes@theprimeelectrical.co.nz',
    to: contactEmail,
    subject: `Your Prime Electrical Quote — $${(total_amount / 100).toFixed(2)} NZD`,
    html: emailHtml,
  }),
});
```

**Deploy:** `supabase functions deploy quote-send-electrical`

---

### 4b. `quote-send-akf` (AKF Construction)

**File:** `f:/Prime/supabase/functions/quote-send-akf/index.ts`

Same structure as `quote-send-electrical` but:
- AKF Construction branding (dark/slate colours)
- Includes consent notice if `quotes.consent_required = true`
- From: `quotes@akfconstruction.co.nz`
- Footer: "Established 2010", "10-year structural guarantee", "Auckland Council consent handled"

---

### 4c. `quote-enrichment` (Prime Electrical)

**File:** `f:/Prime/supabase/functions/quote-enrichment/index.ts`

**Request Schema:** `{ quote_id: string (UUID), include_cross_sell?: boolean }`

**Process:**
1. Fetch quote, line items, and contact from DB
2. Build enrichment prompt with job description + line items
3. Call OpenRouter to generate: upsell suggestions, financing recommendation, cross-sell flags
4. Write results to `quotes.ai_notes` JSONB
5. If cross-sell detected (renovation/construction keywords in electrical job), write to `cross_sell_events`

**Cross-sell write pattern:**
```typescript
await supabase.from('cross_sell_events').insert({
  lead_id: quote.lead_id,        // must not be null
  source_brand: 'prime',         // site_brand ENUM value
  target_brand: 'akf',           // site_brand ENUM value
  pitch: 'Customer electrical job mentions renovation — potential AKF Construction opportunity',
  status: 'triggered',
});
```

**Deploy:** `supabase functions deploy quote-enrichment`

---

### 4d. `estimate-deck-cost` (AKF Construction)

**File:** `f:/Prime/supabase/functions/estimate-deck-cost/index.ts`

**Request Schema:**
```typescript
z.object({
  length_m: z.number().positive(),
  width_m: z.number().positive(),
  height_m: z.number().nonnegative(),
  material: z.enum(['hardwood', 'composite', 'pine']),
  features: z.array(z.enum(['stairs', 'balustrade', 'lighting', 'pergola', 'privacy_screen'])).default([]),
  location: z.string().optional(),
  contact_id: z.string().uuid(),
  site_id: z.string().uuid(),
  worker_id: z.string().uuid(),
  idempotency_key: z.string().optional(),
})
```

**Deterministic pricing (no LLM):**
```typescript
const MATERIAL_RATES = { hardwood: 105000, composite: 85000, pine: 60000 }; // per m² in cents
const area_m2 = length_m * width_m;
const baseCost = area_m2 * MATERIAL_RATES[material];
// Features: balustrade glass (+47500/linear m of perimeter), stairs (+300000–450000/flight), pergola (+1000000–2000000), lighting (+500000 flat)
// Consent: if height_m > 1.5, add $2,500–$5,000 consent line item
```

**Deploy:** `supabase functions deploy estimate-deck-cost`

---

### 4e. `consent-estimator` (AKF Construction)

**File:** `f:/Prime/supabase/functions/consent-estimator/index.ts`

**Request Schema:**
```typescript
z.object({
  project_type: z.string(),
  project_value_cents: z.number().int().nonnegative(),
  height_m: z.number().nonnegative().optional(),
  area_m2: z.number().positive().optional(),
  suburb: z.string().optional(),
})
```

**Output (not a quote — pure estimation):**
```typescript
{
  consent_required: boolean,
  consent_type: 'building_consent' | 'resource_consent' | 'both' | 'none',
  estimated_council_fee_cents: number,
  estimated_processing_weeks: number,
  notes: string,
  disclaimer: 'This is an estimate only. Actual fees determined by Auckland Council at time of application.'
}
```

**Note:** This function returns a direct JSON response — it does NOT write to `quotes`.

**Deploy:** `supabase functions deploy consent-estimator`

---

### 4f. `suggest-service-type` (CleanJet)

**File:** `f:/Prime/supabase/functions/suggest-service-type/index.ts`

**Request Schema:**
```typescript
z.object({
  customer_description: z.string().min(5),
  property_bedrooms: z.number().int().positive().optional(),
  moving_out: z.boolean().optional(),
  post_renovation: z.boolean().optional(),
})
```

**Output (pure LLM response — no DB write):**
```typescript
{
  recommended_service: 'regular' | 'deep_clean' | 'end_of_tenancy' | 'post_build',
  confidence: 'high' | 'medium' | 'low',
  reasoning: string,
  price_range: { min_cents: number, max_cents: number }
}
```

**Deploy:** `supabase functions deploy suggest-service-type`

---

### 4g. `recommend-extras` (CleanJet)

**File:** `f:/Prime/supabase/functions/recommend-extras/index.ts`

**Request Schema:**
```typescript
z.object({
  service_type: z.string(),
  bedrooms: z.number().int().positive(),
  has_pets: z.boolean().optional(),
  has_oven: z.boolean().optional(),
  window_count: z.number().int().nonnegative().optional(),
  customer_description: z.string().optional(),
})
```

**Output (rule-based + LLM — no DB write):**
```typescript
{
  recommended_extras: Array<{
    name: string,
    description: string,
    price_cents: number,
    priority: 'essential' | 'recommended' | 'optional',
    reason: string
  }>
}
```

**Deploy:** `supabase functions deploy recommend-extras`

---

### 4h. `bundle-analyzer-akf` (AKF Construction cross-sell)

**File:** `f:/Prime/supabase/functions/bundle-analyzer-akf/index.ts`

**Request Schema:**
```typescript
z.object({
  lead_id: z.string().uuid(),
  job_description: z.string(),
  service_type: z.string(),
  quote_id: z.string().uuid().optional(),
})
```

**Process:**
1. Analyse job description for cross-sell signals
2. Write cross_sell_events for CleanJet if post-build clean is appropriate
3. Write cross_sell_events for Prime Electrical if electrical work detected
4. Optionally trigger `cross-sell-to-cleanjet` via fire-and-forget fetch

**Cross-sell write pattern:**
```typescript
await supabase.from('cross_sell_events').insert({
  lead_id: params.lead_id,
  source_brand: 'akf',     // site_brand ENUM
  target_brand: 'cleanjet', // site_brand ENUM
  pitch: 'AKF renovation project nearing completion — CleanJet post-build clean opportunity',
  status: 'triggered',
});
```

**Deploy:** `supabase functions deploy bundle-analyzer-akf`

---

### 4i. `cross-sell-to-cleanjet` (CleanJet webhook receiver)

**File:** `f:/Prime/supabase/functions/cross-sell-to-cleanjet/index.ts`

**Triggered by:** AKF `bundle-analyzer-akf` via fire-and-forget fetch OR n8n webhook on `cross_sell_events` insert with `target_brand = 'cleanjet'`.

**Process:**
1. Receive: `{ cross_sell_event_id, lead_id, contact_id, renovation_type[], bedrooms, dust_level }`
2. Call `calculate-post-build-price` logic inline (or invoke that function)
3. Generate draft quote
4. Send proactive email via Resend
5. Update `cross_sell_events.status` → `'accepted'` (outreach sent)

**Deploy:** `supabase functions deploy cross-sell-to-cleanjet`

---

## Phase 5 — P2 Functions (defer until P0+P1 stable)

| Function | Brand | Purpose | File |
|----------|-------|---------|------|
| `quote-review` | Prime Electrical | AI quality review before sending | `functions/quote-review/index.ts` |
| `quote-followup` | Prime Electrical | Automated follow-up for un-responded quotes | `functions/quote-followup/index.ts` |
| `project-timeline-estimator` | AKF Construction | Week-by-week milestone timeline | `functions/project-timeline-estimator/index.ts` |
| `estimate-cleaning-time` | CleanJet | Duration + staffing estimate for scheduling | `functions/estimate-cleaning-time/index.ts` |

All P2 functions follow the same pattern as P1. Implement after P0+P1 smoke tests pass.

---

## Phase 6 — Frontend Integration

### 6a. Prime Electrical — `LeadCaptureForm.tsx`

**File:** `f:/Prime/prime-electrical/src/components/ai/LeadCaptureForm.tsx`

**Change:** After the AI processing step completes (step 3 of the overlay), add a call to `quote-generate-electrical`. Display estimated price range to customer before cross-sell cards appear.

**Integration pattern:**
```typescript
const SUPABASE_FUNCTIONS_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1`;

const quoteRes = await fetch(`${SUPABASE_FUNCTIONS_URL}/quote-generate-electrical`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
  },
  body: JSON.stringify({
    job_description: formData.message,
    service_type: detectedServiceType,   // from existing AI detection
    property_type: 'residential',
    site_id: process.env.NEXT_PUBLIC_PRIME_SITE_ID,
    worker_id: process.env.NEXT_PUBLIC_DEFAULT_WORKER_ID,
    contact_id: createdContactId,
    lead_id: createdLeadId,
    idempotency_key: `lead-${createdLeadId}`,
  }),
});
const quoteData = await quoteRes.json();
// Show quoteData.data.total_amount as ballpark estimate
```

**New env vars needed in `prime-electrical/.env.local`:**
- `NEXT_PUBLIC_PRIME_SITE_ID` — UUID from `sites` table
- `NEXT_PUBLIC_DEFAULT_WORKER_ID` — UUID of default worker

---

### 6b. AKF Construction — `LeadCaptureForm.tsx`

**File:** `f:/Prime/akf-construction/src/components/ai/LeadCaptureForm.tsx`

Same integration pattern as Prime Electrical but:
- Calls `quote-generate-akf` instead
- If `quoteData.data.consent_required === true`, show consent notice UI
- After quote generated, fire-and-forget `bundle-analyzer-akf` to check cross-sell

**Consent notice UI:**
```tsx
{consentRequired && (
  <div className="rounded-lg bg-amber-50 p-4 text-amber-800 text-sm">
    This project may require Auckland Council building consent.
    AKF Construction handles the full consent process on your behalf.
  </div>
)}
```

**New env vars needed in `akf-construction/.env.local`:**
- `NEXT_PUBLIC_AKF_SITE_ID`
- `NEXT_PUBLIC_DEFAULT_WORKER_ID`

---

### 6c. CleanJet — `BookingWizard.tsx`

**File:** `f:/Prime/cleanjet/src/components/BookingWizard.tsx`

**Change:** Add a "Post-Build Clean" and "Custom End of Tenancy" path that bypasses the fixed-pricing calculator and calls `generate-cleaning-quote` or `calculate-post-build-price`.

**New wizard flow:**
```
Step 1: Service type selection
  → Regular / Deep Clean → existing fixed-price flow (no change)
  → Post-Build Clean → new: renovation details form → call calculate-post-build-price
  → End of Tenancy → add: "Describe property condition" textarea → call generate-cleaning-quote
  → Not sure → call suggest-service-type first → display recommendation → continue

Step 2 (custom path): Property details + extras
Step 3 (custom path): AI quote displayed with line items
Step 4: Date/time selection (existing)
Step 5: Contact capture + confirm (existing)
```

**New env vars needed in `cleanjet/.env.local`:**
- `NEXT_PUBLIC_CLEANJET_SITE_ID`
- `NEXT_PUBLIC_DEFAULT_WORKER_ID`

---

## Environment Variables

### Supabase Secrets (set once — all Edge Functions inherit)
```bash
supabase secrets set OPENROUTER_API_KEY=sk-or-...
supabase secrets set OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
supabase secrets set RESEND_API_KEY=re_...
supabase secrets set CURRENCY=NZD
```

### Next.js .env.local (per brand)

**Prime Electrical** (`prime-electrical/.env.local` additions):
```env
NEXT_PUBLIC_PRIME_SITE_ID=<uuid from sites table>
NEXT_PUBLIC_DEFAULT_WORKER_ID=<uuid from workers table after first worker created>
```

**AKF Construction** (`akf-construction/.env.local` additions):
```env
NEXT_PUBLIC_AKF_SITE_ID=<uuid from sites table>
NEXT_PUBLIC_DEFAULT_WORKER_ID=<uuid from workers table>
```

**CleanJet** (`cleanjet/.env.local` additions):
```env
NEXT_PUBLIC_CLEANJET_SITE_ID=<uuid from sites table>
NEXT_PUBLIC_DEFAULT_WORKER_ID=<uuid from workers table>
```

### Getting Site UUIDs
```sql
-- Run in Supabase SQL editor after migration:
SELECT id, name FROM sites ORDER BY name;
```

---

## Deployment Checklist

### Phase 1 Checklist
- [ ] Create `supabase/migrations/20260222003_quotes_schema.sql`
- [ ] Run `supabase db push` — verify no errors
- [ ] Confirm `workers`, `quotes`, `quote_line_items` tables in Supabase dashboard
- [ ] Confirm `quotes_summary` view created

### Phase 2 Checklist
- [ ] Create `supabase/functions/_shared/quotes.ts`
- [ ] Verify TypeScript types are clean (no errors in IDE)

### Phase 3 Checklist (P0 Functions)
- [ ] Create + deploy `quote-generate-electrical`
- [ ] Smoke test: POST with valid payload returns `{ data: { quote_id }, error: null }`
- [ ] Verify quote row in DB with correct `site_id`, `ai_generated: true`
- [ ] Create + deploy `quote-generate-akf`
- [ ] Smoke test: POST with deck description returns quote with consent line item
- [ ] Create + deploy `calculate-post-build-price`
- [ ] Smoke test: POST returns deterministic price without LLM call
- [ ] Create + deploy `generate-cleaning-quote`
- [ ] Smoke test: End-of-tenancy description returns quote with duration_hours

### Phase 4 Checklist (P1 Functions)
- [ ] Create + deploy `quote-send-electrical` — send test quote, verify email received
- [ ] Create + deploy `quote-send-akf`
- [ ] Create + deploy `quote-enrichment` — verify `quotes.ai_notes` populated
- [ ] Create + deploy `estimate-deck-cost`
- [ ] Create + deploy `consent-estimator`
- [ ] Create + deploy `suggest-service-type`
- [ ] Create + deploy `recommend-extras`
- [ ] Create + deploy `bundle-analyzer-akf` — verify `cross_sell_events` row created
- [ ] Create + deploy `cross-sell-to-cleanjet` — verify proactive email sent

### Phase 6 Checklist (Frontend)
- [ ] Prime Electrical LeadCaptureForm — quote generated on form submission
- [ ] AKF Construction LeadCaptureForm — consent flag shown when applicable
- [ ] CleanJet BookingWizard — post-build path shows AI-generated price (not "Custom")
- [ ] All three sites: quote stored with correct `site_id`

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| LLM returns invalid JSON | Medium | High | Zod validation with fallback error response |
| Duplicate quotes on form retry | High | Medium | Idempotency key on every request |
| Wrong site_id used (cross-brand contamination) | Low | High | `NEXT_PUBLIC_[BRAND]_SITE_ID` env vars + DB index |
| Consent fee estimate misleads customer | Medium | Medium | Disclaimer required in all AKF quote emails |
| LLM pricing wildly inaccurate | Low | High | `quote-review` function as human gate before send |
| Resend API failure on quote send | Low | High | Return error to caller; quote stays in 'draft' status |
| OpenRouter rate limit during peak | Low | Medium | Idempotency prevents retries causing N×cost |

---

## Next Actions (ordered)

1. `supabase db push` with Phase 1 migration
2. Create `_shared/quotes.ts`
3. Build + deploy `quote-generate-electrical` (smoke test)
4. Build + deploy `quote-generate-akf` (smoke test)
5. Build + deploy `calculate-post-build-price` (smoke test)
6. Build + deploy `generate-cleaning-quote` (smoke test)
7. Proceed to Phase 4 P1 functions
8. Frontend integration (Phase 6)
9. P2 functions when P0+P1 stable

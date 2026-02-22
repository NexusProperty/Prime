# AI QUOTE Command - AI-Powered Quote Generation

A standalone AI quoting feature built on Supabase and OpenRouter. Uses Deno Edge Functions to generate structured quotes from job descriptions, contact records, or Vapi voice call transcripts. Creates its own `quotes`, `quote_line_items`, and `workers` tables — no dependency on any other system or schema.

---

## Mandatory Pre-Execution Protocol (Discovery → Review → Execute)

> **This protocol is a prerequisite wrapper.** It must complete before any task begins. No phase may be skipped or reordered.

### Phase 1: Discovery (Fast Subagents)

Deploy `codebase-scanner-fast` to scan the following before any action:

**Scan targets:**
- `supabase/` — list all migrations and their names
- `supabase/functions/` — list all deployed Edge Functions; note any existing quote-related functions
- `AIquote/` — read all files in this folder to understand current state
- Any files containing "quote", "pricing", "line_item", or "estimate" in their name

**Return a Codebase Understanding Report:**
```
## Codebase Understanding Report

Existing quote infrastructure: [none found | partial — describe]
Quote-related Edge Functions: [none | list]
Quote-related DB tables: [none | list with columns]
LLM integration pattern: [describe existing pattern if any]
Workers/users table: [exists — describe | missing — must create first]
Sites in DB: [list site IDs/names if visible in migrations]
Gaps identified: [what must be created before /ai-quote can run]
```

> **Subagent constraint:** Discovery subagents are **read-only**. They must not create, edit, or delete any files.

### Phase 2: Review (Main Agent)

Using the Codebase Understanding Report:

1. **Check for workers table** — if `workers` or `users` table is absent, the `schema` task must run first (it creates it)
2. **Check for quotes table** — if absent, `schema` task must run before `generate`
3. **Confirm delegation map** — verify all agents in the map exist in `agents/`
4. **Define the Quote data model** (Shared Data Contract — used by all phases below)
5. **Write execution plan** — what exact files will be created or modified in Phase 3

> **Gate:** Do not proceed to Phase 3 until the execution plan is written and the Codebase Understanding Report is complete.

### Phase 3: Execution (Delegated by Main Agent)

> **MANDATORY DELEGATION RULE:** The Main Agent never directly writes or edits files. It uses the `Task` tool to spawn subagents for all file operations.

**Delegation map — confirmed agents only:**

| Task | Agent |
|------|-------|
| Scaffold quote-generate Edge Function | `edge-function-developer-fast` |
| Scaffold quote-send Edge Function | `edge-function-developer-fast` |
| Create quotes schema migration in `supabase/migrations/` | `database-migration-specialist-fast` |
| Codebase scan | `codebase-scanner-fast` |
| Update `AIquote/` documentation | `documentation-manager-fast` |
| Validate created files | `validation-specialist-fast` |

---

## Agentic Skills — Applied Automatically

When `/ai-quote` is invoked, the following skills activate automatically:

| Skill | Trigger | Mandate |
|-------|---------|---------|
| `ai-quoting-architecture` | Always | Scan existing schema, define Quote data model, map data flow before any implementation |
| `ai-quote-implementation` | On `generate` task | Scaffold Edge Function with Deno.serve, Zod, OpenRouter call, idempotency, DB insert |

---

## Shared Data Contract

The `Quote` data model is defined **once here** and must be respected by all workflow tasks, Edge Functions, Zod schemas, and SQL tables without divergence.

```typescript
interface Quote {
  id: string               // UUID, primary key
  site_id: string          // FK → sites.id
  worker_id: string        // FK → workers.id (created by schema task)
  contact_id: string       // FK → contacts.id
  status: 'draft' | 'pending_review' | 'sent' | 'accepted' | 'rejected' | 'expired'
  line_items: QuoteLineItem[]
  total_amount: number     // in cents (e.g. 15000 = $150.00 NZD)
  currency: string         // default 'NZD'
  ai_generated: boolean    // true if this quote was produced by LLM
  ai_model: string | null  // e.g. 'openrouter/anthropic/claude-3.5-sonnet'
  notes: string | null
  valid_until: string | null  // ISO 8601 date string
  created_at: string          // ISO 8601 timestamp
  updated_at: string          // ISO 8601 timestamp
}

interface QuoteLineItem {
  description: string
  quantity: number
  unit_price: number  // in cents
  total: number       // in cents — always quantity × unit_price
}
```

**Zod schema (must match the TypeScript interface exactly):**
```typescript
import { z } from 'https://deno.land/x/zod/mod.ts'

const QuoteLineItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().positive(),
  unit_price: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
})

const QuoteStatusSchema = z.enum([
  'draft', 'pending_review', 'sent', 'accepted', 'rejected', 'expired'
])

const QuoteSchema = z.object({
  site_id: z.string().uuid(),
  worker_id: z.string().uuid(),
  contact_id: z.string().uuid(),
  status: QuoteStatusSchema.default('draft'),
  line_items: z.array(QuoteLineItemSchema).min(1),
  total_amount: z.number().int().nonnegative(),
  currency: z.string().default('NZD'),
  ai_generated: z.boolean(),
  ai_model: z.string().nullable().default(null),
  notes: z.string().nullable().default(null),
  valid_until: z.string().nullable().default(null),
})
```

> **Non-negotiable:** The SQL CHECK constraint for `status` must use the identical string values: `'draft'`, `'pending_review'`, `'sent'`, `'accepted'`, `'rejected'`, `'expired'`. The TypeScript union, Zod enum, and SQL CHECK constraint must be identical.

---

## Workflow — Task Types

### `generate` — AI Generates a Quote

```
/ai-quote generate "Replace switchboard, add 3 power points in kitchen, fix outdoor light — residential job in Ponsonby"
/ai-quote generate contact_id:8f3c2d91-... "Needs full rewire for 3-bedroom home"
```

Generates a structured quote from a plain-text job description or contact record using OpenRouter LLM.

**What happens:**
1. Phase 1: Scan to confirm `quotes` table and `workers` table exist. If not, run `/ai-quote schema` first.
2. Phase 2: Build the LLM system prompt — instruct the model to return valid JSON matching the `QuoteLineItem[]` schema. Include the business's service catalog in the system prompt if available.
3. Phase 3: Delegate to `edge-function-developer-fast` to scaffold `supabase/functions/quote-generate/index.ts`:

**Edge Function must:**
- Accept: `{ job_description: string, site_id: string, worker_id: string, contact_id: string, idempotency_key?: string }`
- Check idempotency: if `idempotency_key` was seen in last 60 seconds, return existing quote ID
- Call OpenRouter (`OPENROUTER_API_KEY`) with structured output prompt
- Parse and validate response with Zod (`QuoteSchema`)
- Insert into `quotes` and `quote_line_items` tables
- Return: `{ data: { quote_id, status: 'draft', total_amount, currency }, error: null }`

**OpenRouter system prompt template:**
```
You are a quoting assistant for a [BUSINESS_TYPE] business in [BUSINESS_LOCATION].
Given a job description, produce a detailed quote as JSON.
Prices are in [CURRENCY] cents (e.g. $150.00 = 15000). Be specific — break every task into a separate line item.

Return ONLY valid JSON in this exact format:
{
  "line_items": [
    { "description": "string", "quantity": number, "unit_price": number, "total": number }
  ],
  "total_amount": number,
  "notes": "string or null",
  "valid_until": "YYYY-MM-DD or null"
}
```

---

### `schema` — Create Quote Schema

```
/ai-quote schema
```

Creates a standalone Supabase migration file with all tables required for the quoting feature. No dependency on any existing schema — runs on any Supabase project.

**Tables to add:**

```sql
-- Workers (contractors/employees who create quotes)
CREATE TABLE workers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id     UUID,                              -- optional: FK to your sites table if one exists
  full_name   TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  role        TEXT DEFAULT 'contractor',  -- 'admin' | 'contractor' | 'viewer'
  is_active   BOOLEAN DEFAULT true,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;

-- Quotes
CREATE TABLE quotes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id         UUID,                              -- optional: FK to your sites table if one exists
  worker_id       UUID REFERENCES workers(id) NOT NULL,
  contact_id      UUID,                              -- optional: FK to your contacts table if one exists
  status          TEXT NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft','pending_review','sent','accepted','rejected','expired')),
  total_amount    INTEGER NOT NULL DEFAULT 0,  -- in cents
  currency        TEXT NOT NULL DEFAULT 'NZD',
  ai_generated    BOOLEAN NOT NULL DEFAULT false,
  ai_model        TEXT,
  notes           TEXT,
  valid_until     DATE,
  idempotency_key TEXT UNIQUE,  -- prevents duplicate AI calls
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

CREATE INDEX quotes_site_idx ON quotes(site_id);
CREATE INDEX quotes_worker_idx ON quotes(worker_id);
CREATE INDEX quotes_status_idx ON quotes(status);
CREATE INDEX quotes_contact_idx ON quotes(contact_id);

-- Quote Line Items
CREATE TABLE quote_line_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id    UUID REFERENCES quotes(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  quantity    NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit_price  INTEGER NOT NULL DEFAULT 0,  -- in cents
  total       INTEGER NOT NULL DEFAULT 0,  -- in cents
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE quote_line_items ENABLE ROW LEVEL SECURITY;

CREATE INDEX quote_line_items_quote_idx ON quote_line_items(quote_id);

-- Helper: get all quotes for a site with contact name
CREATE OR REPLACE FUNCTION get_quotes_by_site(p_site_id UUID)
RETURNS TABLE (
  quote_id UUID, contact_name TEXT, worker_name TEXT,
  status TEXT, total_amount INTEGER, currency TEXT,
  ai_generated BOOLEAN, created_at TIMESTAMPTZ
)
LANGUAGE sql STABLE AS $$
  SELECT q.id, c.full_name, w.full_name, q.status,
         q.total_amount, q.currency, q.ai_generated, q.created_at
  FROM quotes q
  JOIN contacts c ON c.id = q.contact_id
  JOIN workers w ON w.id = q.worker_id
  WHERE q.site_id = p_site_id
  ORDER BY q.created_at DESC;
$$;
```

Delegates to `database-migration-specialist-fast`. After execution: run `supabase db push`.

---

### `review [quote_id]` — AI Reviews an Existing Quote

```
/ai-quote review 8f3c2d91-4b2a-...
```

Fetches the quote from the database and sends it to OpenRouter for a quality review. Returns suggested improvements without auto-applying.

**Review criteria:**
- Are line items specific enough? (Flag vague descriptions like "electrical work")
- Is the total_amount consistent with line_item quantities × unit_prices?
- Are any obvious line items missing for this type of job?
- Is the valid_until date reasonable (typically 30 days from creation)?
- Does pricing seem within normal Auckland electrical contracting range?

**Output:** Inline suggestions — no file writes, no DB changes without explicit user confirmation.

---

### `send [quote_id]` — Send Quote to Contact

```
/ai-quote send 8f3c2d91-4b2a-...
```

1. Fetches the quote and contact's email from the database
2. Updates quote `status` → `'sent'`
3. Triggers email delivery via Resend (`RESEND_API_KEY`)
4. Delegates to `edge-function-developer-fast` to scaffold `supabase/functions/quote-send/index.ts` if it doesn't exist

**Email format:** Plain HTML quote summary with line items table, total, and a call-to-action to contact the business to accept.

---

## Environment Variables Required

| Variable | Purpose | Required |
|----------|---------|---------|
| `OPENROUTER_API_KEY` | LLM calls for quote generation and review | Yes |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Full DB access from Edge Functions | Yes |
| `RESEND_API_KEY` | Email delivery for quote-send | Yes (send task) |
| `BUSINESS_TYPE` | Describes the business for the AI system prompt (e.g. `"electrical contracting"`) | Yes |
| `BUSINESS_LOCATION` | Location for the AI system prompt (e.g. `"Auckland, New Zealand"`) | Yes |
| `CURRENCY` | Currency code for pricing (default: `"NZD"`) | Optional |
| `OPENROUTER_MODEL` | Model to use (default: `anthropic/claude-3.5-sonnet`) | Optional |

Set all via: `supabase secrets set KEY=value`

---

## Usage

```
/ai-quote schema
/ai-quote generate "Replace switchboard and add 3 power points — residential, Ponsonby, Auckland"
/ai-quote generate contact_id:8f3c2d91-... "Full rewire for 3-bedroom villa"
/ai-quote review 8f3c2d91-4b2a-41c3-b5e9-1234abcd5678
/ai-quote send 8f3c2d91-4b2a-41c3-b5e9-1234abcd5678
```

## Next Steps

After any `/ai-quote` task:
- Run `supabase db push` after `schema` task to apply migrations
- Run `supabase functions deploy quote-generate` after `generate` scaffolding
- Run `supabase functions deploy quote-send` after `send` scaffolding
- Test the Edge Function: `supabase functions invoke quote-generate --body '{"job_description":"..."}'`
- Set `BUSINESS_TYPE` and `BUSINESS_LOCATION` in your Edge Function env or Supabase Vault
- Update `AIquote/ai-quote-command.md` if you add new task modes or schema changes

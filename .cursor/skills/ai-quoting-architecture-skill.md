---
name: ai-quoting-architecture
description: Design how an AI quoting feature integrates into an existing Supabase + Mission Control stack. Defines the Quote data model as the shared artifact and maps the complete data flow before any implementation begins.
when_to_use: When adding AI quote generation to a project that uses Supabase, Deno Edge Functions, and OpenRouter. Activates at the start of any /ai-quote task to ensure schema dependencies exist and the data model is consistent across all layers.
evidence: User mentions ai-quote, quote generation, quoting feature, AI quotes, pricing AI, estimate generation, or running /ai-quote.
---

# AI Quoting Architecture Skill

## Overview

This skill establishes the architectural foundation for an AI-powered quoting system before any code or schema is written. The core principle: the `Quote` data model is the shared artifact — it must be defined once and respected identically by the SQL schema, TypeScript interfaces, Zod validation, and OpenRouter output schema. Any divergence between these representations creates silent bugs.

**Data flow this skill validates:**
```
Input source (text/form/Vapi) → quote-generate Edge Function → OpenRouter LLM call
→ Zod validation → quotes + quote_line_items DB insert → return quote_id
```

## Prerequisites

- `supabase/` directory accessible (to check existing migrations and Edge Functions)
- `AIquote/` folder accessible (contains command and skill reference docs)
- `codebase-scanner-fast` agent available in `agents/`

## Steps

### Step 1 — Scan Existing Quote Infrastructure

Deploy `codebase-scanner-fast` (read-only) to check:
- Does a `quotes` table exist in any existing migration file under `supabase/migrations/`?
- Does a `workers` table exist? (Required FK for quotes)
- Does `supabase/functions/quote-generate/` exist?
- Are there any existing quote-related files in `supabase/functions/` or project root?

**Return:** Codebase Understanding Report with explicit YES/NO for each above.

**Success Criteria:** Report produced. If `quotes` or `workers` tables are absent, flag that `/ai-quote schema` must run first.

---

### Step 2 — Define the Quote Data Model (Shared Artifact)

Confirm the Quote data model is consistent across all four representations:

| Representation | Location | Status |
|---------------|---------|--------|
| TypeScript interface | `AIquote/ai-quote-command.md` Shared Data Contract | Reference |
| Zod schema | `supabase/functions/quote-generate/index.ts` | Must match interface |
| SQL table | `supabase/migrations/[timestamp]_create_quotes.sql` | Must match interface |
| OpenRouter output schema | System prompt in Edge Function | Must match QuoteLineItem[] |

**Key consistency rules:**
- `status` values must be identical in TypeScript union, Zod enum, AND SQL CHECK constraint
- `total_amount` and `unit_price` are always integers (cents) — never floats
- `QuoteLineItem.total` must always equal `quantity × unit_price` — validate this in Zod with `.refine()`
- All UUIDs are strings in TypeScript, UUID type in SQL

**Success Criteria:** All four representations defined or confirmed consistent. No silent divergence.

---

### Step 3 — Map Data Flow

Trace the complete request → response path for the `generate` task:

```
1. Client sends POST to /functions/v1/quote-generate
   Body: { job_description, site_id, worker_id, contact_id, idempotency_key? }

2. Edge Function validates JWT (Authorization header)

3. Idempotency check:
   SELECT id FROM quotes WHERE idempotency_key = $1 AND created_at > NOW() - INTERVAL '60 seconds'
   → If found: return existing quote_id immediately

4. Build OpenRouter system prompt with:
   - Business context (category, location, currency)
   - QuoteLineItem JSON schema requirement
   - Instruction to return ONLY valid JSON

5. Call OpenRouter API:
   POST https://openrouter.ai/api/v1/chat/completions
   Headers: { Authorization: Bearer OPENROUTER_API_KEY }
   Body: { model, messages: [system, user: job_description], response_format: { type: 'json_object' } }

6. Parse and validate LLM response with Zod (QuoteSchema)
   → If validation fails: return { data: null, error: 'AI returned invalid quote structure' }

7. Insert into quotes table (with idempotency_key)
8. Insert into quote_line_items table (bulk insert)
9. Return { data: { quote_id, status: 'draft', total_amount, currency }, error: null }
```

**Success Criteria:** Full data flow documented. Every step has a defined error path.

---

### Step 4 — Confirm Delegation Map

Verify all agents referenced in `/ai-quote` Phase 3 exist in `agents/`:

| Task | Agent | Confirmed |
|------|-------|----------|
| Scaffold quote-generate Edge Function | `edge-function-developer-fast` | Must confirm |
| Scaffold quote-send Edge Function | `edge-function-developer-fast` | Must confirm |
| Extend schema.sql + create migration | `database-migration-specialist-fast` | Must confirm |
| Codebase scan | `codebase-scanner-fast` | Must confirm |
| Update registry docs | `documentation-manager-fast` | Must confirm |

If any agent is missing, halt and report before proceeding.

**Success Criteria:** All agents confirmed present. No phantom agents referenced.

---

### Step 5 — Validate Architecture Against Existing Infrastructure

Final check before greenlighting implementation:

- [ ] `sites` table exists in schema (required FK)
- [ ] `contacts` table exists in schema (required FK)
- [ ] `workers` table exists OR schema task is queued to create it
- [ ] No existing Edge Function named `quote-generate` (avoid overwrite without review)
- [ ] `OPENROUTER_API_KEY` is referenced but never hardcoded — always `Deno.env.get('OPENROUTER_API_KEY')`
- [ ] `idempotency_key` field in `quotes` table has `UNIQUE` constraint
- [ ] RLS enabled on all new tables

**Success Criteria:** All checks pass. Architecture is ready for implementation.

## Verification

After applying this skill, verify:
- [ ] Codebase Understanding Report produced
- [ ] Quote data model defined consistently across all 4 representations
- [ ] Full data flow documented with error paths
- [ ] All delegation agents confirmed present
- [ ] No schema dependency missing
- [ ] No phantom agents, no hardcoded secrets

## Related

- Command: `AIquote/ai-quote-command.md` — the `/ai-quote` command
- Skill: `AIquote/ai-quote-implementation-skill.md` — implements after this skill validates architecture
- Agent: `agents/edge-function-developer-fast.md` — executes the Edge Function scaffolding
- Agent: `agents/database-migration-specialist-fast.md` — creates the standalone migration file

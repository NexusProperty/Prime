# TASK ARCHIVE: QUOTES-001 — AI Quote Generation System

## METADATA

| Field | Value |
|-------|-------|
| Task ID | QUOTES-001 |
| Date | 2026-02-22 |
| Sessions | 1 (plan + creative + QA + build phases 1–7 + reflect) |
| Complexity | Level 3 — Multi-phase system build |
| Status | ✅ COMPLETE & ARCHIVED |
| Supabase project | `tfdxlhkaziskkwwohtwd.supabase.co` |
| Brands | Prime Electrical · AKF Construction · CleanJet |

---

## SUMMARY

QUOTES-001 delivered a complete AI-powered quoting system for all three Prime Group brands in a single day. 17 Supabase Edge Functions handle the full quote lifecycle: lead → AI generation → inline frontend preview → email send → enrichment → cross-sell bridge → follow-up. All data lives in the shared Supabase project with `site_id` row-level isolation. Frontend integration adds an amber `quote_preview` state to the Prime Electrical and AKF lead forms and a Custom Quote tab to the CleanJet BookingWizard.

---

## DATABASE SCHEMA

Migration applied: `supabase/migrations/20260222003_quotes_schema.sql`

| Object | Description |
|--------|-------------|
| `quotes` | One row per quote; `site_id` isolation; AKF consent fields; CleanJet scheduling fields |
| `quote_line_items` | Individual line items; cascade-delete with parent quote |
| `quotes_summary` VIEW | Flattened view for Mission Control dashboard |

Note: `workers` table was pre-existing (created by MC-001 mission_control_schema migration).

---

## SHARED MODULES

| Module | Exports |
|--------|---------|
| `supabase/functions/_shared/quotes.ts` | `callOpenRouter`, `insertQuoteWithLineItems`, `checkIdempotency`, `LLMQuoteOutputSchema`, `QuoteLineItemSchema` |
| `supabase/functions/_shared/email.ts` | `buildQuoteEmail` — shared HTML email builder; single `brandColour` drives all styling |

---

## DEPLOYED EDGE FUNCTIONS (all ACTIVE on tfdxlhkaziskkwwohtwd)

### P0 — Quote Generation
| Function | Type | Purpose |
|----------|------|---------|
| `quote-generate-electrical` | LLM | AI quote for Prime Electrical jobs |
| `quote-generate-akf` | LLM | AI quote for AKF Construction; consent detection |
| `calculate-post-build-price` | Deterministic | Post-build cleaning price (no LLM) |
| `generate-cleaning-quote` | LLM | AI quote for complex CleanJet jobs |

### P1 — Send, Enrich, Cross-sell
| Function | Type | Purpose |
|----------|------|---------|
| `quote-send-electrical` | Email | Sends Prime Electrical quote via Resend; financing callout |
| `quote-send-akf` | Email | Sends AKF quote via Resend; consent notice when applicable |
| `quote-enrichment` | LLM | Upsell + cross-sell signal detection; writes to `quotes.ai_notes` |
| `estimate-deck-cost` | Deterministic | Deck pricing: area × material rate + features + consent |
| `consent-estimator` | Rule-based | Auckland Council consent requirement estimator (no DB write) |
| `bundle-analyzer-akf` | Rule-based | AKF cross-sell detector; fires `cross-sell-to-cleanjet` |
| `suggest-service-type` | LLM | CleanJet service type recommender (no DB write) |
| `recommend-extras` | Rule-based | CleanJet extras recommender (no DB write) |
| `cross-sell-to-cleanjet` | Email+DB | AKF cross-sell webhook; creates post-build quote + proactive email |

### P2 — Quality, Scheduling, Follow-up
| Function | Type | Purpose |
|----------|------|---------|
| `quote-review` | LLM | Quality gate; sets `pending_review` or `draft`; optional auto-send |
| `quote-followup` | Email | Follow-up for `sent` quotes after 24h+; records count in `ai_notes` |
| `project-timeline-estimator` | LLM | Week-by-week AKF project milestones; consent + council wait weeks |
| `estimate-cleaning-time` | Deterministic | CleanJet duration + staffing calc; no DB write |

---

## FRONTEND CHANGES

| File | Change |
|------|--------|
| `packages/ui-ai/src/types.ts` | Added `'quote_preview'` to `FormState` union |
| `prime-electrical/src/app/api/leads/submit/route.ts` | Returns `contactId` via Supabase REST lookup |
| `akf-construction/src/app/api/leads/submit/route.ts` | Returns `contactId` via Supabase REST lookup |
| `prime-electrical/src/components/ai/LeadCaptureForm.tsx` | `quote_preview` state — amber estimate card |
| `akf-construction/src/components/ai/LeadCaptureForm.tsx` | `quote_preview` state + consent notice |
| `cleanjet/src/components/BookingWizard.tsx` | Standard / Custom Quote tab; cyan quote result with accordion |
| `prime-electrical/.env.local` | Added `NEXT_PUBLIC_PRIME_SITE_ID`, `NEXT_PUBLIC_DEFAULT_WORKER_ID` |
| `akf-construction/.env.local` | Created with Supabase creds + `NEXT_PUBLIC_AKF_SITE_ID` |
| `cleanjet/.env.local` | Created with Supabase creds + `NEXT_PUBLIC_CLEANJET_SITE_ID` |

---

## LIVE SMOKE TEST RESULTS

| Test | Result |
|------|--------|
| `quote-generate-electrical` (switchboard + EV charger, Ponsonby) | $6,740 NZD · 6 line items ✅ |
| `generate-cleaning-quote` (3-bed EOT, carpets + oven) | $859 NZD · 4 line items · 7.5h ✅ |
| `estimate-cleaning-time` (3-bed EOT heavy + extras) | 9h / 4.5h wall-clock / 2 cleaners ✅ |
| `project-timeline-estimator` (15m² ground-level deck) | 2 weeks / no consent / 2 milestones ✅ |

---

## KEY LESSONS LEARNED

1. **Supabase MCP > CLI for remote DB.** `apply_migration`, `execute_sql`, `list_tables` bypass Docker requirements and CLI version mismatches entirely.
2. **Make `contact_id` optional in client-facing Edge Functions.** The contact may not exist at form-submission time. Use `z.string().uuid().optional()`.
3. **Return `line_items` in generate-function responses.** Avoids client-side REST lookups that hit RLS barriers with the anon key.
4. **Zod validation on LLM output prevents bad data reaching the DB.** `total === quantity × unit_price` `.refine()` check is critical for pricing integrity.
5. **Check `list_tables` before any migration in a shared project.** The `workers` table pre-existed; catching this avoided a constraint conflict.
6. **Idempotency requires both a time-window check AND a DB UNIQUE constraint.** The window returns cached results; the constraint is the hard guard.
7. **4-agent parallel delegation is safe for separate function directories.**

---

## PENDING (deferred — no code changes needed now)

| Item | Notes |
|------|-------|
| `quote-accept` Edge Function | Accept URL in all email templates points to this — not yet implemented |
| RLS policies on `quotes` / `quote_line_items` | Tables have RLS enabled but no SELECT policies for anon/authenticated users |
| Real `AKF_WEBHOOK_SECRET` | Placeholder used in `akf-construction/.env.local` — replace with actual secret |
| n8n trigger for `quote-enrichment` | Fire-and-forget enrichment after lead → quote; currently manual |
| AKF / CleanJet KB embedding | Run embed script for AKF + CleanJet KB when FAQ content is ready |

---

## REFLECTION

Full reflection: `memory-bank/reflection/QUOTES-001/reflection-QUOTES-001.md`

---

*Build duration: single session | Functions: 17 deployed | Smoke tests: 4 passed | Bugs found & fixed: 7*

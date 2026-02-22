# Tasks

## Active Tasks

| Task | Description | Status |
|------|-------------|--------|
| QUOTES-001 | AI Quote Generation System — Prime Group (3 Brands) | IN_PROGRESS (all functions deployed — reflect pending) |

## Recently Completed

| Task | Description | Date |
|------|-------------|------|
| MC-001 | Mission Control — 13-route Next.js app, 3 Edge Functions deployed, 2 DB migrations, pg_cron queue processor | 2026-02-22 |
| VAPI-001 | Vapi voice agent — 3 assistants, Supabase Edge Function, pgvector RAG, Telnyx NZ — Live in Production | 2026-02-22 |

## Archived Completions

| Task | Description | Date |
|------|-------------|------|
| MC-001 | Mission Control — Next.js 16 app (13 routes, 85 TS files), 3 Edge Functions (ACTIVE), 4 DB tables, RLS, pg_cron queue | 2026-02-22 |
| VAPI-001 | Vapi voice agent — 3 assistants (Max/Alex/Jess), pgvector RAG, Supabase Edge Function v8, Telnyx +6498734191, 13 KB chunks. Live. | 2026-02-22 |
| INFRA-003 | Root tsconfig.json + E2E type imports from @prime/ui-ai — 3 files, 0 lint errors | 2026-02-22 |
| PHASE6-001 | n8n blueprint + code fixes — awaiting user workflow activation | 2026-02-21 |
| DEPLOY-002 | Redeployed all 3 sites with @prime/ui-ai workspace — HTTP 200 confirmed | 2026-02-21 |
| INFRA-002 | @prime/ui-ai shared package — 30 duplicate files eliminated, 0 TS errors | 2026-02-21 |
| TEST-002 | Expanded E2E coverage: 27 new tests — cross-sell edge cases, jobs/sync, voice flow | 2026-02-21 |
| SPRINT3 | Sprint 3 archived (INFRA-002 + DEPLOY-002 + PHASE6-001 + TEST-002) | 2026-02-21 |
| SPRINT2-POST-DEPLOY | pg_net trigger, n8n migration, 39/39 Playwright E2E tests (ARCHIVED) | 2026-02-21 |
| REFLECT-002 | Sprint 2 post-deploy reflection (ARCHIVED) | 2026-02-21 |
| DEPLOY-001 | Vercel deployment prep — vercel.json, unique package names, .env.local.example (ARCHIVED) | 2026-02-21 |
| RESTORE-DESIGN-001 | Restored live-site brutalist/technical designs (ARCHIVED) | 2026-02-21 |
| INIT-001 | Project initialisation & repo setup | 2026-02-21 |
| SETUP-001 | Next.js scaffolding for all 3 sites | 2026-02-19 |
| PHASE1-001 | Prime Electrical bug fixes & copy polish | 2026-02-21 |
| PHASE2-001 | Supabase staging DB schema & client setup | 2026-02-21 |
| PHASE3-001 | Connect forms to Make.com + GPT-4o enrichment | 2026-02-21 |
| PHASE3-002 | AI cross-sell engine (rule-based + GPT-4o) | 2026-02-21 |
| PHASE3-003 | Vapi.ai voice receptionist + Twilio SMS | 2026-02-21 |
| PHASE4-001 | Simpro/Fergus job sync adapter + Supabase webhook | 2026-02-21 |
| PHASE2-002 | AKF Construction Salient redesign + AI features | 2026-02-21 |
| PHASE2-003 | CleanJet Salient build + booking wizard + AI features | 2026-02-21 |
| PHASE2-004 | Prime Electrical Salient redesign | 2026-02-21 |
| PHASE2-005 | GPT-4o master email parser prompt | 2026-02-21 |
| INFRA-001 | npm workspace evaluation (→ INFRA-002 recommended) | 2026-02-21 |
| AI-UX-001 | AI component library + per-site features (ARCHIVED) | 2026-02-21 |
| QA-SPRINT-001 | Production build validation + Supabase live wiring (ARCHIVED) | 2026-02-21 |

## Next Sprint Candidates

| Priority | Task | Description |
|----------|------|-------------|
| 1 | N8N-ACTIVATE | Activate n8n workflow (user action — see IMPORT-INSTRUCTIONS.md) |

---

## QUOTES-001 — AI Quote Generation System

| Field | Value |
|-------|-------|
| **Task ID** | QUOTES-001 |
| **Title** | AI Quote Generation System — Prime Group (3 Brands) |
| **Status** | IN_PROGRESS (all functions deployed — reflect pending) |
| **Complexity** | Level 3 |
| **Priority** | HIGH |
| **Date Created** | 2026-02-22 |

**Description:**  
Build a shared AI quoting system for all three Prime Group brands (Prime Electrical, AKF Construction, CleanJet) on the shared Supabase project `tfdxlhkaziskkwwohtwd`. The system uses Supabase Edge Functions (Deno), OpenRouter LLM, Zod validation, and Resend email delivery to generate, store, and send AI-powered quotes from customer job descriptions.

**Reference Plans:** All plans live in `f:/Prime/AIquotes/`
- `README.md` — overview and implementation sequence
- `prime-electrical-plan.md` — 5 functions, Prime Electrical brand
- `akf-construction-plan.md` — 6 functions, AKF Construction brand  
- `cleanjet-plan.md` — 6 functions, CleanJet brand

**Scope:**
- 17 Supabase Edge Functions (Deno) across 3 brands
- 3 new database tables: `workers`, `quotes`, `quote_line_items`
- 7 ALTER TABLE additions (construction + cleaning specific columns)
- Cross-sell bridge: AKF → CleanJet, Prime → AKF/CleanJet
- Email delivery via Resend (3 brand-specific templates)
- Integration with: LeadCaptureForm, BookingWizard, n8n webhooks, cross_sell_events table

**Implementation Phases:**
- Phase 1 (Schema): Create shared DB tables — Supabase migration
- Phase 2 (P0 Functions): quote-generate-electrical, quote-generate-akf, calculate-post-build-price, generate-cleaning-quote
- Phase 3 (P1 Functions): quote-send-*, quote-enrichment, estimate-deck-cost, consent-estimator, suggest-service-type, recommend-extras, cross-sell-to-cleanjet, bundle-analyzer-akf
- Phase 4 (Frontend): LeadCaptureForm integration, BookingWizard custom quote path
- Phase 5 (P2 Functions): quote-review, quote-followup, project-timeline-estimator, estimate-cleaning-time

**Success Criteria:**
- [x] All quotes stored with site_id isolation per brand — schema enforced
- [x] Idempotency prevents duplicate quotes from retried requests — `checkIdempotency()` in all generate functions
- [x] All AI quotes flagged with ai_generated=true and ai_model — set in `insertQuoteWithLineItems`
- [x] Customer submits lead → AI ballpark quote generated < 3 seconds (Phase 6 frontend integration ✅)
- [x] AKF cross-sell → CleanJet post-build quote auto-emailed to customer (functions ready; requires deploy)
- [x] CleanJet BookingWizard shows real price for post-build (not "Custom") (Phase 6 frontend integration ✅)

**Dependencies:**
- `cross_sell_events` table: EXISTS in prod
- `leads` table: EXISTS in prod
- `contacts` table: EXISTS in prod (referenced as contacts)
- `workers` table: MISSING — must create in Phase 1
- `quotes` table: MISSING — must create in Phase 1
- `quote_line_items` table: MISSING — must create in Phase 1

**Next Action:** Run `/reflect` to close out QUOTES-001 — all 17 functions deployed

**Plan Document:** `memory-bank/plan/QUOTES-001/plan-QUOTES-001.md`
**Planning Completed:** 2026-02-22
**Build Started:** 2026-02-22 (Phases 1–4 complete; Phase 6 complete 2026-02-22; Phase 7 P2 functions complete 2026-02-22)
**Creative Phase Completed:** 2026-02-22
**Creative Document:** `memory-bank/creative/QUOTES-001/creative-QUOTES-001.md`
**Design Decisions:**
- LLM Prompts: Option B — Benchmarked prompts with pricing tables (3 brand-specific + 1 enrichment)
- Email Templates: Option B — Branded Card Layout with shared `buildQuoteEmail()` helper in `_shared/email.ts`
- LeadCaptureForm: Option B — New `quote_preview` state (amber) between ai_processing and cross_sell
- BookingWizard: Option B — Enhanced Step 1 with Custom Quote tab (zero impact on standard flow)

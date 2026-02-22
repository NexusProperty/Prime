# Tasks

## Active Tasks

### VAPI-001 — Voice Agent Backend Infrastructure
**Complexity:** Level 4 (multi-phase system build)  
**Status:** ✅ Code Complete — Pending User Deployment Actions  
**Plan:** `memory-bank/plan/vapi-voice-agent-plan.md`  
**Build Report:** `memory-bank/build/VAPI-001/build-VAPI-001.md`

#### Stack (Locked)
- LLM: `openai/gpt-4o-mini` via OpenRouter
- TTS: Vapi native — PlayHT (Max, Alex) + ElevenLabs (Jess)
- STT: Deepgram Nova-2
- Backend: Supabase Deno Edge Functions
- Phone: Telnyx only (Twilio removed)

#### Phases

**Phase A — Security & Environment** ✅
- [x] Hardcoded `VAPI_API_KEY` replaced with env var in `vapi-test.py`
- [x] `vapi-test.py` added to `.gitignore`
- [x] All 3 `.env.local.example` files updated (Twilio removed, OpenRouter/Deepgram/OpenAI added)

**Phase B — Database Migration** ✅
- [x] `supabase/migrations/20260222001_vapi_voice_agent.sql` written
- [ ] **USER ACTION:** `supabase db push` — run against project `tfdxlhkaziskkwwohtwd`

**Phase C — Deno Edge Function Scaffold** ✅
- [x] `supabase/functions/_shared/env.ts`
- [x] `supabase/functions/_shared/security.ts` (timingSafeEqual HMAC)
- [x] `supabase/functions/_shared/types.ts` (Zod schemas)
- [x] `supabase/functions/_shared/rag.ts` (pgvector retrieval)
- [x] `supabase/functions/vapi-webhook/index.ts` (main handler)

**Phase D — Assistant Configuration** ✅
- [x] `vapi/assistant-prime.json` (Max — 6 tools, PlayHT)
- [x] `vapi/assistant-akf.json` (Alex — 5 tools, PlayHT)
- [x] `vapi/assistant-cleanjet.json` (Jess — 6 tools, ElevenLabs)
- [ ] **USER ACTION:** `vapi update assistant <id> --file vapi/assistant-<brand>.json` (x3)

**Phase E — Knowledge Base Seed** ✅
- [x] `supabase/seed/knowledge_base/prime-faq.md`
- [x] `supabase/seed/knowledge_base/akf-faq.md`
- [x] `supabase/seed/knowledge_base/cleanjet-faq.md`
- [x] `supabase/seed/embed-knowledge-base.ts`
- [ ] **USER ACTION:** Run embedding script after migration is live

**Phase F — Deploy & Test** (user actions remaining)
- [ ] **USER ACTION:** Rotate `VAPI_API_KEY` (exposed in git history)
- [ ] **USER ACTION:** `supabase secrets set ...` (all env vars)
- [ ] **USER ACTION:** `supabase functions deploy vapi-webhook --no-verify-jwt`
- [ ] **USER ACTION:** Set webhook signing secret in Vapi dashboard
- [ ] **USER ACTION:** Integration test: `capture_lead` → 200ms, writes to leads table
- [ ] **USER ACTION:** Integration test: invalid HMAC → 401
- [ ] **USER ACTION:** Voice smoke test: `vapi call create --type web` (all 3 assistants)

#### Success Criteria
- [x] All tool names in `vapi/assistant-*.json` match switch cases in `vapi-webhook/index.ts`
- [x] HMAC verification uses `timingSafeEqual` — confirmed in `security.ts`
- [x] HMAC is first operation in webhook handler — before JSON parse
- [x] Idempotency check on every `function-call` event
- [x] `end-of-call-report` handler writes to `vapi_call_log`
- [x] `capture_lead` writes to `leads` table with correct `source_site`
- [x] Return callers get personalised greeting (memory pre-fetch via `assistant-request`)
- [x] RAG responses are speech-safe plain text (no markdown, no JSON)
- [ ] Webhook responds to any Vapi event within 500ms (verify after deploy)
- [ ] Invalid HMAC returns 401 (verify after deploy)
- [ ] Voice smoke tests pass (verify after deploy)

## Recently Completed

| Task | Description | Date |
|------|-------------|------|
| _None_ | | |

## Archived Completions

| Task | Description | Date |
|------|-------------|------|
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
| 1 | INFRA-003 | Update Playwright E2E tests to import from @prime/ui-ai |
| 2 | N8N-ACTIVATE | Activate n8n workflow (user action — see IMPORT-INSTRUCTIONS.md) |

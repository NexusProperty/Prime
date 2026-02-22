# ORION-002 — Full Project Status Report

> **Orion ID:** ORION-002  
> **Date:** 2026-02-22  
> **Scope:** Full project root `F:/Prime`  
> **Related:** ORION-001 (Skills Review, 2026-02-19)

---

## Executive Summary

Sprint 1 of the United Trades hub-and-spoke ecosystem is **complete**. Three live sites (Prime Electrical, AKF Construction, CleanJet) are deployed. Mission Control is built but not yet deployed to Vercel. Voice agents (Max/Alex/Jess) are live. The n8n lead enrichment workflow is built but not activated. Several user actions are blocking full production readiness.

---

## Project Dashboard

| Area | Status | Notes |
|------|--------|-------|
| Prime Electrical site | ✅ Live (HTTP 200) | Supabase leads, Vapi Max |
| AKF Construction site | ✅ Live (HTTP 200) | Vapi Alex — NZ number pending |
| CleanJet site | ✅ Live (HTTP 200) | Vapi Jess — NZ number pending |
| Mission Control | 🟡 Built, not deployed | Vercel env vars needed |
| Supabase | ✅ Active | 11 tables, 9 Edge Functions, pg_cron |
| Vapi Voice Agents | 🟡 Live, pending smoke test | 3 assistants, pgvector RAG |
| n8n Lead Enrichment | 🔴 Not activated | Workflow JSON exists, not imported |
| E2E Tests | 🟡 Partial | API tests skipped in CI |
| CleanJet Deep Clean page | 🔴 404 | Content ready in websiteinfo |
| AKF + CleanJet KB seeding | 🔴 Not done | FAQ content not embedded |
| Email responder | 🔴 Not built | Resend/Postmark not configured |

---

## Architecture Overview

```
United Trades Monorepo (F:/Prime)
├── prime-electrical/       Next.js 15 site — electrical services
├── akf-construction/       Next.js 15 site — construction/renovation  
├── cleanjet/               Next.js 15 site — cleaning services
├── mission-control/        Next.js 16 internal dashboard (13 routes, 85 TS files)
├── packages/ui-ai/         Shared @prime/ui-ai — AI components
├── supabase/               Migrations, 9 Edge Functions, seed data
├── e2e/                    Playwright E2E (6 spec files)
└── websiteinfo/            Scraped content for 5+ brands
```

**Tech Stack:** Next.js 15/16, React 19, TypeScript strict, Tailwind v4, Supabase, Make.com, OpenAI GPT-4o, Vapi.ai, Telnyx, n8n, pg_cron, pgvector

---

## Live Infrastructure

### Supabase (`tfdxlhkaziskkwwohtwd.supabase.co`)
- **Tables:** sites, contacts, events, emails, agents, agent_actions, agent_memory, workers, connections, records, outbound_queue
- **Edge Functions (all ACTIVE):** ingest-prime, ingest-akf, ingest-cleanjet, vapi-webhook, lead-qualifier, data-monitor, mc-analytics, mc-connections, mc-send
- **SQL Functions:** analytics_summary(), claim_outbound_queue_items(), auth_user_site_ids()
- **pg_cron:** mc-send scheduled (confirm `*/1 * * * *` set in Dashboard)

### Vapi Voice Agents
| Agent | Site | Status |
|-------|------|--------|
| Max | Prime Electrical | ✅ Live |
| Alex | AKF Construction | 🟡 NZ number not assigned |
| Jess | CleanJet | 🟡 NZ number not assigned |

---

## Completed Work (Sprint 1)

| Archive ID | What Was Built |
|-----------|----------------|
| MC-001 | Mission Control — 13 routes, 85 TS files, 4 DB tables, 3 Edge Functions, RLS, pg_cron |
| VAPI-001 | 3 Vapi voice agents with pgvector RAG |
| INFRA-003 | Root tsconfig + E2E type imports from @prime/ui-ai |
| PHASE6-001 | n8n lead enrichment workflow (blueprint + JSON) |
| DEPLOY-002 | Production deployment of all 3 sites |
| TEST-002 | 39 E2E tests |
| AI-UX-001 | AI component library |
| SPRINT2-POST-DEPLOY | pg_net trigger, n8n migration |
| QA-SPRINT-001 | Production build validation |
| ORION-001 | 9 project skills created for United Trades stack |

---

## Anomalies / Data Issues

| Issue | Details |
|-------|---------|
| **PHASE6-001 folder missing** | Archive references `memory-bank/build/PHASE6-001/` with IMPORT-INSTRUCTIONS.md and n8n workflow JSON, but folder has 0 files. May need recreation. |
| **progress.md outdated** | Lists "Next Milestone: INFRA-003" but INFRA-003 is complete and archived. Update progress.md. |
| **AKF email typo** | `websiteinfo/` has `info@akfconstructions.co.nz` (extra 's'); correct is `info@akfconstruction.co.nz` |

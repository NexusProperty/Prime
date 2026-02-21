# Active Context

**Last Updated:** 2026-02-21
**Status:** RESTORE-DESIGN-001 Complete — Visual design matches live sites, ready for DEPLOY-001

---

## Current Focus

**RESTORE-DESIGN-001** completed. The local code now matches the live Vercel site design ("Phase A / brutalist-technical" aesthetic) while retaining all AI backend code added during the AI-UX-001 sprint.

### What was restored
- **AKF Construction Hero**: "We Build Auckland." — white background, right-aligned grayscale photo, brutalist headline, hairline underline CTA
- **AKF PrimaryFeatures**: 4-card grid (Renovations, Decks, New Builds, Fencing) matching "Engineered Solutions." layout
- **Prime Electrical Hero**: "Engineered Currents." — HUD/terminal style with SYSTEM ONLINE pulsing indicator, `> Initiate Diagnostic` button, credential stamps
- **Prime Electrical Header**: "SYSTEM ONLINE" top telemetry bar on dark `bg-slate-950`, mono font nav, square logo block
- **Prime Electrical PrimaryFeatures**: Dark `bg-slate-950` system architecture selector — Solar/Mains/Smart tabs with data display panel, metric readouts, system parameters
- **Prime Electrical CallToAction**: Two sections — "System Upgrades from $0 Upfront" financing grid + "Commence Operations." CTA with CALL/SUBMIT buttons
- **CleanJet SecondaryFeatures**: "Uncompromising Cleanliness." numbered clinical verification cards (01/02/03 format)
- **CleanJet CallToAction**: AKF cross-sell banner + "Immaculate. By Design." dark CTA section with guarantee cards

All three sites: ✅ TypeScript 0 errors confirmed post-restoration

---

## What Was Just Archived

- **AI-UX-001** — AI component library + per-site Salient redesigns + full backend integration
- **QA-SPRINT-001** — TypeScript fix (supabase-js v2.97 breaking change), live DB connection

---

## Ready to Start

The next sprint should begin with `/van DEPLOY-001` to deploy all three sites to Vercel.

### Recommended Next Tasks (priority order)

| Priority | Task ID | Description |
|----------|---------|-------------|
| 1 | DEPLOY-001 | Deploy all 3 sites to Vercel with production env vars |
| 2 | INFRA-002 | Implement `@prime/ui-ai` npm workspace shared package |
| 3 | PHASE5-001 | Wire Supabase DB webhook → Simpro/Fergus sync |
| 4 | PHASE5-002 | Wire Make.com scenario to `/api/leads/enrich` |
| 5 | TEST-001 | Playwright E2E tests for booking wizard + lead capture |

---

## Key Environment Facts (for next agent)

- **Supabase project:** `tfdxlhkaziskkwwohtwd.supabase.co`
- **Tables live:** `leads`, `customers`, `cross_sell_events` (with `synced_at`, `job_management_id` on leads)
- **Supabase types:** `prime-electrical/src/types/database.ts` — CLI-generated, do NOT handwrite
- **Migration naming convention:** `YYYYMMDDHHMMSS_name.sql`
- **Sites:** `f:/Prime/prime-electrical/`, `f:/Prime/akf-construction/`, `f:/Prime/cleanjet/`
- **Shared AI components:** Duplicated per site (INFRA-002 will deduplicate)
- **AI prompts:** `memory-bank/ai-prompts/master-email-parser-gpt4o.md` (Make.com GPT-4o system prompt)

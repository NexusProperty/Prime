# ORION-002 — Everything Left To Do

> **Orion ID:** ORION-002  
> **Date:** 2026-02-22  
> **Project:** United Trades (Prime Electrical, AKF Construction, CleanJet, Mission Control)

---

## SECTION A — Blocking User Actions (Human Must Do These)

These cannot be automated. The human must perform them manually.

### A-001 · Deploy Mission Control to Vercel
**Priority:** 🔴 Critical  
**Source:** `memory-bank/activeContext.md`, `memory-bank/archive/MC-001/`

Steps:
1. Go to Vercel Dashboard → mission-control project → Settings → Environment Variables
2. Add `NEXT_PUBLIC_SUPABASE_URL` = `https://tfdxlhkaziskkwwohtwd.supabase.co`
3. Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (from Supabase Dashboard → Settings → API)
4. Run `vercel --prod` from `mission-control/` directory
5. Go to Supabase Dashboard → Authentication → URL Configuration → set Site URL and Redirect URLs to the new Vercel URL

---

### A-002 · Activate n8n Lead Enrichment Workflow
**Priority:** 🔴 Critical  
**Source:** `memory-bank/tasks.md`, `memory-bank/archive/SPRINT3/`

⚠️ Note: `memory-bank/build/PHASE6-001/` folder appears missing (IMPORT-INSTRUCTIONS.md and workflow JSON not found). May need to be recreated by AI.

Steps (when instructions are available):
1. Import `united-trades-lead-enrichment.workflow.json` into n8n
2. Connect OpenAI credential in n8n
3. Set `ENRICH_SECRET` environment variable
4. Add `N8N_WEBHOOK_URL` to Vercel environment variables for prime-electrical
5. Redeploy prime-electrical: `vercel --prod` from `prime-electrical/`
6. Test by submitting a lead form on the Prime Electrical site

---

### A-003 · Assign NZ Phone Numbers to AKF (Alex) and CleanJet (Jess) Vapi Assistants
**Priority:** 🟡 High  
**Source:** `memory-bank/activeContext.md`, `MissionControl/architecture.md`

Steps:
1. Go to Telnyx Dashboard → purchase 2 NZ phone numbers (Auckland area)
2. Go to Vapi Dashboard → Alex assistant → assign Telnyx number
3. Go to Vapi Dashboard → Jess assistant → assign Telnyx number
4. Update AKF Construction site with Alex's number
5. Update CleanJet site with Jess's number

---

### A-004 · Voice Smoke Test
**Priority:** 🟡 High  
**Source:** `memory-bank/reflection/VAPI-001/`

Steps:
1. Call Max (Prime Electrical) — test lead capture flow
2. Call Alex (AKF Construction) — test FAQ and booking flow (once number assigned)
3. Call Jess (CleanJet) — test FAQ and booking flow (once number assigned)
4. Verify Vapi webhook fires and data lands in Supabase `events` table

---

### A-005 · Confirm mc-send pg_cron Schedule
**Priority:** 🟡 High  
**Source:** `MissionControl/reflection.md`

Steps:
1. Go to Supabase Dashboard → Database → Functions → Schedules
2. Confirm `mc-send` is scheduled at `*/1 * * * *`
3. If not set, add the schedule

---

## SECTION B — AI/Development Tasks (Next Sprint)

### B-001 · Recreate PHASE6-001 n8n Import Instructions
**Priority:** 🔴 Critical (blocks A-002)  
**Effort:** Small (1-2 hours)

The `memory-bank/build/PHASE6-001/` folder appears to be missing. The AI should:
- Recreate `IMPORT-INSTRUCTIONS.md` from the SPRINT3 archive description
- Recreate the n8n workflow JSON (or locate the original from git history)
- Re-establish the folder structure

---

### B-002 · Seed AKF and CleanJet Knowledge Bases
**Priority:** 🟡 High  
**Effort:** Medium (2-4 hours)  
**Source:** `memory-bank/activeContext.md`, `websiteinfo/`

Embed FAQ and service content for Alex (AKF) and Jess (CleanJet) into the Supabase pgvector knowledge base, so the voice agents can answer questions accurately.

Files to use:
- `websiteinfo/akf-construction/` — all pages
- `websiteinfo/cleanjet/` — all pages + deep-clean.md

---

### B-003 · Build CleanJet Deep Clean Page
**Priority:** 🟡 High  
**Effort:** Small-Medium (2-4 hours)  
**Source:** `websiteinfo/cleanjet/deep-clean.md`

The Deep Clean page is 404. Content exists in `websiteinfo/cleanjet/deep-clean.md`. Build the page at `cleanjet/app/deep-clean/page.tsx`.

---

### B-004 · Mission Control Polish — Dynamic Payload Fields
**Priority:** 🟠 Medium  
**Effort:** Medium (4-8 hours)  
**Source:** `MissionControl/reflection.md`

The `/records/new` route needs per-type dynamic fields for: quote, job, invoice, note, booking, task. Currently fields are static/generic.

---

### B-005 · Mission Control — Wire Up ConnectionCard Test & Delete
**Priority:** 🟠 Medium  
**Effort:** Small (2-4 hours)  
**Source:** `MissionControl/reflection.md`

The Test and Delete actions on ConnectionCard components need to be wired to the `mc-connections` Edge Function.

---

### B-006 · Mission Control — Error Boundaries
**Priority:** 🟠 Medium  
**Effort:** Small (2-3 hours)  
**Source:** `MissionControl/reflection.md`

Add React error boundaries to all Mission Control dynamic routes to prevent full-page crashes.

---

### B-007 · Confirm Supabase Vault Functions
**Priority:** 🟠 Medium  
**Effort:** Small (30 min)  
**Source:** `MissionControl/reflection.md`

Verify `vault_upsert_secret` and `vault_delete_secret` are available in the Supabase project. Run a test from the SQL Editor.

---

### B-008 · Email Inbound/Outbound Infrastructure
**Priority:** 🟠 Medium  
**Effort:** Large (8-16 hours)  
**Source:** `MissionControl/architecture.md`

- Configure Resend or Postmark as email provider
- Create `ingest-email` Supabase Edge Function
- Build email responder agent logic
- Wire to `outbound_queue` / `mc-send`

---

### B-009 · Mission Control — CSV Export on /records
**Priority:** 🟢 Low  
**Effort:** Small (2-3 hours)  
**Source:** `MissionControl/reflection.md`

Add CSV export button to the `/records` table view.

---

### B-010 · Enable API E2E Tests in CI
**Priority:** 🟠 Medium  
**Effort:** Small (1-2 hours)  
**Source:** `e2e/` spec files

Currently `PLAYWRIGHT_SKIP_API_TESTS=true` by default, skipping 17 tests across:
- `api-leads.spec.ts` (5 tests)
- `cross-sell-edge-cases.spec.ts` (11 tests)
- `jobs-sync.spec.ts` (1 test)

Enable these by configuring Supabase test credentials in CI environment.

---

### B-011 · Update progress.md
**Priority:** 🟢 Low  
**Effort:** Tiny (15 min)

`progress.md` lists "Next Milestone: INFRA-003" but INFRA-003 is complete. Update to reflect current state.

---

### B-012 · Fix AKF Email Typo in websiteinfo
**Priority:** 🟢 Low  
**Effort:** Tiny (5 min)

`websiteinfo/websiteinfo.md` has `info@akfconstructions.co.nz` (extra 's'). Correct is `info@akfconstruction.co.nz`. Fix to avoid confusion when using this content.

---

## SECTION C — Content & Design Gaps

### C-001 · CleanJet Brand Assets (Blocking Soft Launch)
**Source:** `design_plan.md`

Still TBC / needed from client:
- Logo
- Phone number
- Email address
- Project/team photos
- Testimonials (real)
- Domain name
- Booking system integration

---

### C-002 · Prime Electrical — Missing Email on Site
**Source:** `design_plan.md`

Email address is not displayed on the Prime Electrical website. Add to contact section and footer.

---

### C-003 · All Sites — Real Project Photos
**Source:** `design_plan.md`

All 3 sites currently use placeholder/stock images. Real project photos needed from client for:
- Prime Electrical — completed electrical jobs
- AKF Construction — renovation/build projects
- CleanJet — before/after cleaning shots

---

## SECTION D — Future / Backlog

### D-001 · Contact Deduplication Service
**Source:** `MissionControl/architecture.md`

Detect and merge duplicate contacts across sites.

---

### D-002 · Event Replay Capability
**Source:** `MissionControl/architecture.md`

Allow replaying events for debugging and audit purposes.

---

### D-003 · SMS Notifications
**Source:** `MissionControl/architecture.md`

TBD — outbound SMS via Twilio for lead follow-up.

---

### D-004 · Create Curated .agent Skills Index
**Source:** ORION-001 (T-007)

Create `CURATED-AGENT-SKILLS.md` index for the 864+ `.agent` skills to make them discoverable.

---

### D-005 · United Trades Skill Pack (Optional)
**Source:** ORION-001 (T-008)

Bundle the 9 created project skills into a distributable skill pack.

---

## Summary Counts

| Section | Count | Status |
|---------|-------|--------|
| A — Blocking User Actions | 5 | Human must do |
| B — AI/Dev Tasks | 12 | Ready to build |
| C — Content/Design Gaps | 3 | Client-dependent |
| D — Future/Backlog | 5 | Deferred |
| **Total** | **25** | |

---

## Recommended Next Actions

1. **A-001** — Deploy Mission Control (high impact, enables team to use dashboard)
2. **B-001** — Recreate n8n import instructions (blocks A-002)
3. **A-002** — Activate n8n workflow (enables lead enrichment)
4. **A-003** — Assign NZ numbers to AKF/CleanJet voice agents
5. **B-002** — Seed AKF + CleanJet knowledge bases (improves voice agent quality)
6. **B-003** — Build CleanJet Deep Clean page (fixes 404)

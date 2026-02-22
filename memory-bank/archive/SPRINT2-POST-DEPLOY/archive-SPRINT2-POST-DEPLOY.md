# TASK ARCHIVE: SPRINT2-POST-DEPLOY — Post-Deployment Integration Sprint

## METADATA
- **Sprint ID:** SPRINT2-POST-DEPLOY
- **Tasks Covered:** PHASE5-001, PHASE5-002, TEST-001
- **Complexity:** Level 4
- **Status:** ✅ COMPLETE & ARCHIVED
- **Date:** 2026-02-21
- **Files Consolidated:** 1 (reflection-SPRINT2-POST-DEPLOY.md)
- **Outcome:** Supabase pg_net trigger live, n8n migration complete, 39/39 Playwright E2E tests passing

---

## SUMMARY

Post-deployment integration sprint wiring three production systems:

1. **PHASE5-001** — Supabase database webhook trigger (pg_net) that POSTs to `/api/jobs/sync` when a lead's `lead_status` transitions to `'converted'`, enabling automated job creation in Simpro/Fergus.
2. **PHASE5-002** — Migrated automation platform from Make.com to n8n. Renamed `MAKE_WEBHOOK_URL` → `N8N_WEBHOOK_URL` across all code and docs. Added `GET /api/leads/enrich` health-check endpoint for n8n endpoint verification. Created comprehensive n8n workflow blueprint.
3. **TEST-001** — First E2E test suite for the project using Playwright. 39 tests across 3 spec files covering LeadCaptureForm, BookingWizard, and API route security/functionality. Configured multi-server Playwright setup against all three sites.

---

## IMPLEMENTATION

### PHASE5-001: Supabase pg_net Trigger

**Goal:** Automatically notify the job sync API when a lead is converted.

**Key file:** `supabase/migrations/20260221003_lead_converted_webhook.sql`

```sql
CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.notify_job_sync()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE payload jsonb;
BEGIN
  IF NEW.lead_status = 'converted' AND (OLD.lead_status IS DISTINCT FROM 'converted') THEN
    payload := jsonb_build_object(
      'type', 'UPDATE', 'record', row_to_json(NEW)::jsonb, 'old_record', row_to_json(OLD)::jsonb
    );
    PERFORM net.http_post(
      url := 'https://prime-electrical-nu.vercel.app/api/jobs/sync',
      body := payload,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-sync-secret', current_setting('app.job_sync_secret', true)
      )
    );
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS lead_converted_sync ON public.leads;
CREATE TRIGGER lead_converted_sync
  AFTER UPDATE ON public.leads FOR EACH ROW
  EXECUTE FUNCTION public.notify_job_sync();
```

**Key learning:** `pg_net` installs into the `net` schema — use `net.http_post`, NOT `extensions.http_post`.

---

### PHASE5-002: n8n Migration from Make.com

**Files changed:**
- `prime-electrical/src/app/api/leads/submit/route.ts` — `MAKE_WEBHOOK_URL` → `N8N_WEBHOOK_URL`
- `prime-electrical/src/app/api/leads/enrich/route.ts` — Added `GET` health-check handler
- `prime-electrical/src/app/api/voice/webhook/route.ts` — `MAKE_WEBHOOK_URL` → `N8N_WEBHOOK_URL`
- All three sites' `.env.local.example` files — updated variable name
- `memory-bank/build/PHASE5-002/n8n-workflow-blueprint.md` — created (workflow guide)
- `memory-bank/build/PHASE5-002/make-com-scenario-blueprint.md` — deleted

**n8n Workflow (5 nodes):**
1. Webhook trigger (receives lead payload)
2. OpenAI GPT-4o (cross-sell analysis using system prompt from `ai-prompts/cross-sell-gpt4o.md`)
3. Code node (parses JSON output: `aiNotes`, `crossSell.partnerBrand`, `crossSell.servicePitch`)
4. HTTP POST → `/api/leads/enrich` with `x-enrich-secret` header
5. (Optional) Send email reply

**User action required:**
1. Build n8n workflow per `memory-bank/build/PHASE5-002/n8n-workflow-blueprint.md`
2. Activate → copy Production Webhook URL
3. Set `N8N_WEBHOOK_URL` in Vercel (Prime Electrical) → redeploy
4. Verify `ENRICH_SECRET` is set in Vercel

---

### TEST-001: Playwright E2E Test Suite

**Location:** `f:/Prime/e2e/` (monorepo root)
**Config:** `f:/Prime/playwright.config.ts`
**Run:** `npm run test:e2e` from monorepo root

| File | Tests | What it covers |
|------|-------|----------------|
| `e2e/lead-capture-form.spec.ts` | 9 | LeadCaptureForm: fields, validation, submission, cross-sell accept/decline, API failure |
| `e2e/booking-wizard.spec.ts` | 13 | BookingWizard: all 3 steps, price calculation, extras, navigation, happy paths |
| `e2e/api-leads.spec.ts` | 13 | API routes: 400/403 security, real DB writes, cross-sell detection, health checks |

**Key Playwright patterns established:**
- Scope selectors to containers: `page.locator('#booking').getByRole('button', { name: /confirm/i })`
- Use `role="dialog"` for modal detection: `page.getByRole('dialog', { name: /ai recommendation/i })`
- `reuseExistingServer: true` in `playwright.config.ts` webServer entries
- Skip real DB tests in CI: `test.skip(SKIP, 'Set PLAYWRIGHT_SKIP_API_TESTS=false to enable')`

---

## TESTING

- 39/39 Playwright E2E tests passing
- All 3 sites: TypeScript 0 errors (pre-existing state maintained)
- Supabase pg_net trigger verified live on `tfdxlhkaziskkwwohtwd.supabase.co`
- API routes security verified: 403 on wrong secrets, 400 on missing fields

---

## CHALLENGES & RESOLUTIONS

| Challenge | Resolution |
|-----------|-----------|
| `pg_net` schema — `extensions.http_post` failed | Verified with `pg_get_function_arguments` → correct: `net.http_post` |
| Playwright strict mode: `getByText('Book Your Clean')` matched 2 elements | Scoped to `page.locator('#booking').getByRole('heading', ...)` |
| Playwright strict mode: `getByText(/cleanjet/i)` matched footer + modal | Used `page.getByRole('dialog', { name: /ai recommendation/i })` instead |
| n8n HTTP Request node verification requires GET endpoint | Added `GET /api/leads/enrich` handler returning `{ ok: true, endpoint: 'leads/enrich' }` |
| `reuseExistingServer` conflict with already-running servers | Set `reuseExistingServer: true` explicitly (was conditional on `!process.env.CI`) |

---

## LESSONS LEARNED

1. **Always verify extension schemas** — Don't assume `extensions.*`; check with `pg_get_function_arguments`
2. **E2E selectors need context** — Scope to parent containers or use semantic roles to avoid strict mode violations
3. **Workflow platforms need GET health checks** — n8n verifies endpoints with GET before activation
4. **Test against running servers** — `reuseExistingServer: true` speeds up iteration significantly
5. **Strict mode finds real UI bugs** — Duplicate text is a real UX problem, not just a test problem

---

## SKILL CANDIDATES

| Pattern | Status | Notes |
|---------|--------|-------|
| PostgreSQL trigger webhooks via pg_net | New candidate | Pattern for `net.http_post` from Postgres triggers |
| Dynamic entity selectors | Exists | `f:/Prime/.cursor/skills/dynamic-entity-selectors/SKILL.md` |
| E2E selector verification | Exists | `f:/Prime/.cursor/skills/e2e-selector-verification/SKILL.md` |
| Radix UI E2E testing | Exists | `f:/Prime/.cursor/skills/radix-ui-e2e/SKILL.md` |

---

## ARCHIVED FILES

| Source File | Action |
|-------------|--------|
| `memory-bank/reflection/SPRINT2-POST-DEPLOY/reflection-SPRINT2-POST-DEPLOY.md` | Consolidated into this archive |

---

## ENVIRONMENT STATE (at archive time)

- **Supabase project:** `tfdxlhkaziskkwwohtwd.supabase.co`
- **Tables:** `leads`, `customers`, `cross_sell_events`
- **Trigger:** `lead_converted_sync` on `leads` → `net.http_post` to `/api/jobs/sync`
- **Automation:** n8n (migrated from Make.com) — env var: `N8N_WEBHOOK_URL`
- **Sites live:** `prime-electrical-nu.vercel.app`, `akf-construction.vercel.app`, `cleanjet-phi.vercel.app`
- **E2E tests:** `f:/Prime/e2e/` — 39 tests, all passing

---

*Archived: 2026-02-21 | Sprint duration: 1 day | Tests: 39/39 | TypeScript errors: 0*

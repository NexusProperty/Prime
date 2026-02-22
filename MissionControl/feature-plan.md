# Mission Control — Feature Plan

> **Status:** Planning complete — ready for Phase 2 (schema) and Phase 3 (frontend)
> **Authored:** 2026-02-22
> **Based on audit of:** `architecture.md`, `schema.sql`, `agent-registry.md`, all deployed Edge Functions

---

## Existing Infrastructure (Do Not Replace)

| Asset | Status |
|-------|--------|
| `sites`, `contacts`, `events`, `emails`, `agents`, `agent_actions`, `agent_memory` tables | ✅ Applied |
| `ingest-prime`, `ingest-akf`, `ingest-cleanjet` Edge Functions | ✅ Live |
| `vapi-webhook`, `lead-qualifier`, `data-monitor` Edge Functions | ✅ Live |
| `_shared/ingest.ts`, `_shared/security.ts`, `_shared/types.ts` | ✅ Live |
| Supabase project: `tfdxlhkaziskkwwohtwd.supabase.co` | ✅ Live |

All new capabilities extend this foundation. No existing tables or functions are modified.

---

## Capability 1 — API Connection Manager

**What it does:** Lets admins connect third-party apps (CRMs, Zapier, Slack, accounting tools) to Mission Control on a per-site basis, with secure key storage, enable/disable control, and sync status tracking.

### Database

New table: **`connections`**

```sql
connections (
  id              UUID PK
  site_id         UUID → sites(id)         -- which site owns this connection
  app_name        TEXT NOT NULL            -- e.g. "Zapier", "HubSpot", "Xero"
  app_slug        TEXT NOT NULL            -- machine-readable: 'zapier', 'hubspot'
  vault_secret_id TEXT                     -- Supabase Vault secret name (never plaintext)
  config          JSONB DEFAULT '{}'       -- non-secret config (webhook URLs, scopes)
  is_enabled      BOOLEAN DEFAULT true
  last_sync_at    TIMESTAMPTZ
  last_sync_status TEXT                    -- 'success' | 'error' | 'pending'
  last_sync_error TEXT
  created_by      UUID → auth.users(id)
  created_at      TIMESTAMPTZ DEFAULT NOW()
  updated_at      TIMESTAMPTZ DEFAULT NOW()
  UNIQUE(site_id, app_slug)
)
```

**Supabase Vault usage:** API keys are stored via `vault.create_secret(key_value, secret_name)`. The `vault_secret_id` column stores only the secret name (e.g. `conn_hubspot_prime`). Edge Functions retrieve the key at runtime with `vault.decrypted_secrets`.

### UI Screens

| Screen | Description |
|--------|-------------|
| `/connections` | List all connections across all sites (scoped by site-selector). Table: app name, site, status, last sync. Actions: enable/disable, edit, delete. |
| `/connections/new` | Add a new connection. Form: site selector, app picker, API key input (masked). On save: writes to Vault, inserts row. |
| `/connections/[id]` | Detail view: config editor, sync history, test connection button, credential rotation. |

### Edge Functions

- **`mc-connections`** — CRUD gateway for the `connections` table.
  - `GET /` — list connections for a site (from JWT site context)
  - `POST /` — create connection, write secret to Vault via `vault.create_secret`
  - `PATCH /:id` — update config or toggle `is_enabled`; rotate Vault secret if key provided
  - `DELETE /:id` — delete row and remove Vault secret

### Dependencies

- Supabase Vault (already enabled on the project)
- Supabase Auth (for `created_by` and RLS)
- Existing `sites` table

---

## Capability 2 — Data Storage (Per Site / Per Worker / Per Record)

**What it does:** Stores all business records — quotes, jobs, invoices, contacts, notes — inside Mission Control, tagged by site, worker, and record type. When a quote is generated on Site 1, it lands here, searchable and auditable.

### Database

New table: **`workers`** (admins and contractors scoped to a site)

```sql
workers (
  id          UUID PK
  site_id     UUID → sites(id)
  user_id     UUID → auth.users(id)       -- Supabase Auth user
  full_name   TEXT NOT NULL
  email       TEXT NOT NULL
  role        TEXT DEFAULT 'worker'
              CHECK (role IN ('admin', 'manager', 'worker'))
  is_active   BOOLEAN DEFAULT true
  metadata    JSONB DEFAULT '{}'
  created_at  TIMESTAMPTZ DEFAULT NOW()
  updated_at  TIMESTAMPTZ DEFAULT NOW()
  UNIQUE(site_id, email)
)
```

New table: **`records`** (unified record storage)

```sql
records (
  id              UUID PK
  site_id         UUID → sites(id)        -- which site this record belongs to
  worker_id       UUID → workers(id)      -- who created/owns this record (nullable)
  contact_id      UUID → contacts(id)     -- the customer this record is for (nullable)
  source_event_id UUID → events(id)       -- the inbound event that created this (nullable)
  record_type     TEXT NOT NULL
                  -- 'quote' | 'job' | 'invoice' | 'note' | 'booking' | 'task'
  status          TEXT NOT NULL DEFAULT 'open'
                  -- 'open' | 'pending' | 'approved' | 'completed' | 'cancelled'
  title           TEXT NOT NULL           -- human-readable summary
  amount          NUMERIC(12,2)           -- dollar value (quotes/invoices)
  currency        TEXT DEFAULT 'NZD'
  payload         JSONB NOT NULL DEFAULT '{}'  -- full record data (flexible)
  tags            TEXT[] DEFAULT '{}'
  due_at          TIMESTAMPTZ
  closed_at       TIMESTAMPTZ
  created_at      TIMESTAMPTZ DEFAULT NOW()
  updated_at      TIMESTAMPTZ DEFAULT NOW()
)
```

### Indexes

```sql
CREATE INDEX records_site_idx ON records(site_id);
CREATE INDEX records_worker_idx ON records(worker_id);
CREATE INDEX records_contact_idx ON records(contact_id);
CREATE INDEX records_type_idx ON records(record_type);
CREATE INDEX records_status_idx ON records(status);
CREATE INDEX records_created_idx ON records(created_at DESC);
CREATE INDEX records_site_type_idx ON records(site_id, record_type);
CREATE INDEX workers_site_idx ON workers(site_id);
CREATE INDEX workers_user_idx ON workers(user_id);
```

### RLS Policies

- `workers`: users can only see workers for sites they belong to
- `records`: workers see only records where `site_id` matches their site(s). Admins see all.
- `connections`: site admins can manage their own site's connections; global admins see all

### UI Screens

| Screen | Description |
|--------|-------------|
| `/records` | Unified record browser. Filters: site, record_type, status, worker, date range. Columns: title, type, site, worker, status, amount, created. Export to CSV. |
| `/records/[id]` | Record detail. Shows: all payload fields, linked contact card, source event, timeline of related agent actions. Edit status, add notes. |
| `/records/new` | Create a record manually. Select site, type, assign to worker, link to contact, fill payload. |
| `/sites/[id]/records` | Same as `/records` but pre-filtered to one site. |

### Edge Functions

No dedicated Edge Function needed — the `records` and `workers` tables are read/written directly via the Supabase client from the frontend (with RLS enforcing access) and from ingest functions (which can call `supabase.from('records').insert(...)` after creating an event).

Ingest functions can be extended to optionally create a `records` row when a booking or quote event is received.

### Dependencies

- Existing `sites`, `contacts`, `events` tables
- Supabase Auth for `worker.user_id` linkage
- RLS policies (new — documented in Phase 2)

---

## Capability 3 — Data Analytics Dashboard

**What it does:** A per-site and cross-site analytics view showing record counts by type, activity over time, agent action summaries, top workers by activity, and data health metrics (unprocessed events, agent failures).

### Database

No new tables. Queries run against existing tables: `events`, `contacts`, `agent_actions`, `records`, `agents`, `sites`.

New SQL function: **`analytics_summary`**

Returns a JSON aggregate covering:
- Total records by type (per site or all sites)
- Events in last 7/30 days by site
- Agent actions by status (success/failed/escalated) in last 7 days
- Top workers by record count
- Data health: unprocessed event count, failed agent actions in last hour

### UI Screens

| Screen | Description |
|--------|-------------|
| `/dashboard` | Cross-site overview. Cards: total contacts, total events (7d), agent actions (7d), records by type. Chart: events per day (all sites stacked). Table: sites health status. |
| `/sites/[id]` | Per-site view. Same structure but scoped. Includes: recent records, recent contacts, recent agent actions for this site. |
| `/agents` | Agent activity log. List all agents with status, last action time, success rate. Expandable: last 20 actions per agent. Controls: enable/disable agent. |

### Edge Functions

- **`mc-analytics`** — server-side aggregation to keep dashboard queries fast.
  - `GET /?site_id=&range=7d` — returns the analytics_summary JSON
  - Accepts optional `site_id` (omit = all sites)
  - Accepts `range` param: `1d`, `7d`, `30d`
  - Calls the `analytics_summary` DB function and returns structured JSON
  - Auth: requires valid Supabase JWT in `Authorization` header

### Dependencies

- Existing `events`, `contacts`, `agent_actions`, `agents`, `sites` tables
- New `records`, `workers` tables (Capability 2)
- Supabase Auth for scoped access

---

## Capability 4 — Send & Sync Engine

**What it does:** Mission Control can push data back to any of the 3 sites — send a quote confirmation email, update a job status on a site's CRM, or trigger a webhook back to a site. Failed deliveries are retried automatically with exponential backoff.

### Database

New table: **`outbound_queue`**

```sql
outbound_queue (
  id                UUID PK
  site_id           UUID → sites(id)        -- target site
  record_id         UUID → records(id)      -- optional: the record being sent
  contact_id        UUID → contacts(id)     -- optional: the contact involved
  delivery_type     TEXT NOT NULL
                    -- 'webhook' | 'email' | 'sms'
  destination_url   TEXT                    -- target URL (for webhook delivery)
  destination_email TEXT                    -- target email (for email delivery)
  payload           JSONB NOT NULL DEFAULT '{}'  -- data to deliver
  status            TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'sending', 'delivered', 'failed', 'cancelled'))
  attempt_count     INTEGER DEFAULT 0
  max_attempts      INTEGER DEFAULT 5
  last_attempted_at TIMESTAMPTZ
  next_attempt_at   TIMESTAMPTZ DEFAULT NOW()  -- used for backoff scheduling
  delivered_at      TIMESTAMPTZ
  error             TEXT
  created_by_agent  UUID → agents(id)       -- which agent enqueued this
  idempotency_key   TEXT UNIQUE             -- prevents duplicate deliveries
  created_at        TIMESTAMPTZ DEFAULT NOW()
  updated_at        TIMESTAMPTZ DEFAULT NOW()
)
```

**Retry logic:** Exponential backoff — attempt N retries at `NOW() + 2^(attempt_count) * 30 seconds`. After `max_attempts`, status set to `'failed'` and an alert is logged to `agent_actions`.

### Indexes

```sql
CREATE INDEX outbound_queue_status_idx ON outbound_queue(status, next_attempt_at)
  WHERE status = 'pending';
CREATE INDEX outbound_queue_site_idx ON outbound_queue(site_id);
```

### UI Screens

| Screen | Description |
|--------|-------------|
| `/settings/outbound` | Outbound queue monitor. Table: destination, type, status, attempts, last attempt, next retry. Actions: cancel, retry now. Filter by site/status. |

### Edge Functions

- **`mc-send`** — cron-triggered (every 1 minute) outbound delivery processor.
  - Claims up to 25 `pending` items where `next_attempt_at <= NOW()` using a `FOR UPDATE SKIP LOCKED` select to prevent double-processing.
  - For `webhook` type: `fetch(destination_url, { method: 'POST', body: payload })`
  - For `email` type: calls Resend API with payload fields
  - On success: sets `status = 'delivered'`, `delivered_at = NOW()`
  - On failure: increments `attempt_count`, calculates next backoff time, sets `status = 'pending'`
  - After max attempts: sets `status = 'failed'`, writes to `agent_actions` as `alert_sent`
  - Respects `idempotency_key` — will not re-send a delivered item

### Dependencies

- New `outbound_queue` table
- Existing `sites`, `records`, `contacts`, `agents` tables
- `RESEND_API_KEY` env var (for email delivery)
- Each site's webhook URL stored in `sites.metadata.outbound_webhook_url`

---

## Capability 5 — Mission Control Website Shell

**What it does:** A standalone Next.js 14 (App Router) web application authenticating via Supabase Auth, with a persistent sidebar navigation, a site-selector context bar, and route structure covering all 4 capability areas.

### App Structure

```
/app
  layout.tsx              ← Root layout: AuthGuard + SiteProvider + Sidebar
  page.tsx                ← Redirect to /dashboard
  /dashboard
    page.tsx              ← Cross-site analytics overview
  /sites
    /[id]
      page.tsx            ← Per-site records + analytics
      /records
        page.tsx          ← Site-scoped record browser
  /connections
    page.tsx              ← API Connection Manager list
    /new
      page.tsx            ← Add new connection
    /[id]
      page.tsx            ← Connection detail + credential management
  /records
    page.tsx              ← Unified record browser (all sites)
    /[id]
      page.tsx            ← Record detail
    /new
      page.tsx            ← Create record manually
  /agents
    page.tsx              ← Agent activity log and controls
  /settings
    page.tsx              ← User settings
    /outbound
      page.tsx            ← Outbound queue monitor
/components
  Sidebar.tsx             ← Persistent nav: Dashboard, Sites, Records, Connections, Agents, Settings
  SiteSelector.tsx        ← Dropdown: All Sites | Prime Electrical | AKF Construction | CleanJet
  AuthGuard.tsx           ← Redirect to /login if no session
/lib
  supabase.ts             ← Supabase browser client (createBrowserClient)
  supabase-server.ts      ← Supabase server client (createServerClient)
/middleware.ts            ← Supabase Auth session refresh on all routes
```

### Auth Flow

```
/login → Supabase Auth email+password → session cookie → middleware validates →
→ /dashboard (default site: "all sites")
→ Site selector persisted in localStorage + React context
→ All queries include site_id filter when a specific site is selected
```

### Shared State

`SiteContext` — React context providing:
- `activeSite: { id, name } | null` (null = all sites)
- `setSite(site | null)` — updates context + localStorage
- All data-fetching hooks consume `activeSite.id` to scope queries

### Technology Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js 14 (App Router) | SSR, RSC, file-based routing |
| Auth | `@supabase/ssr` | Native Supabase Auth with cookie session |
| DB client | `@supabase/supabase-js` | Direct table access with RLS |
| UI components | shadcn/ui + Tailwind CSS | Consistent, accessible, fast |
| Charts | Recharts | Lightweight, composable |
| State | React Context + Server Components | Simple; no Redux needed |
| Deployment | Vercel | Same platform as the 3 sites |

### Dependencies on Existing Infrastructure

- Supabase project `tfdxlhkaziskkwwohtwd.supabase.co` (existing)
- All existing tables read via Supabase client (with RLS)
- `mc-analytics` Edge Function for dashboard aggregations
- `mc-connections` Edge Function for credential management
- `mc-send` Edge Function (triggered by scheduler, not frontend)
- Supabase Auth: existing project auth, new users invited as `workers`

---

## Summary — New Assets Required

### New Database Tables
| Table | Purpose |
|-------|---------|
| `connections` | Third-party API integrations per site |
| `workers` | Contractors/admins scoped to a site |
| `records` | Unified business records (quotes, jobs, invoices) |
| `outbound_queue` | Outbound delivery jobs with retry |

### New Edge Functions
| Function | Trigger | Purpose |
|----------|---------|---------|
| `mc-connections` | HTTP (CRUD) | Manage API connections + Vault secrets |
| `mc-analytics` | HTTP (GET) | Aggregate dashboard data |
| `mc-send` | Cron (every 1 min) | Process outbound_queue deliveries |

### New Frontend App
- Next.js 14 App Router, Supabase Auth, shadcn/ui
- 6 primary route groups, shared Sidebar + SiteSelector

### Estimated Build Sequence
1. Schema extensions + RLS policies (Phase 2)
2. `mc-connections`, `mc-analytics`, `mc-send` Edge Functions (Phase 2)
3. Next.js app shell: auth, layout, sidebar, site-selector (Phase 3 → code)
4. Dashboard + analytics screens (Phase 3 → code)
5. Records browser + detail (Phase 3 → code)
6. Connections manager (Phase 3 → code)
7. Agents log + outbound queue monitor (Phase 3 → code)

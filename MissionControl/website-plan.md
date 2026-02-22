# Mission Control — Website Build Plan

> **Status:** Planning complete — ready for frontend code implementation
> **Authored:** 2026-02-22
> **Prerequisite:** `feature-plan.md` (Phase 1) and schema extensions (Phase 2) complete

---

## Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Next.js 14 (App Router) | SSR, React Server Components, file-based routing |
| Language | TypeScript (strict) | |
| Auth | `@supabase/ssr` | Cookie-based sessions, middleware refresh |
| DB client | `@supabase/supabase-js` v2 | Direct table + RPC access with RLS |
| UI components | shadcn/ui + Tailwind CSS | Radix primitives, accessible, consistent |
| Charts | Recharts | Lightweight, composable bar/line charts |
| State | React Context + `use server` Server Components | No Redux; server data flows from RSC |
| Deployment | Vercel | Same platform as the 3 sites |
| Package manager | npm | |

---

## App Directory Structure

```
mission-control/                  ← standalone Next.js project root
├── app/
│   ├── layout.tsx                ← Root layout: AuthGuard + SiteProvider + Sidebar shell
│   ├── page.tsx                  ← Redirect → /dashboard
│   ├── login/
│   │   └── page.tsx              ← Login screen (email + password)
│   ├── dashboard/
│   │   └── page.tsx              ← Cross-site analytics overview
│   ├── sites/
│   │   └── [id]/
│   │       ├── page.tsx          ← Per-site overview (records + analytics)
│   │       └── records/
│   │           └── page.tsx      ← Site-scoped record browser
│   ├── connections/
│   │   ├── page.tsx              ← API Connection Manager list
│   │   ├── new/
│   │   │   └── page.tsx          ← Add new connection
│   │   └── [id]/
│   │       └── page.tsx          ← Connection detail + credential management
│   ├── records/
│   │   ├── page.tsx              ← Unified record browser (all sites)
│   │   ├── new/
│   │   │   └── page.tsx          ← Create record manually
│   │   └── [id]/
│   │       └── page.tsx          ← Record detail + agent action timeline
│   ├── agents/
│   │   └── page.tsx              ← Agent activity log + enable/disable controls
│   └── settings/
│       ├── page.tsx              ← User profile + site membership
│       └── outbound/
│           └── page.tsx          ← Outbound queue monitor
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx           ← Persistent nav (all routes)
│   │   ├── SiteSelector.tsx      ← Dropdown: All Sites | Prime | AKF | CleanJet
│   │   └── TopBar.tsx            ← Site selector + user avatar + sign out
│   ├── auth/
│   │   └── AuthGuard.tsx         ← Server component: redirect to /login if no session
│   ├── dashboard/
│   │   ├── StatCard.tsx          ← Single KPI tile (label + value + trend)
│   │   ├── EventsChart.tsx       ← Recharts bar chart: events per day by site
│   │   ├── SiteHealthTable.tsx   ← Table: site name, last event, status badge
│   │   └── AgentSummaryRow.tsx   ← Single agent row: name, status, success rate
│   ├── records/
│   │   ├── RecordTable.tsx       ← Sortable/filterable table of records
│   │   ├── RecordStatusBadge.tsx ← Coloured badge for record status
│   │   ├── RecordTypeIcon.tsx    ← Icon per record_type
│   │   └── RecordDetail.tsx      ← Full record view with timeline
│   ├── connections/
│   │   ├── ConnectionCard.tsx    ← App card: name, site, status, last sync, actions
│   │   ├── ConnectionForm.tsx    ← Create/edit form with masked API key input
│   │   └── AppPicker.tsx         ← Grid of supported app tiles
│   ├── agents/
│   │   ├── AgentCard.tsx         ← Agent row: name, type, live status, last action
│   │   └── ActionLogTable.tsx    ← Table of agent_actions for one agent
│   └── ui/                       ← shadcn/ui re-exports (Button, Badge, Table, etc.)
├── lib/
│   ├── supabase-browser.ts       ← createBrowserClient() singleton
│   ├── supabase-server.ts        ← createServerClient() for Server Components
│   ├── site-context.tsx          ← SiteContext + useSite hook
│   └── utils.ts                  ← cn(), formatCurrency(), formatDate()
├── hooks/
│   ├── useAnalytics.ts           ← Fetch from mc-analytics Edge Function
│   ├── useRecords.ts             ← Supabase query: records table with filters
│   ├── useConnections.ts         ← Fetch from mc-connections Edge Function
│   └── useAgentActions.ts        ← Supabase query: agent_actions with filters
├── middleware.ts                  ← Supabase session refresh on all routes
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Authentication Flow

```
User visits any protected route
  ↓
middleware.ts → createServerClient() → refreshes session cookie
  ↓
  Session valid?
  ├─ YES → continue to route
  └─ NO  → redirect to /login

/login
  ↓
  User enters email + password
  ↓
  supabase.auth.signInWithPassword()
  ├─ Error → show inline error message
  └─ Success → redirect to /dashboard

/dashboard
  ↓
  SiteProvider reads workers table to determine which sites this user belongs to
  ↓
  SiteSelector populated with user's accessible sites
  ↓
  activeSite persisted in localStorage (key: 'mc_active_site')
  All subsequent data queries scoped to activeSite.id (or null = all sites)

Sign out
  ↓
  supabase.auth.signOut() → clears cookie → redirect to /login
```

---

## Route Specifications

### `/login`

**Purpose:** Authenticate with Supabase Auth

**Components:**
- `LoginForm` — email + password inputs, submit button, error display
- Logo / branding header

**Data:** None fetched; calls `supabase.auth.signInWithPassword()`

**Post-login redirect:** `/dashboard`

---

### `/dashboard`

**Purpose:** Cross-site intelligence overview — the default landing page after login

**Data fetched:**
- `GET /functions/v1/mc-analytics?range=7d` (or scoped by `site_id` if a site is selected)
- `supabase.from('sites').select('id, name, is_active')` — for SiteHealthTable
- `supabase.from('agents').select('id, name, type, is_active')` — for AgentSummaryRow

**Components:**
```
TopBar (SiteSelector + user avatar)
├── StatCard: Total Contacts
├── StatCard: Events (7d)
├── StatCard: Records Created (7d)
├── StatCard: Agent Actions (7d)
├── EventsChart (bar chart: events per day, stacked by site)
├── SiteHealthTable (last event time per site, unprocessed count)
└── AgentSummaryRow × N (each registered agent, success rate badge)
```

**Edge Function:** `mc-analytics` (GET with optional `site_id` + `range`)

**Site selector behaviour:** When a site is selected, all stats are filtered to that site. "All Sites" shows cross-site aggregation.

---

### `/sites/[id]`

**Purpose:** Per-site dashboard — records, analytics, recent contacts

**URL param:** `id` = site UUID from `sites` table

**Data fetched:**
- `supabase.from('sites').select('*').eq('id', id)` — site metadata
- `GET /functions/v1/mc-analytics?site_id=<id>&range=7d`
- `supabase.from('records').select('*').eq('site_id', id).order('created_at', desc).limit(10)`
- `supabase.from('contacts').select('*').eq('source_site', id).order('created_at', desc).limit(10)`

**Components:**
```
SiteBreadcrumb (site name + URL)
├── StatCard × 4 (site-scoped)
├── EventsChart (single-site)
├── RecordTable (last 10 records for this site, link to /records/[id])
└── Recent Contacts list (last 10 contacts from this site)
```

---

### `/sites/[id]/records`

**Purpose:** Site-scoped record browser — same as `/records` but pre-filtered

**See `/records` spec below** — same component, `site_id` pre-set and site-selector locked.

---

### `/records`

**Purpose:** Unified record browser across all accessible sites

**Data fetched:**
- `supabase.from('records').select('id, title, record_type, status, amount, currency, site_id, worker_id, contact_id, created_at').order('created_at', { ascending: false })` — with filters applied client-side via URL params

**Filters (URL params):**
- `site` — UUID, filters to one site
- `type` — `quote | job | invoice | note | booking | task`
- `status` — `open | pending | approved | completed | cancelled`
- `worker` — UUID of worker
- `from` / `to` — date range (ISO strings)
- `q` — text search on `title`

**Components:**
```
FilterBar (site picker, type picker, status picker, date range, search input)
├── RecordTable (columns: title, type, site, worker, status, amount, created date)
│   └── Row actions: View, Edit status, Add note
└── Pagination (50 per page)
```

**Export:** CSV download button — triggers a Supabase query with current filters and generates CSV in the browser.

---

### `/records/new`

**Purpose:** Manually create a business record

**Data fetched:**
- `supabase.from('sites').select('id, name')` — site picker options
- `supabase.from('workers').select('id, full_name, site_id')` — worker picker
- `supabase.from('contacts').select('id, full_name, email')` — contact search (debounced)

**Components:**
```
RecordForm
├── Site selector (required)
├── Record type selector (required)
├── Title input (required)
├── Status selector
├── Worker assignment (optional)
├── Contact link (searchable, optional)
├── Amount + currency (optional, shown for quote/invoice types)
├── Due date picker (optional)
└── Payload: dynamic JSON fields based on record_type
    ├── quote: scope, line_items[]
    ├── job: location, scheduled_date, notes
    ├── invoice: due_date, payment_method
    └── booking: service, datetime, address
```

**Submit:** `supabase.from('records').insert(...)` → redirect to `/records/[id]`

---

### `/records/[id]`

**Purpose:** Full record detail with linked data and agent action timeline

**Data fetched:**
- `supabase.from('records').select('*, sites(name), workers(full_name), contacts(full_name, email, phone)').eq('id', id)`
- `supabase.from('agent_actions').select('*').eq('event_id', record.source_event_id).order('created_at')` — agent timeline
- `supabase.from('events').select('*').eq('id', record.source_event_id)` — source event

**Components:**
```
RecordHeader (title, type badge, status badge, actions: Edit Status, Add to Queue)
├── RecordMetaPanel (site, worker, contact card, amount, dates)
├── PayloadView (formatted JSON rendered as labelled key/value pairs)
├── SourceEventPanel (expandable: raw event payload that created this record)
└── AgentTimeline (chronological list of agent_actions tied to this event)
    └── ActionEntry (agent name, action_type, status badge, confidence, timestamp)
```

**Edit:** Status change via inline select → `supabase.from('records').update({ status })`. No page reload.

**Queue action:** "Send to Site" button → opens a modal to configure an outbound_queue item targeting this site.

---

### `/connections`

**Purpose:** API Connection Manager — view and manage all third-party integrations

**Data fetched:**
- `GET /functions/v1/mc-connections?site_id=<activeSite>` (or all if no site selected)

**Components:**
```
ConnectionsHeader (title + "Add Connection" button → /connections/new)
├── SiteFilterTabs (All | Prime Electrical | AKF | CleanJet)
└── ConnectionCard × N
    ├── App icon + name
    ├── Site badge
    ├── Status: Enabled / Disabled toggle
    ├── Last sync time + status badge (success / error)
    └── Actions: Edit, Test, Delete
```

---

### `/connections/new`

**Purpose:** Add a new third-party API integration

**Data fetched:**
- `supabase.from('sites').select('id, name')` — site picker

**Components:**
```
ConnectionForm (create mode)
├── Site selector (required)
├── AppPicker (grid of supported apps: Zapier, HubSpot, Xero, Slack, custom)
├── API Key input (type="password", masked, labelled "Stored securely in Vault")
├── Optional: Webhook URL, scope config (rendered based on selected app)
└── Submit → POST /functions/v1/mc-connections
```

---

### `/connections/[id]`

**Purpose:** Connection detail — edit config, rotate credentials, view sync history

**Data fetched:**
- `GET /functions/v1/mc-connections/<id>`

**Components:**
```
ConnectionDetail
├── ConnectionHeader (app name, site, status toggle)
├── ConfigEditor (editable JSONB fields for non-secret config)
├── CredentialSection
│   ├── "API key stored in Vault" indicator (no value displayed)
│   └── "Rotate Key" button → opens modal with new key input
├── TestButton → PATCH with test trigger, shows result
└── DangerZone
    └── Delete Connection button (with confirmation dialog)
```

---

### `/agents`

**Purpose:** Agent activity log and live controls

**Data fetched:**
- `supabase.from('agents').select('*').order('name')`
- `supabase.from('agent_actions').select('id, agent_id, action_type, status, confidence, duration_ms, created_at').order('created_at', { ascending: false }).limit(100)`

**Components:**
```
AgentsPage
├── AgentCard × N (for each registered agent)
│   ├── Name, type badge, deployment status
│   ├── Success rate (last 24h): calculated from agent_actions
│   ├── Last action time
│   ├── Enable/Disable toggle → supabase.from('agents').update({ is_active })
│   └── "View Actions" expand → ActionLogTable (last 20 actions for this agent)
└── GlobalActionLog
    └── ActionLogTable (all agents, last 100 actions, filterable by status)
```

---

### `/settings`

**Purpose:** User profile and site membership management

**Data fetched:**
- `supabase.auth.getUser()` — current user
- `supabase.from('workers').select('*, sites(name)').eq('user_id', user.id)` — user's sites + roles

**Components:**
```
SettingsPage
├── ProfileSection (display name, email — read-only, from Supabase Auth)
├── SiteMembership (table: site, role, joined date)
└── ChangePassword button → supabase.auth.updateUser({ password })
```

---

### `/settings/outbound`

**Purpose:** Monitor and manage the outbound delivery queue

**Data fetched:**
- `supabase.from('outbound_queue').select('id, site_id, delivery_type, destination_url, destination_email, status, attempt_count, max_attempts, last_attempted_at, next_attempt_at, error, created_at').order('created_at', { ascending: false }).limit(100)` — with status filter

**Components:**
```
OutboundQueuePage
├── FilterTabs: All | Pending | Delivering | Failed | Delivered
├── QueueTable (columns: destination, type, site, status badge, attempts, last try, next try, error)
│   └── Row actions:
│       ├── Retry Now → PATCH status='pending', next_attempt_at=NOW()
│       └── Cancel → PATCH status='cancelled'
└── FailedItemsAlert (banner if any items in 'failed' state)
```

---

## Shared Components

### `Sidebar.tsx`

Persistent left navigation. Always visible on all authenticated routes.

```
Mission Control logo
─────────────────────
Dashboard          /dashboard
Sites
  ├ Prime Electrical /sites/<id>
  ├ AKF Construction /sites/<id>
  └ CleanJet         /sites/<id>
─────────────────────
Records            /records
Connections        /connections
Agents             /agents
─────────────────────
Settings           /settings
  └ Outbound Queue  /settings/outbound
```

Active state: current route highlighted. Collapsible on mobile (hamburger).

### `SiteSelector.tsx`

Dropdown at the top of every page. Persists selection globally.

```
[Globe icon] All Sites ▾
─────────────────────────
  ● Prime Electrical
  ● AKF Construction
  ● CleanJet
```

- Selection stored in `SiteContext` (React Context)
- Also persisted to `localStorage` key `mc_active_site`
- When a site is selected, all data-fetching hooks and Edge Function calls receive `site_id` as a filter parameter
- "All Sites" passes `site_id: null` to queries

### `SiteContext` (`lib/site-context.tsx`)

```typescript
interface Site { id: string; name: string; url: string }

interface SiteContextValue {
  sites: Site[]          // all sites the user has access to
  activeSite: Site | null  // null = all sites
  setActiveSite: (site: Site | null) => void
}
```

Populated on app mount from `supabase.from('workers').select('site_id, sites(id, name, url)').eq('user_id', user.id)`.

---

## Middleware (`middleware.ts`)

```typescript
// Refreshes Supabase session cookie on every request.
// Redirects unauthenticated users to /login.
// Allows /login through without auth check.

import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // ... createServerClient, refreshSession, check session
  // if (!session && !request.nextUrl.pathname.startsWith('/login'))
  //   return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

---

## Data Fetching Patterns

### Server Components (default — used for initial page data)

```typescript
// app/dashboard/page.tsx (Server Component)
import { createServerClient } from '@/lib/supabase-server'

export default async function DashboardPage() {
  const supabase = createServerClient()
  const { data: sites } = await supabase.from('sites').select('id, name, is_active')
  // Pass to client components as props
}
```

### Client Components (used for interactive, filter-driven queries)

```typescript
// hooks/useRecords.ts
'use client'
import { useSite } from '@/lib/site-context'
import { createBrowserClient } from '@/lib/supabase-browser'

export function useRecords(filters: RecordFilters) {
  const { activeSite } = useSite()
  // useEffect / SWR / React Query to fetch with activeSite.id
}
```

### Edge Function calls (analytics, connections)

```typescript
// hooks/useAnalytics.ts
const res = await fetch(
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/mc-analytics?site_id=${siteId}&range=7d`,
  { headers: { Authorization: `Bearer ${session.access_token}` } }
)
```

---

## Environment Variables (`.env.local`)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tfdxlhkaziskkwwohtwd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
# Service role key is NEVER exposed to the browser
# It is used only in Edge Functions (server-side)
```

---

## Build Phases

### Phase A — Foundation (build first)

1. Init Next.js 14 project: `npx create-next-app@latest mission-control --typescript --tailwind --app`
2. Install: `@supabase/ssr`, `@supabase/supabase-js`, `shadcn-ui`, `recharts`
3. Init shadcn: `npx shadcn@latest init`
4. Add core shadcn components: Button, Badge, Table, Select, Dialog, Input, Tabs, Card, Separator
5. Implement `middleware.ts` (session refresh + auth guard)
6. Implement `lib/supabase-browser.ts` and `lib/supabase-server.ts`
7. Implement `lib/site-context.tsx` (SiteContext + useSite hook)
8. Build `app/login/page.tsx` (LoginForm with Supabase Auth)
9. Build `app/layout.tsx` (AuthGuard + SiteProvider + Sidebar + TopBar shell)
10. Build `Sidebar.tsx` and `SiteSelector.tsx`

### Phase B — Dashboard & Analytics

11. Build `components/dashboard/StatCard.tsx`
12. Build `components/dashboard/EventsChart.tsx` (Recharts BarChart)
13. Build `components/dashboard/SiteHealthTable.tsx`
14. Build `hooks/useAnalytics.ts`
15. Build `app/dashboard/page.tsx`
16. Build `app/sites/[id]/page.tsx`

### Phase C — Records

17. Build `components/records/RecordTable.tsx` (sortable, filterable)
18. Build `components/records/RecordStatusBadge.tsx` and `RecordTypeIcon.tsx`
19. Build `hooks/useRecords.ts`
20. Build `app/records/page.tsx` (FilterBar + RecordTable + Pagination)
21. Build `app/records/[id]/page.tsx` (RecordDetail + AgentTimeline)
22. Build `app/records/new/page.tsx` (RecordForm with dynamic payload fields)

### Phase D — Connections

23. Build `components/connections/ConnectionCard.tsx`
24. Build `components/connections/AppPicker.tsx`
25. Build `components/connections/ConnectionForm.tsx`
26. Build `hooks/useConnections.ts`
27. Build `app/connections/page.tsx`
28. Build `app/connections/new/page.tsx`
29. Build `app/connections/[id]/page.tsx`

### Phase E — Agents & Settings

30. Build `components/agents/AgentCard.tsx` and `ActionLogTable.tsx`
31. Build `app/agents/page.tsx`
32. Build `app/settings/page.tsx`
33. Build `app/settings/outbound/page.tsx` (OutboundQueuePage)

### Phase F — Polish & Deploy

34. Responsive layout (sidebar collapses to hamburger on mobile)
35. Loading skeletons for all data-fetching components
36. Error boundaries for each route
37. Deploy to Vercel: set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
38. Set Supabase Auth redirect URL: `https://<vercel-domain>/auth/callback`

---

## Dependencies Checklist

| Dependency | Required by | Status |
|-----------|-------------|--------|
| `@supabase/ssr` | Auth middleware | Install |
| `@supabase/supabase-js` v2 | DB client | Install |
| `shadcn/ui` + Tailwind | All UI | Install |
| `recharts` | EventsChart | Install |
| Supabase project (existing) | All data | ✅ Ready |
| `mc-analytics` Edge Function | Dashboard | ✅ Scaffolded |
| `mc-connections` Edge Function | Connections | ✅ Scaffolded |
| `mc-send` Edge Function | Outbound queue | ✅ Scaffolded |
| Schema extensions | Records, Workers, Connections, Queue | ✅ Added to schema.sql |
| `RESEND_API_KEY` Supabase secret | mc-send email delivery | Add when configuring email |

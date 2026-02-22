# MISSION CONTROL Command

Mission Control is the central intelligence hub for the business. This command governs **everything** — building new features, connecting data sources, managing AI agents, modifying existing functionality, running the platform, and keeping it healthy.

Use `/mission-control` for any task related to the Mission Control platform. It will scan the project, understand the current state, and figure out what to do.

---

## Mandatory Pre-Execution Protocol (Discovery → Review → Execute)

> **This protocol is a prerequisite wrapper.** It must complete before any action begins. No phase may be skipped or reordered.

### Phase 1: Discovery

Before anything else, scan the project to understand what currently exists.

**Deploy `codebase-scanner-fast` to scan:**
- Root config files: `package.json`, `deno.json`, `supabase/config.toml`, `.env.example`
- Source directories: `src/`, `app/`, `pages/`, `components/`, `lib/`
- Supabase: `supabase/migrations/`, `supabase/functions/`
- Mission Control files: everything inside `MissionControl/`
- Available agents: `agents/` folder
- Any existing integrations, webhooks, or third-party references

**Return a Project Snapshot:**
```
## Project Snapshot

Stack: [framework + language + runtime]
Database: [Supabase project ref | not found]
Sites/Sources connected: [list | none]
Mission Control status: [initialized | template only]
Deployed Edge Functions: [list | none]
Active agents: [list | none]
Open gaps: [anything missing or broken]
```

> Discovery subagents are **read-only**. They must not create, edit, or delete any files.

### Phase 2: Review

Using the Project Snapshot, the Main Agent:

1. **Understands current state** — what is built, what is pending, what is broken
2. **Clarifies the task** — maps the user's request to a task type (see Workflow below)
3. **Checks prerequisites** — flags anything that must exist before the task can run
4. **Writes an execution plan** — a numbered list of exactly what will be done in Phase 3

> **Gate:** Do not proceed to Phase 3 until the execution plan is written and prerequisites are confirmed.

### Phase 3: Execution

> **MANDATORY DELEGATION RULE:** The Main Agent never directly creates, edits, or deletes files. It uses the `Task` tool to spawn subagents for all file work. Orchestrate, delegate, verify — never execute.

**Delegation map — assign work to the right subagent:**

| Work Type | Subagent |
|-----------|---------|
| Scan & understand the codebase | `codebase-scanner-fast` |
| Build or modify TypeScript / backend code | `edge-function-developer-fast` |
| Schema changes, migrations, SQL | `database-migration-specialist-fast` |
| Security review, auth, HMAC | `auth-security-specialist-fast` |
| UI components, frontend features | `ui-ux-engineer-fast` |
| Performance analysis | `performance-optimization-analyst-fast` |
| Monitoring, health checks, alerting | `deployment-monitoring-engineer-fast` |
| Tests and validation | `validation-specialist-fast` |
| Documentation, registry updates | `documentation-manager-fast` |
| General file creation and editing | `file-operations-fast` |

After subagents complete, the Main Agent reads the results and verifies. If anything is wrong, spawn a correction subagent — never fix directly.

---

## Workflow — Task Types

Tell Mission Control what you want to do. It will figure out the rest.

---

### `build` — Build something new

```
/mission-control build [description of what to build]
```

Use this for anything new: a feature, an integration, a UI screen, an API endpoint, a new agent, a new data pipeline, a new tool.

**Examples:**
```
/mission-control build a dashboard showing live agent activity
/mission-control build an ingest pipeline for the Prime Electrical website
/mission-control build an AI agent that qualifies inbound leads from forms
/mission-control build an email reply agent using OpenRouter
/mission-control build a Vapi voice agent for handling inbound calls
/mission-control build a cron job that pulls tickets from the support site every 15 minutes
```

**What happens:**
1. Phase 1 scans the project to understand what already exists related to the request
2. Phase 2 produces a build plan: files to create, dependencies needed, schema changes required
3. Phase 3 delegates to the appropriate subagents to build it
4. After build: updates `MissionControl/architecture.md` and `MissionControl/agent-registry.md` if applicable

---

### `modify` — Change something that exists

```
/mission-control modify [what to change and how]
```

Use this to update, refactor, improve, or fix anything already built.

**Examples:**
```
/mission-control modify the lead qualifier to also score by job title
/mission-control modify the Prime Electrical ingest function to handle a new event type
/mission-control modify the schema to add a priority column to the events table
/mission-control modify the email agent to CC the sales team on high-value leads
/mission-control modify the data monitor threshold from 2 hours to 4 hours
```

**What happens:**
1. Phase 1 locates the relevant files and reads their current state
2. Phase 2 defines exactly what changes, confirms no breaking side effects
3. Phase 3 delegates the edits; validates after

---

### `connect` — Connect a new data source

```
/mission-control connect [site name, URL, or description]
```

Use this to connect any website, CRM, API, email provider, or data source to Mission Control.

**Examples:**
```
/mission-control connect the Prime Electrical website via webhook
/mission-control connect the Shopify store for e-commerce orders
/mission-control connect Resend for inbound email handling
/mission-control connect the support portal with a scheduled pull every 15 minutes
```

**What happens:**
1. Phase 1 reads `MissionControl/architecture.md` and identifies what's already connected
2. Phase 2 determines: webhook push vs. scheduled pull, event types, data shape, HMAC secret needed
3. Phase 3 scaffolds the ingestion Edge Function, registers the site, updates architecture docs
4. Produces the webhook URL to configure on the source site

---

### `schema` — Change the data model

```
/mission-control schema [description of change]
```

Use this for any database change: new tables, new columns, new indexes, new SQL functions.

**Examples:**
```
/mission-control schema add an orders table for e-commerce data
/mission-control schema add a notes column to contacts
/mission-control schema create a pgvector search function for emails
/mission-control schema add a priority field to the events table
```

**What happens:**
1. Phase 1 reads `MissionControl/schema.sql` and checks current applied migrations
2. Phase 2 drafts the new SQL and confirms no conflicts
3. Phase 3 delegates to `database-migration-specialist-fast`: updates `schema.sql`, creates a Supabase migration, runs `supabase db push`

---

### `agent` — Add, modify, or debug an AI agent

```
/mission-control agent add [name and purpose]
/mission-control agent modify [name] [what to change]
/mission-control agent debug [name]
/mission-control agent disable [name]
```

Use this to manage the agent layer — who lives in Mission Control, what they do, and what they can access.

**Examples:**
```
/mission-control agent add a ticket routing agent for support tickets
/mission-control agent add a voice intake agent using Vapi
/mission-control agent modify email_responder to also search the knowledge base
/mission-control agent debug lead_qualifier — it's not scoring new contacts
/mission-control agent disable data_monitor temporarily
```

**What happens:**
1. Phase 1 reads `MissionControl/agent-registry.md` and locates the relevant Edge Function
2. Phase 2 defines or updates: `can_read`, `can_write`, `triggers`, escalation condition, Cursor subagent mapping
3. Phase 3 implements the agent Edge Function, registers it in the `agents` table, updates the registry doc

---

### `monitor` — Check system health

```
/mission-control monitor
/mission-control monitor agents
/mission-control monitor sites
/mission-control monitor [specific thing]
```

Use this to check what's working, what's failing, and what needs attention.

**What it checks:**
- Agent failures in the last 24 hours (`agent_actions` where `status = 'failed'`)
- Unprocessed events older than 1 hour
- Sites that have stopped sending data
- Deployed Edge Functions vs. what's registered in the agent registry
- Environment variables — any missing from Supabase secrets?

---

### `audit` — Review what happened

```
/mission-control audit [agent | contacts | events | all]
```

Use this to understand what agents have done, what data came in, and what was processed.

**Examples:**
```
/mission-control audit email_responder last 7 days
/mission-control audit contacts created this week
/mission-control audit events unprocessed
/mission-control audit all failures today
```

---

### `plan` — Think before building

```
/mission-control plan [what you're thinking about building]
```

Use this when you want Mission Control to assess the current state and recommend what to build next, or think through a complex feature before committing.

**Examples:**
```
/mission-control plan adding a customer loyalty scoring system
/mission-control plan connecting two more websites
/mission-control plan what agents do we still need?
```

**What happens:**
- Phase 1 + Phase 2 only — no execution
- Returns: current state analysis, recommended approach, dependencies, estimated scope, suggested task sequence
- No files are modified

---

### `init` — First-time setup

```
/mission-control init
```

Run this **once** when using Mission Control in a project for the first time. Scans the full codebase, identifies real site names and URLs, replaces all template placeholders in the operating documents with real data, and creates `MissionControl/project-context.md` as a persistent project understanding snapshot.

---

## Operating Documents

These files are the source of truth. Every `/mission-control` session reads them first and updates them after.

| File | Contains | Updated by |
|------|---------|-----------|
| `MissionControl/architecture.md` | Connected sites, data flow, webhook endpoints | `connect`, `build`, `init` |
| `MissionControl/schema.sql` | Unified database schema | `schema`, `build` |
| `MissionControl/agent-registry.md` | All agents, capabilities, triggers, delegation map | `agent`, `build` |
| `MissionControl/project-context.md` | Project snapshot — stack, sites, integrations | `init`, updated after major changes |

---

## Environment Variables

Add these as needed — not all are required from day one:

| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` | Supabase project API URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Full DB access for Edge Functions |
| `OPENROUTER_API_KEY` | LLM for AI agents |
| `RESEND_API_KEY` | Email sending |
| `VAPI_WEBHOOK_SECRET` | Vapi voice webhook HMAC |
| `[SITE]_WEBHOOK_SECRET` | One per connected site (e.g., `PRIME_WEBHOOK_SECRET`) |

---

## After Any Task Completes

```bash
supabase db push                    # apply schema changes
supabase functions deploy [name]    # deploy new or updated functions
```

Then verify:
```sql
SELECT name, type, is_active FROM agents;
SELECT * FROM agent_actions WHERE status = 'failed' ORDER BY created_at DESC LIMIT 20;
SELECT site_id, count(*) FROM events WHERE processed = false GROUP BY site_id;
```

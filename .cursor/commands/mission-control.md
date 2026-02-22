# MISSION CONTROL Command - Central Intelligence Hub

Mission Control is the central intelligence hub for the business's 3 websites. All data, contacts, emails, and events from every site flow here. All AI agents live and operate from here. This command governs how the Mission Control platform is built, extended, and maintained.

**Operating documents:**
- `MissionControl/architecture.md` — site registry and data flow
- `MissionControl/schema.sql` — unified data model (source of truth)
- `MissionControl/agent-registry.md` — agent definitions and delegation map

---

## Mandatory Pre-Execution Protocol (Discovery → Review → Execute)

> **This protocol is a prerequisite wrapper.** It must complete before the standard Workflow (below) begins. It does NOT replace any existing functionality — it gates entry into it.

All command executions — including `/mission-control` — must follow this three-phase sequence. No phase may be skipped or reordered.

### Phase 1: Discovery (Fast Subagents)

Before the Main Agent acts, fast subagents are dispatched to scan and gather context:

> **Recommended subagent types:**
> - `codebase-scanner-fast` — scan existing Mission Control files, schema state, and site connections
> - `database-migration-specialist-fast` — diff current Supabase schema vs. `MissionControl/schema.sql`
> - `deployment-monitoring-engineer-fast` — check active Edge Functions and agent health

1. **Read all 3 operating documents:**
   - `MissionControl/architecture.md` — current site registry and connection status
   - `MissionControl/schema.sql` — target schema
   - `MissionControl/agent-registry.md` — agent definitions and delegation map
2. **Scan `supabase/`** — check applied migrations and deployed Edge Functions
3. **Scan `agents/`** — confirm all agents referenced in the delegation map are present
4. **Identify the task type** from the user's request:
   - `schema` — add or modify the unified data model
   - `agent` — add, modify, or debug an AI agent
   - `connect` — connect a new site or data source
   - `monitor` — check system health and agent activity
   - `audit` — review what agents have done
5. **Return structured summary** — what exists, what's missing, what needs to be done

> **Subagent constraint:** Discovery subagents are **read-only**. They must not create, edit, or delete any files.

### Phase 2: Review (Main Agent)

The Main Agent receives all subagent discovery reports and performs a holistic review:

1. **Schema diff** — compare current applied Supabase schema vs. `MissionControl/schema.sql`. List any unapplied changes.
2. **Agent coverage** — list which agents from `agent-registry.md` are deployed (Edge Function exists) vs. pending.
3. **Site connectivity** — for each of the 3 sites, is the ingestion webhook configured and receiving events?
4. **Execution plan** — list exactly which files will be created, modified, or which commands will be run in Phase 3.
5. **Prerequisite check** — for `agent` tasks: schema must be applied first. For `connect` tasks: site must be in `sites` table first.

> **Review gate:** The Main Agent must NOT proceed to Phase 3 until the task type is confirmed, the execution plan is explicit, and all prerequisites are met.

### Phase 3: Execution (Delegated by Main Agent)

> **MANDATORY DELEGATION RULE:** The Main Agent is **forbidden** from directly performing any file operation (creation, editing, deletion) at any point during Phase 3. It **must** use the `Task` tool to spawn subagents for ALL file modifications. The Main Agent's sole role in Phase 3 is to orchestrate, delegate, and verify — never to execute.

Only after the Review phase passes does the Main Agent proceed as follows:

1. **Delegate via `Task` tool** using the Delegation Map from `MissionControl/agent-registry.md`:

| Task | Subagent |
|------|---------|
| Apply schema migration | `database-migration-specialist-fast` |
| Scaffold ingestion Edge Functions | `edge-function-developer-fast` |
| Implement email agent | `edge-function-developer-fast` |
| Implement data monitor | `deployment-monitoring-engineer-fast` |
| Security review of agent permissions | `auth-security-specialist-fast` |
| Validate schema compliance | `validation-specialist-fast` |
| Update operating documents | `documentation-manager-fast` |
| Codebase scan | `codebase-scanner-fast` |

2. **Subagents execute** — all file creation and editing is performed by subagents.
3. **Main Agent verifies** — after subagents return, read the modified files to confirm correctness.
4. **Follow-up delegation loop** — if verification reveals issues, spawn a new subagent to fix them. The Main Agent does NOT fix directly.

> **Violation:** If the Main Agent uses `StrReplace`, `Write`, `Delete`, or any file-modifying tool directly — it is a protocol violation.

---

## Workflow

### Task: Schema

```
/mission-control schema [description of change]
```

1. Phase 1: Scan current schema state and `MissionControl/schema.sql`
2. Phase 2: Draft the new SQL (new table, column, index, or function) and confirm it doesn't conflict with existing schema
3. Phase 3: Delegate to `database-migration-specialist-fast` to:
   - Add the SQL to `MissionControl/schema.sql`
   - Create a Supabase migration file
   - Run `supabase db push`
4. Update `MissionControl/architecture.md` if a new data type was added

### Task: Agent

```
/mission-control agent add [agent name and purpose]
/mission-control agent debug [agent name]
```

1. Phase 1: Read `MissionControl/agent-registry.md` and scan existing Edge Functions
2. Phase 2: Define the agent's `can_read`, `can_write`, `triggers`, and escalation condition. Map to Cursor subagents from the Delegation Map.
3. Phase 3: Delegate to appropriate subagents (see Delegation Map). Add the agent row to `agent-registry.md` and `schema.sql`.
4. Register the agent in the `agents` table: `supabase db execute "INSERT INTO agents ..."`

### Task: Connect

```
/mission-control connect [site name or URL]
```

1. Phase 1: Read `MissionControl/architecture.md` to understand current connectivity
2. Phase 2: Determine connection method (webhook push vs. scheduled pull). Define the Edge Function name and webhook secret.
3. Phase 3: Delegate to `edge-function-developer-fast` to scaffold the ingestion Edge Function. Update `MissionControl/architecture.md` with the new site entry.
4. Deploy: `supabase functions deploy ingest-[site-slug]`
5. Configure: provide the webhook URL to the site: `https://[PROJECT_REF].supabase.co/functions/v1/ingest-[site-slug]`

### Task: Monitor

```
/mission-control monitor
/mission-control monitor agents
/mission-control monitor sites
```

1. Phase 1: Deploy `deployment-monitoring-engineer-fast` to check:
   - `agent_actions` — failures in last 24 hours
   - `events` — unprocessed events older than 1 hour
   - `sites` — sites with no events in last 2 hours
2. Phase 2: Summarize findings. Flag critical issues.
3. Phase 3: If issues found, spawn appropriate fix subagent. If monitoring only, present report — no Phase 3 needed.

### Task: Audit

```
/mission-control audit [agent name]
/mission-control audit contacts
/mission-control audit events
```

1. Phase 1: Read `agent_actions` for the specified agent or entity
2. Phase 2: Identify patterns — success rate, common action types, escalation frequency
3. Phase 3: Generate audit report via `documentation-manager-fast`. No file modifications unless user requests remediation.

---

## Environment Variables Required

All Mission Control infrastructure requires these variables:

| Variable | Purpose | Required |
|----------|---------|---------|
| `SUPABASE_URL` | Supabase project API URL | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Full DB access for Edge Functions | Yes |
| `OPENROUTER_API_KEY` | LLM calls from agents | Yes |
| `RESEND_API_KEY` or `POSTMARK_API_KEY` | Email agent outbound | Yes (email agent) |
| `SITE1_WEBHOOK_SECRET` | HMAC verification for Site 1 | Yes (Site 1) |
| `SITE2_WEBHOOK_SECRET` | HMAC verification for Site 2 | Yes (Site 2) |
| `SITE3_WEBHOOK_SECRET` | HMAC verification for Site 3 | Yes (Site 3) |
| `VAPI_WEBHOOK_SECRET` | HMAC for Vapi voice webhook | Yes (voice agent) |

---

## Usage

```
/mission-control schema add orders table for Site 2 e-commerce data
/mission-control agent add voice intake agent using Vapi
/mission-control connect Site 1 via webhook on form submit
/mission-control monitor
/mission-control audit email_responder
/mission-control audit events unprocessed
```

## Next Steps

After `/mission-control` completes any task:
- Run `supabase db push` to apply any pending schema changes
- Run `supabase functions deploy` to deploy new or updated Edge Functions
- Verify agent registration: `SELECT name, type, is_active FROM agents;`
- Check for failures: `SELECT * FROM agent_actions WHERE status = 'failed' ORDER BY created_at DESC LIMIT 20;`
- Update operating documents if architecture or agent registry changed

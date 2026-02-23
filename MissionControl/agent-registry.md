# Mission Control — Agent Registry

> **Shared contract:** All agents read from and write to the schema defined in `MissionControl/schema.sql`.
> All agents declare `can_read[]`, `can_write[]`, and `triggers[]` explicitly — no implicit access.
> Every action is logged to `agent_actions`. Every agent has an escalation condition.
> **Initialized:** 2026-02-22 · 1 of 4 agents live · Schema pending migration

---

## Agent 1: Email Responder

| Property | Value |
|----------|-------|
| **Name** | `email_responder` |
| **Type** | `email` |
| **Purpose** | Reads inbound emails, retrieves contact history and agent memory, drafts and sends contextually appropriate replies |
| **Trigger events** | `email_received` |
| **can_read** | `contacts`, `emails`, `agent_memory`, `events` |
| **can_write** | `emails` (outbound), `agent_actions`, `agent_memory` |
| **Escalation** | Confidence < 0.7 OR topic is complaint / legal / refund request → flag for human review, do NOT send |
| **Timeout** | 10 seconds to draft; send within 30 seconds |
| **Cursor agents** | `edge-function-developer-fast` (Deno Edge Function), `documentation-manager-fast` (email content generation) |
| **Deployment Status** | ❌ Pending — Edge Function not yet created |

**Trigger flow:**
```
email_received event → fetch contact by from_address → load agent_memory →
retrieve last 5 emails in thread → generate reply (LLM) → confidence check →
IF confidence >= 0.7: send via email provider, log to agent_actions
IF confidence < 0.7: log escalation to agent_actions, notify human
```

**SQL registration:** Already inserted in schema.sql initial data.

---

## Agent 2: Lead Qualifier

| Property | Value |
|----------|-------|
| **Name** | `lead_qualifier` |
| **Type** | `qualifier` |
| **Purpose** | Scores new contacts (0–100) and applies qualification tags based on profile completeness and event history |
| **Trigger events** | `form_submit`, `contact_created`, `order_placed` |
| **can_read** | `contacts`, `events`, `agent_memory` |
| **can_write** | `contacts` (update `lead_score`, `tags`), `agent_actions` |
| **Escalation** | Score > 80 → immediately notify sales team. Insufficient data to score → log and skip |
| **Timeout** | 5 seconds |
| **Cursor agents** | `codebase-scanner-fast` (data analysis), `database-migration-specialist-fast` (schema queries) |
| **Deployment Status** | ✅ Live — `supabase/functions/lead-qualifier/index.ts` deployed. Triggered on every `form_submit` via `_shared/ingest.ts` (fire-and-forget). |

**Scoring weights:**
| Factor | Weight |
|--------|--------|
| Company name present | +20 |
| Phone number present | +10 |
| Job title present | +15 |
| Event count > 3 | +30 |
| Order placed | +25 |

**SQL registration:** Already inserted in schema.sql initial data.

---

## Agent 3: Data Monitor

| Property | Value |
|----------|-------|
| **Name** | `data_monitor` |
| **Type** | `monitor` |
| **Purpose** | Watches for anomalies — site silence, event volume spikes, agent failure rates |
| **Trigger events** | `scheduled:15min` (cron) |
| **can_read** | `sites`, `events`, `contacts`, `agent_actions` |
| **can_write** | `agent_actions` (log alert) |
| **Escalation** | ALWAYS alerts human on anomaly — this agent never self-resolves |
| **Timeout** | 30 seconds per check cycle |
| **Cursor agents** | `deployment-monitoring-engineer-fast` |
| **Deployment Status** | ✅ Live — `supabase/functions/data-monitor/index.ts` deployed. Schedule: Supabase Dashboard → Functions → data-monitor → `*/15 * * * *`. |

**Checks performed each cycle:**
1. For each active site: has any event been received in the last 2 hours? If not → alert
2. Is the event volume for any site > 3× its 7-day average? → alert
3. Are there > 5 `agent_actions` with `status = 'failed'` in the last 15 minutes? → alert

**SQL registration:** Already inserted in schema.sql initial data.

---

## Agent 4: Voice Intake

| Property | Value |
|----------|-------|
| **Name** | `voice_intake` |
| **Type** | `voice` |
| **Purpose** | Handles inbound Vapi.ai voice calls, looks up callers by phone number, routes to appropriate workflow |
| **Trigger events** | `call_initiated` (via Vapi webhook → `vapi-webhook` Edge Function) |
| **can_read** | `contacts`, `emails`, `agent_memory`, `events` |
| **can_write** | `events`, `agent_actions`, `agent_memory` |
| **Escalation** | Caller explicitly requests human OR agent confidence < 0.6 → transfer to human |
| **Timeout** | Real-time (no fixed timeout — active during call duration) |
| **Cursor agents** | `edge-function-developer-fast` (Vapi webhook handler) |
| **Deployment Status** | ⚠️ Partially live — Prime (Max, +6498734191) ✅ · AKF (Alex) ⚠️ no phone · CleanJet (Jess) ⚠️ no phone |
| **See also** | `Vapi/vapi.md` for full Vapi engineering standards |

**SQL registration:** Already inserted in schema.sql initial data.

---

## Agent 5: Telegram Bot

| Property | Value |
|----------|-------|
| **Name** | `telegram_bot` |
| **Type** | `custom` |
| **Purpose** | Routes inbound Telegram messages to appropriate Mission Control agents and delivers responses; handles freeform LLM chat with conversation history |
| **Trigger events** | `telegram_message` (inbound Telegram message via webhook) |
| **can_read** | `telegram_sessions`, `telegram_messages`, `contacts`, `agent_memory` |
| **can_write** | `telegram_sessions`, `telegram_messages`, `outbound_queue` |
| **Escalation** | Rate limit: 10 messages/60s per chat. Admin-only commands rejected for non-admin users. |
| **Timeout** | 30 seconds (LLM path); < 2 seconds (command path) |
| **Cursor agents** | `edge-function-developer-fast` (Deno Edge Function) |
| **Deployment Status** | ✅ Live — `supabase/functions/telegram-webhook/index.ts` deployed. Webhook registered at Telegram. Phase 6 complete. |

**Command routing:**
```
telegram_message → auth check → rate limit check →
  /start → session + email linking
  /status → data-monitor report (admin only)
  /leads → recent high-score contacts with inline keyboard (admin only)
  /help → command list
  [freeform] → sendTyping → OpenRouter LLM (gpt-4o-mini) → response
  [callback_query] → qualify/call action handler
```

**SQL registration:** Uses `telegram_sessions` and `telegram_messages` tables (migration `20260223002_telegram_tables.sql`).

---

## Agent Trigger Map

| Event Type | Agent(s) Triggered | Mode |
|-----------|-------------------|------|
| `email_received` | Email Responder | Auto |
| `form_submit` | Lead Qualifier | Auto |
| `contact_created` | Lead Qualifier | Auto |
| `order_placed` | Lead Qualifier | Auto |
| `call_initiated` | Voice Intake | Auto (Vapi) |
| `scheduled:15min` | Data Monitor | Auto (cron) |
| `telegram_message` | Telegram Bot | Auto (Telegram webhook) |
| `ticket_created` | [Future agent] | To be assigned |
| `page_view` | [Future agent] | To be assigned |

---

## Delegation Map (for `/mission-control` Phase 3 execution)

| Task | Cursor Subagent | Justification |
|------|----------------|---------------|
| Apply schema migration | `database-migration-specialist-fast` | Schema changes, indexes, functions |
| Scaffold ingestion Edge Functions | `edge-function-developer-fast` | Deno Edge Function scaffolding |
| Implement email agent | `edge-function-developer-fast` + `documentation-manager-fast` | Function + content generation |
| Implement lead qualifier | `database-migration-specialist-fast` | Complex SQL scoring queries |
| Implement data monitor | `deployment-monitoring-engineer-fast` | Monitoring and alerting patterns |
| Implement voice intake | `edge-function-developer-fast` | Vapi webhook handler |
| Security review of agent permissions | `auth-security-specialist-fast` | Least-privilege audit |
| Validate schema compliance | `validation-specialist-fast` | Post-creation verification |
| Update architecture docs | `documentation-manager-fast` | Keeps operating docs current |
| Codebase scan & context gathering | `codebase-scanner-fast` | Phase 1 discovery in each session |

---

## Adding a New Agent

When a new agent is needed:

1. Add a row to this registry document with all properties filled in
2. Add the `INSERT INTO agents (...)` statement to `schema.sql` (or run it directly)
3. Run `/mission-control agent add [name]` to scaffold the implementation
4. The `/mission-control` command will use the Delegation Map to assign the right subagent

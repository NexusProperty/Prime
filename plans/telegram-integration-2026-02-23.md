# Telegram Integration Plan — Mission Control & AI Agents

**Date:** 2026-02-23 | **Status:** Ready for Implementation | **Author:** /telegram command

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Prerequisites](#3-prerequisites)
4. [Database Schema Changes](#4-database-schema-changes)
5. [Implementation Phases](#5-implementation-phases)
6. [File & Folder Structure](#6-file--folder-structure)
7. [Environment Variables](#7-environment-variables)
8. [Testing Checklist](#8-testing-checklist)
9. [Risks & Mitigations](#9-risks--mitigations)
10. [Next Steps](#10-next-steps)

---

## 1. Executive Summary

This integration adds a Telegram bot that receives messages from users and routes them to Mission Control AI agents (lead_qualifier, data_monitor, email_responder, voice_intake). The bot acts as a conversational interface: users send commands or freeform questions, and agents respond via Telegram. The integration also enables push notifications from data_monitor anomaly alerts directly to an admin's Telegram chat, so critical alerts reach operators in real time without requiring them to check the dashboard.

---

## 2. Architecture Overview

```
Telegram User
     │
     ▼
[Telegram Bot API]
     │ POST /webhook
     ▼
[telegram-webhook] ─── Supabase Edge Function (Deno)
     │
     ├── Verify HMAC signature
     ├── Parse update (message, command, callback_query)
     ├── Look up session (telegram_sessions table)
     │   └── If new user → run Auth Bridge flow
     │
     ▼
[Message Router]
     │
     ├── /start      → Auth Bridge (link chat_id to contact)
     ├── /status     → data_monitor (on-demand report)
     ├── /leads      → lead_qualifier (recent leads summary)
     ├── /help       → list available commands
     └── freeform    → general assistant (OpenRouter LLM)
          │
          ▼
     [Agent Dispatcher]
          │
          ├── lead-qualifier Edge Function (HTTP POST)
          ├── data-monitor Edge Function (HTTP POST or direct DB query)
          └── OpenRouter API (freeform chat)
               │
               ▼
          [Response Formatter]
               │ Telegram MarkdownV2
               ▼
          [Telegram Bot API sendMessage]
               │
               ▼
          Telegram User ← reply delivered

Push notification flow:
[data-monitor] → detects anomaly → writes to outbound_queue → 
[mc-send] → delivery_type: 'telegram' → [Telegram Bot API sendMessage] → Admin chat
```

| Component | Location | Responsibility |
|-----------|----------|----------------|
| telegram-webhook | `supabase/functions/telegram-webhook/index.ts` | Receives POST from Telegram, verifies HMAC, parses update, looks up session |
| Message Router | Inside telegram-webhook | Routes by command (/start, /status, /leads, /help) or freeform text |
| Agent Dispatcher | Inside telegram-webhook | Calls lead-qualifier, data-monitor Edge Functions or OpenRouter API |
| Response Formatter | Inside telegram-webhook | Converts agent JSON to Telegram MarkdownV2 text |
| telegram_sessions | PostgreSQL table | Maps chat_id → contact_id, stores conversation context |
| telegram_messages | PostgreSQL table | Immutable log of inbound/outbound messages |
| Auth Bridge | Inside telegram-webhook | /start flow: prompt for email → link chat_id to contact |
| mc-send | `supabase/functions/mc-send/index.ts` | Handles delivery_type 'telegram' for push notifications |

---

## 3. Prerequisites

Before implementation begins, ensure the following are in place:

1. **Create Telegram bot via @BotFather** — Run `/newbot` in Telegram, follow prompts, store the returned token as `TELEGRAM_BOT_TOKEN`.
2. **Register webhook URL with Telegram API** — After deploying the Edge Function, run:
   ```bash
   POST https://api.telegram.org/bot{TOKEN}/setWebhook
   ```
   Webhook URL: `https://[PROJECT_REF].supabase.co/functions/v1/telegram-webhook`
3. **Supabase Edge Functions enabled** — Already true for this project.
4. **Generate `TELEGRAM_WEBHOOK_SECRET`** — Use `openssl rand -hex 32` to produce a random 32-byte hex string.
5. **Add secrets to Supabase Vault** — `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, and optionally `TELEGRAM_ADMIN_CHAT_ID`.
6. **Identify admin Telegram `chat_id`** — Message @userinfobot or @RawDataBot with the owner's account to obtain the `id` field for push notifications.

---

## 4. Database Schema Changes

Apply the following SQL migration:

```sql
-- Table: telegram_sessions
-- Maps Telegram chat_id to Mission Control contact + stores conversation context
CREATE TABLE IF NOT EXISTS telegram_sessions (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id         BIGINT UNIQUE NOT NULL,         -- Telegram chat identifier
  contact_id      UUID REFERENCES contacts(id),   -- Linked MC contact (NULL until /start completed)
  username        TEXT,                           -- Telegram username (@handle)
  first_name      TEXT,
  is_admin        BOOLEAN DEFAULT FALSE,          -- True for owner/operator users
  context         JSONB DEFAULT '{}',             -- Conversation state (last_agent, pending_action)
  last_active_at  TIMESTAMPTZ DEFAULT now(),
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_telegram_sessions_chat_id ON telegram_sessions(chat_id);
CREATE INDEX idx_telegram_sessions_contact_id ON telegram_sessions(contact_id);

-- Table: telegram_messages
-- Immutable log of all inbound and outbound Telegram messages
CREATE TABLE IF NOT EXISTS telegram_messages (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id         BIGINT NOT NULL,
  direction       TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  message_text    TEXT,
  agent_used      TEXT,                           -- Which agent handled this message
  agent_response  JSONB,                          -- Raw agent response payload
  delivered       BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_telegram_messages_chat_id ON telegram_messages(chat_id);
CREATE INDEX idx_telegram_messages_created_at ON telegram_messages(created_at);

-- Extend outbound_queue for Telegram push notifications
-- Add 'telegram' as valid delivery_type:
ALTER TABLE outbound_queue ADD COLUMN IF NOT EXISTS telegram_chat_id BIGINT;
-- (delivery_type column already exists; 'telegram' becomes a valid value)
```

**Note:** The `mc-send` Edge Function must be updated to handle `delivery_type: 'telegram'` and use the `telegram_chat_id` column when sending push notifications.

---

## 5. Implementation Phases

### Phase 1 — Foundation (Est. 2–3 hrs)

**Goal:** Working webhook handler that echoes messages back.

**Files to create:**
- `supabase/functions/telegram-webhook/index.ts` — Main webhook handler
- `supabase/functions/_shared/telegram.ts` — Telegram Bot API helper (sendMessage, sendMarkdown)

**Steps:**
1. Create `telegram-webhook` Edge Function with HMAC verification (pattern: `vapi-webhook/index.ts`)
2. Create `_shared/telegram.ts` with `sendMessage(chatId, text, parseMode?)` helper
3. Register webhook URL with Telegram API (curl command provided in prerequisites)
4. Deploy and test: send a message → bot echoes it back
5. Add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_WEBHOOK_SECRET` to Supabase Vault

**Success criteria:** Bot responds to any message with an echo within 2 seconds.

---

### Phase 2 — Session Management & Auth Bridge (Est. 2–3 hrs)

**Goal:** `/start` command links Telegram user to Mission Control contact.

**Files to create/update:**
- `supabase/migrations/YYYYMMDD_telegram_tables.sql` — New tables (Section 4 SQL)
- `supabase/functions/telegram-webhook/index.ts` — Add session lookup + /start handler

**Steps:**
1. Apply DB migration (telegram_sessions, telegram_messages tables)
2. Implement session lookup: on each message, `SELECT * FROM telegram_sessions WHERE chat_id = $1`
3. Implement `/start` flow: prompt for email → look up contact → link chat_id → confirm
4. Log all messages to `telegram_messages` table

**Success criteria:** New user completes /start, chat_id linked to contact_id in DB.

---

### Phase 3 — Agent Routing: Data Monitor (Est. 2–3 hrs)

**Goal:** `/status` command triggers on-demand data_monitor report.

**Files to update:**
- `supabase/functions/telegram-webhook/index.ts` — Add /status command handler

**Steps:**
1. Implement `/status` handler: POST to `data-monitor` Edge Function URL
2. Parse data-monitor JSON response (alerts array + summary)
3. Format response as Telegram MarkdownV2 (bold headers, emoji for alert types)
4. Send formatted report back to user
5. Push notifications: update `mc-send` to support `delivery_type: 'telegram'` + `telegram_chat_id`
6. Update `data-monitor` to write Telegram alerts to `outbound_queue` when admin chat_id configured

**Success criteria:** /status returns formatted alert report; anomaly alerts arrive as push notifications.

---

### Phase 4 — Agent Routing: Lead Qualifier (Est. 2–3 hrs)

**Goal:** `/leads` command returns recent lead activity.

**Files to update:**
- `supabase/functions/telegram-webhook/index.ts` — Add /leads command handler

**Steps:**
1. Implement `/leads` handler: query `contacts` table for recent high-score leads (last 24h, score > 60)
2. Format as Telegram list with contact name, score, tags, source site
3. Add `/lead [contact_id]` for detailed single contact view
4. Add inline keyboard buttons for quick actions (e.g., "Mark Qualified", "Request Call")

**Success criteria:** /leads returns last 24h leads; inline buttons work.

---

### Phase 5 — Freeform Chat (General Assistant) (Est. 3–4 hrs)

**Goal:** Any non-command message routes to LLM with MC context.

**Files to update:**
- `supabase/functions/telegram-webhook/index.ts` — Add freeform handler

**Steps:**
1. Implement freeform handler: send message + session context to OpenRouter API
2. System prompt: "You are an AI assistant for the Mission Control dashboard of United Trades (Prime Electrical, AKF Construction, CleanJet). You have access to [context injected from agent_memory]."
3. Inject recent agent_memory for the linked contact (if any)
4. Store conversation turns in `telegram_sessions.context` JSONB
5. Add typing indicator: call `sendChatAction(chatId, 'typing')` before LLM call

**Success criteria:** Freeform questions answered with MC context within 5 seconds.

---

### Phase 6 — Polish & Production Hardening (Est. 2–3 hrs)

**Steps:**
1. Rate limiting: max 10 messages/minute per chat_id (check in Edge Function before processing)
2. Error handling: all agent failures return user-friendly error message + log to `agent_actions`
3. Admin-only commands: `/status`, `/leads` require `is_admin = TRUE` in telegram_sessions
4. Logging: all requests logged with duration_ms to `agent_actions`
5. Monitoring: add Supabase alert if `telegram-webhook` error rate > 5% in 15 minutes

**Success criteria:** No unhandled errors; admin commands blocked for non-admin users.

---

## 6. File & Folder Structure

```
supabase/
├── functions/
│   ├── telegram-webhook/           ← NEW
│   │   └── index.ts               ← Main handler (HMAC verify → parse → route → respond)
│   ├── _shared/
│   │   └── telegram.ts            ← NEW: Telegram Bot API helper functions
│   └── mc-send/
│       └── index.ts               ← MODIFIED: add delivery_type 'telegram' support
└── migrations/
    └── YYYYMMDD_telegram_tables.sql  ← NEW: telegram_sessions + telegram_messages + outbound_queue alter

MissionControl/
├── agent-registry.md              ← MODIFIED: add telegram_bot agent entry
└── architecture.md                ← MODIFIED: update integration diagram

plans/
└── telegram-integration-2026-02-23.md  ← THIS FILE
```

---

## 7. Environment Variables

| Variable | Description | Where Set |
|----------|-------------|-----------|
| `TELEGRAM_BOT_TOKEN` | Bot API token from @BotFather (format: `123456:ABC-DEF...`) | Supabase Vault |
| `TELEGRAM_WEBHOOK_SECRET` | 32-byte random hex for HMAC verification of incoming webhooks | Supabase Vault |
| `TELEGRAM_ADMIN_CHAT_ID` | Chat ID of the admin/owner for push notifications | Supabase Vault |
| `SUPABASE_URL` | Already set — Supabase project URL | Supabase Edge Function env |
| `SUPABASE_SERVICE_ROLE_KEY` | Already set — bypasses RLS for Edge Function DB access | Supabase Vault |
| `OPENROUTER_API_KEY` | Already set — for freeform LLM responses (Phase 5) | Supabase Vault |
| `OPENROUTER_MODEL` | Already set — LLM model for freeform chat | Supabase Vault |

**Webhook registration command:**

```bash
# Register webhook with Telegram after deploying Edge Function
curl -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://[PROJECT_REF].supabase.co/functions/v1/telegram-webhook",
    "secret_token": "'${TELEGRAM_WEBHOOK_SECRET}'"
  }'
```

---

## 8. Testing Checklist

### Phase 1
- [ ] `curl -X POST [webhook-url] -H "X-Telegram-Bot-Api-Secret-Token: [secret]" -d '{"message":{"chat":{"id":123},"text":"hello"}}'` → bot replies "hello"
- [ ] Invalid secret token → 401 response
- [ ] Valid update with no message field → 200 response, no error

### Phase 2
- [ ] `/start` → bot prompts for email
- [ ] Enter valid email → bot confirms "Linked to [contact name]"
- [ ] Enter unknown email → bot responds "No contact found"
- [ ] `telegram_sessions` row created with correct chat_id and contact_id
- [ ] `telegram_messages` row created for each message

### Phase 3
- [ ] `/status` → returns formatted report with active site statuses
- [ ] Trigger anomaly manually (insert old event) → push notification arrives within 15 minutes
- [ ] Non-admin user runs `/status` → "Access denied" response

### Phase 4
- [ ] `/leads` → returns leads from last 24 hours (or "No new leads" if none)
- [ ] Inline "Mark Qualified" button → updates contact tags in DB
- [ ] `/lead [invalid-id]` → "Contact not found" response

### Phase 5
- [ ] Freeform question → LLM responds with MC context within 5 seconds
- [ ] Typing indicator appears before response
- [ ] Conversation context preserved across 3 turns

### Phase 6
- [ ] Send 11 messages in 60 seconds → 11th message returns rate limit response
- [ ] Cause agent error → user receives "Something went wrong" message, error logged to agent_actions
- [ ] Admin command from non-admin → "Access denied"

---

## 9. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Telegram webhook URL not public (localhost dev) | High | Blocks Phase 1 | Use Supabase Edge Function URL directly (always public) |
| HMAC verification failure (wrong secret) | Medium | All messages rejected | Test with curl before enabling strict mode; log raw headers |
| Agent response too long for Telegram (4096 char limit) | Medium | Message send fails | Truncate at 4000 chars + "...truncated" suffix |
| Rate limiting by Telegram Bot API (30 msg/sec) | Low | Push notification drops | Queue notifications via outbound_queue + mc-send, not direct API calls |
| chat_id → contact_id mapping fails | Medium | Agents lack contact context | Graceful degradation: run agent without contact context, note "not linked" |
| LLM hallucination in freeform mode (Phase 5) | Medium | Incorrect info given to user | System prompt emphasizes "only answer from provided context"; add disclaimer |
| Supabase Edge Function cold start latency (400–800ms) | Low | Slow first response | Use `X-Telegram-Bot-Api-Secret-Token` early reject to avoid cold start waste |

---

## 10. Next Steps

Ordered action items:

1. **Create Telegram Bot** (Owner, 5 min) — Message @BotFather → `/newbot` → store token in Supabase Vault as `TELEGRAM_BOT_TOKEN`
2. **Generate webhook secret** (Owner, 2 min) — `openssl rand -hex 32` → store in Supabase Vault as `TELEGRAM_WEBHOOK_SECRET`
3. **Identify admin chat_id** (Owner, 5 min) — Message @userinfobot or @RawDataBot with your Telegram account → note the `id` field → store as `TELEGRAM_ADMIN_CHAT_ID`
4. **Run Phase 1 build** (Dev, 2–3 hrs) — `/build` targeting Phase 1 (webhook handler + echo test)
5. **Deploy & register webhook** (Dev, 15 min) — Deploy Edge Function → run curl registration command → test with real message
6. **Run Phase 2 build** (Dev, 2–3 hrs) — DB migration + /start auth bridge
7. **Run Phase 3 build** (Dev, 2–3 hrs) — /status command + push notifications via mc-send
8. **Run Phases 4–6** (Dev, 7–10 hrs) — /leads, freeform chat, production hardening
9. **QA each phase** before proceeding — use Testing Checklist (Section 8)
10. **Update agent-registry.md** — add `telegram_bot` as a new agent entry after Phase 5 complete

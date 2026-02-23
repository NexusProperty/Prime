# TELEGRAM Command - Mission Control & AI Agent Telegram Integration Planner

This command scans the project codebase to understand the current Mission Control and AI agent architecture, then produces a complete, actionable implementation plan for connecting both systems to a Telegram bot — enabling users to converse with AI agents directly through Telegram.

---

## Mandatory Pre-Execution Protocol (Discovery → Review → Execute)

> **This protocol is a prerequisite wrapper.** It must complete before the standard Workflow (below) begins. No phase may be skipped or reordered.

### Phase 1: Discovery (Fast Subagents)

Before the Main Agent acts, fast subagents are dispatched to scan and gather context:

> **Recommended subagent types:**
> - `promptai-scanner-fast` — primary scanner for project structure, Mission Control files, agent definitions, and existing integrations
> - `explore` with `model: fast` — for broad directory traversal and supplemental file discovery

Subagents must scan the following locations and return structured summaries:

1. **Mission Control** — scan `MissionControl/` or equivalent directory:
   - What is the current architecture? (API routes, webhooks, event handlers)
   - How does Mission Control receive and dispatch instructions?
   - Are there existing outbound notification hooks (email, SMS, webhooks)?
   - What authentication/session model is used?

2. **AI Agents** — scan `agents/` and any agent definition files:
   - What agents exist? List all agent names, their triggers, and their input/output interfaces
   - How are agents currently invoked? (API call, queue message, direct function call)
   - Do agents return structured responses or freeform text?
   - Are there any existing conversational agents?

3. **Integrations & APIs** — scan for existing integration patterns:
   - Check for `.env`, `config/`, or `supabase/` directories for API key patterns, webhook URLs, edge function definitions
   - Are there any existing bot/channel integrations (Slack, Discord, email)?
   - Is there a Supabase Edge Functions directory? If so, list all existing functions.

4. **Database Schema** — scan for schema files:
   - Check `supabase/migrations/` or equivalent
   - What tables exist that are relevant to user sessions, conversations, or agent runs?
   - Is there a conversations/messages table already?

5. **Return a Discovery Summary:**
   ```
   ## Telegram Integration Discovery Summary
   Mission Control: [architecture type | API routes found | webhook hooks found]
   AI Agents: [count | names | invocation method | response format]
   Existing integrations: [list or "none"]
   Supabase Edge Functions: [list or "none found"]
   Relevant DB tables: [list or "not found"]
   Gaps: [what is missing that the plan must address]
   ```

> **Subagent constraint:** Discovery subagents are **read-only**. They must not create, edit, or delete any files.

### Phase 2: Review (Main Agent)

The Main Agent receives the Discovery Summary and performs a holistic review:

1. **Architecture gap analysis** — Given what exists, what must be built to connect Mission Control + AI agents to Telegram?
2. **Integration path selection** — Determine the most appropriate Telegram integration pattern based on the stack:
   - Supabase Edge Function as Telegram webhook handler (preferred for serverless stacks)
   - Dedicated Node.js/Python bot service
   - Polling vs. webhook mode
3. **Scope confirmation** — Confirm which AI agents are in scope for the first Telegram integration
4. **Risk identification** — Flag any architectural blockers, missing credentials, or schema gaps
5. **Execution plan** — Outline exactly what will be produced in Phase 3 (the plan document sections)

> **Gate:** Do not proceed to Phase 3 until the architecture gap analysis and integration path are confirmed.

### Phase 3: Execution (Delegated by Main Agent)

> **MANDATORY DELEGATION RULE:** The Main Agent never directly writes or edits files. It uses the `Task` tool to spawn subagents for all file operations.

The Main Agent delegates production of the implementation plan document to a subagent:

**Recommended subagent types:**
- `promptai-creator-fast` — writes the output plan document
- `explore` with `model: fast` — any supplemental scanning needed during plan drafting

The spawned subagent must produce a plan document saved to:
`plans/telegram-integration-[YYYY-MM-DD].md`

---

## Workflow

### Step 1 — Codebase Scan
Deploy fast subagents to scan Mission Control, agent definitions, integrations, Supabase schema, and existing API patterns (see Phase 1 above). Return a structured Discovery Summary.

### Step 2 — Integration Analysis
The Main Agent reviews the Discovery Summary and identifies:
- **Entry point:** Where Telegram messages will be received (webhook endpoint)
- **Routing layer:** How incoming messages are routed to the correct AI agent
- **Agent invocation:** How the selected agent is called and how its response is captured
- **Response delivery:** How the agent's reply is sent back to the Telegram user
- **Session management:** How multi-turn conversations are tracked (user ↔ session ↔ agent)
- **Authentication:** Whether Telegram user identity needs to map to an internal user account

### Step 3 — Telegram Bot Architecture Design
Design the complete bot architecture based on the analysis:

**Core components to design:**
- `Telegram Webhook Handler` — receives POST requests from Telegram's Bot API
- `Message Router` — parses incoming message, identifies intent/agent target
- `Agent Dispatcher` — calls the appropriate AI agent with the user's message
- `Response Formatter` — formats the agent's response for Telegram (text, markdown, buttons)
- `Session Store` — persists conversation context between turns (Supabase table or in-memory)
- `Auth Bridge` (optional) — maps Telegram `chat_id` to internal user identity

**Integration diagram (ASCII):**
```
Telegram User
     │
     ▼
[Telegram Bot API]
     │ POST /webhook
     ▼
[Webhook Handler] ─── Supabase Edge Function or Bot Service
     │
     ├── Parse message
     ├── Look up session (Supabase: conversations table)
     │
     ▼
[Message Router]
     │
     ├── Route to Agent A (e.g. general assistant)
     ├── Route to Agent B (e.g. mission control agent)
     └── Route to Agent N
          │
          ▼
     [AI Agent]
          │
          ▼
     [Response Formatter]
          │
          ▼
     [Telegram Bot API sendMessage]
          │
          ▼
     Telegram User ← reply delivered
```

### Step 4 — Implementation Plan Document
Delegate to `promptai-creator-fast` to write the full plan to `plans/telegram-integration-[date].md`.

The plan document must include these sections:

1. **Executive Summary** — What this integration does and why, in 3–5 sentences
2. **Architecture Overview** — The integration diagram and component descriptions
3. **Prerequisites** — What must be in place before implementation begins:
   - Telegram Bot created via @BotFather (and `TELEGRAM_BOT_TOKEN` secured)
   - Webhook URL registered with Telegram API
   - Supabase project with Edge Functions enabled (or alternative runtime)
   - AI agent(s) accessible via a callable interface
4. **Database Schema Changes** — Any new tables or columns required:
   - `telegram_sessions` table (chat_id, user_id, agent_id, context JSON, last_active)
   - `telegram_messages` table (id, chat_id, direction, content, agent_response, created_at)
5. **Implementation Phases** — Phased delivery plan:
   - **Phase 1 (Foundation):** Webhook handler, basic echo bot, Telegram API connectivity test
   - **Phase 2 (Agent Routing):** Message router, first agent integration (single agent, single command)
   - **Phase 3 (Session Management):** Multi-turn conversation tracking, session store
   - **Phase 4 (Multi-Agent):** Agent selection UX (inline buttons or slash commands), all agents connected
   - **Phase 5 (Polish):** Error handling, rate limiting, logging, monitoring
6. **File & Folder Structure** — Exact paths for all new files to be created
7. **Environment Variables** — Complete list of required env vars with descriptions
8. **Testing Checklist** — Step-by-step verification steps per phase
9. **Risks & Mitigations** — Known risks and how to address them
10. **Next Steps** — Ordered action items with owner and estimated effort

### Step 5 — Plan Review & Confirmation
Main Agent reads the generated plan document and verifies:
- All 10 sections are present and complete
- Architecture diagram is present
- Database schema is specific (not generic placeholders)
- Phase breakdown is actionable and ordered correctly
- All environment variables are listed
- If any section is incomplete, spawn a follow-up subagent to correct it

---

## Usage

```
/telegram
```

Invoke with no arguments. The command self-discovers the codebase context and produces the integration plan document automatically.

**Optional context hints:**
```
/telegram single-agent           # Plan for connecting only one specific agent
/telegram multi-agent            # Plan for full multi-agent routing (default)
/telegram webhook                # Prefer webhook mode (default)
/telegram polling                # Prefer polling mode (simpler, no public URL needed)
```

---

## Output

On completion, this command produces:

| Output | Location | Description |
|--------|----------|-------------|
| Integration plan | `plans/telegram-integration-[YYYY-MM-DD].md` | Full implementation plan document |
| Architecture summary | Printed in chat | Quick-reference summary of the chosen architecture |

---

## Next Steps

After the plan is generated:
1. Review `plans/telegram-integration-[date].md` and confirm the architecture with your team
2. Create the Telegram bot via [@BotFather](https://t.me/BotFather) and store the token securely
3. Run `/build` targeting Phase 1 of the plan (webhook handler + echo test)
4. Use `/integrate` to connect the first AI agent once Phase 1 is verified
5. Run `/qa` against each phase before proceeding to the next

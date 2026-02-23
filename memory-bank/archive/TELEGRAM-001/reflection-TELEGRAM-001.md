# Reflection — TELEGRAM-001: Telegram Bot Integration for Mission Control

**Date:** 2026-02-23  
**Task:** Telegram bot integration connecting Mission Control & AI agents to Telegram  
**Complexity:** Level 4 (multi-phase system build)  
**Status:** ✅ Complete — all 6 phases deployed, tested, and reflected  

---

## Summary

TELEGRAM-001 delivered a full Telegram bot integration for Mission Control in a single session across 6 phases. The bot connects United Trades operators (Prime Electrical, AKF Construction, CleanJet) to their Mission Control AI agent stack via Telegram commands and push notifications. It handles session management, admin-gated commands (`/status`, `/leads`), inline keyboard buttons for lead qualification, freeform LLM chat with conversation history via OpenRouter, and proactive data-monitor push alerts via the existing `outbound_queue` → `mc-send` delivery pipeline.

One critical runtime bug was found and fixed during Phase 2 (`supabase-js v2` query `.catch()` pattern unsupported in Deno). A post-completion improvement fixed the system prompt and model configuration after observing the bot citing external websites due to a web-search-enabled model being set as `OPENROUTER_MODEL` in the Vault.

---

## What Went Well

### 1. Phased build with testing gates
Each phase had explicit success criteria tested before proceeding to the next. The six-phase progression (foundation → sessions → data monitor → leads → LLM → hardening) produced a working bot at the end of each phase, not just at the end of the whole task. If a later phase had broken something, the scope of investigation would have been narrow.

### 2. `_shared/telegram.ts` helper pattern
Extracting `sendMessage`, `sendTyping`, `sendInlineKeyboard`, `answerCallbackQuery`, and `escapeMarkdown` into a shared module in Phase 1 paid dividends in every subsequent phase. The webhook handler never called the Telegram API directly — all Telegram API surface was in one file, tested once, and reused freely.

### 3. Supabase MCP tools for live debugging
The combination of `execute_sql` (inspect DB state), `get_logs` (Edge Function logs), and `apply_migration` (run DDL) eliminated the need for a local Supabase dev environment. Diagnosing the `.catch()` bug required reading the raw error from the function — the MCP tools made that a 3-step process instead of requiring CLI setup.

### 4. `outbound_queue` + `mc-send` reuse (Phase 3)
The data-monitor push notification path required zero new infrastructure. Inserting a `delivery_type: 'telegram'` row into the existing `outbound_queue` and adding a `deliverTelegram()` branch to `mc-send` was the entire change. This is a strong pattern — the queue handles retries, idempotency, and delivery tracking for free.

### 5. `pending_action` session context for multi-step flows
Storing `context: { pending_action: 'await_email' }` in `telegram_sessions` to track the `/start` email-linking flow was clean and required no schema changes. The same pattern is immediately usable for future multi-step flows (e.g., `/add` contact flow, feedback collection).

### 6. Early-return pattern for multi-message commands
`/leads` sends multiple messages (one per contact) directly rather than building a single reply string. Using an early `return new Response(...)` after `handleLeads()` instead of falling through to the single `sendMessage` at the bottom of the handler prevented double-sends cleanly.

### 7. Callback query routing order
Routing `callback_query` (inline button taps) _before_ `message.text` in the main handler was critical. Telegram sends both a `callback_query` update and sometimes a phantom message; checking `callbackQuery?.data` first and returning early prevented accidental double-handling.

---

## Challenges

### 1. `supabase-js v2` `.catch()` not supported in Deno Edge Runtime
**What happened:** Phase 2 testing returned HTTP 500 for all text messages. The function appeared to deploy correctly and auth checks passed. The error was only discovered by temporarily modifying the error response to expose the raw message: `TypeError: supabase.from(...).insert(...).catch is not a function`.

**Root cause:** `supabase-js v2` returns a `PostgrestBuilder` object from query chains. In the Deno Edge Runtime, calling `.catch()` directly on a `PostgrestBuilder` (without `await`) throws because it's not a native Promise. The correct pattern is `const { error } = await supabase.from(...).insert(...)`.

**Fix:** All query chains converted to `const { data, error } = await supabase.from(...)...` pattern with `if (error) console.error(...)` guards.

**Prevention:** Added to `learnings.md` — "Never call `.catch()` on a supabase-js v2 query builder. Always `await` and destructure `{ data, error }`."

### 2. Edge Function secrets vs Supabase Vault
**What happened:** When searching for `TELEGRAM_WEBHOOK_SECRET` to use in curl test commands, a `vault.decrypted_secrets` SQL query returned nothing for it. Only `OPENROUTER_API_KEY` appeared (because it was added via Vault, not Edge Function secrets).

**Root cause:** Telegram secrets were added via the Supabase Dashboard "Edge Functions → Secrets" panel, which stores them in a separate secrets store accessible only as `Deno.env.get()` inside Edge Functions — not via `vault.decrypted_secrets`. These are two distinct storage mechanisms.

**Prevention:** Document the distinction — Vault secrets (accessible via SQL) vs Edge Function secrets (accessible only inside Edge Functions). For this project, the two Telegram secrets were stored as Edge Function secrets; `OPENROUTER_API_KEY` was stored in Vault.

### 3. Web-search LLM model misconfiguration
**What happened:** Post-completion, the bot was observed citing `kinabase.com`, `scribbr.com`, and other external websites in response to "Can you add this email to the database?" The response looked like a web-search result page, not an assistant answer.

**Root cause:** `OPENROUTER_MODEL` in the Edge Function secrets was set to a Perplexity-style web-search model (e.g., `perplexity/llama-3.1-sonar-*`). The code defaults to `openai/gpt-4o-mini` only when the env var is absent.

**Fix:** Updated `OPENROUTER_MODEL` to `openai/gpt-4o-mini` + rewrote the system prompt with explicit capabilities, limitations, available commands, and live DB context injection (recent contacts, active sites).

**Prevention:** On initial deployment, always verify the model with a test freeform message and check whether the response cites any external URLs.

### 4. In-memory rate limiter doesn't persist across cold starts
**What happened:** Sending 11 sequential `/help` messages all returned HTTP 200 and all were processed normally — the rate limiter never fired.

**Root cause:** Supabase Edge Functions are serverless. Each cold start creates a new process with a fresh `rateLimitMap`. Sequential curl requests with ~2.5s gaps each triggered a new cold start, resetting the counter.

**Known trade-off:** The plan explicitly documented this limitation ("resets on Edge Function cold start"). For a low-volume internal ops tool, this is acceptable. Under real Telegram usage, warm bursts within a single instance would be rate-limited correctly.

**Future fix:** Use a Postgres table or Supabase `kv` store for persistent per-chat rate limiting if this becomes a real concern.

### 5. Weak initial system prompt
**What happened:** The initial system prompt was one sentence: *"You are an AI assistant for Mission Control... Answer only from context provided. If you don't know, say so."* The bot responded to operational requests with generic advice and made no reference to its actual capabilities.

**Root cause:** The prompt gave the model no schema knowledge, no list of available commands, no boundaries around what it could/couldn't do, and no real data context to draw from.

**Fix:** System prompt rewritten with: explicit business context (all three companies + their domains), WHAT YOU CAN DO section, WHAT YOU CANNOT DO section, AVAILABLE COMMANDS list with descriptions, live context injection (last 5 contacts + active sites), and explicit prohibition on referencing external sources.

---

## Lessons Learned

### Technical

1. **`await` + destructure all supabase-js v2 queries in Deno** — never use `.then()` or `.catch()` on the builder directly.

2. **Verify the LLM model and test with real prompts before declaring Phase 5 complete** — check the response for any external URLs or "search results" framing that indicates a web-search model.

3. **Inject live DB context into every LLM system prompt** — without it, the bot can't answer any real data question. Even a small snapshot (last 5 contacts, active sites, recent alerts) dramatically improves response quality.

4. **The `outbound_queue` pattern scales to any channel** — adding Telegram delivery required only a new column (`telegram_chat_id`) and a new delivery branch. Email and SMS would follow the same pattern. This is the right design.

5. **Store multi-step flow state in `session.context`** — no schema migration needed, instantly extensible. Use `pending_action` as the discriminator and the specific action name as the value.

6. **`answerCallbackQuery` must always be called** — even on errors. If skipped, Telegram shows an infinite loading spinner on the button. Wrap the handler and answer on any exit path.

### Process

7. **Phased implementation with explicit success criteria tests is essential for Deno Edge Functions** — there's no local REPL or hot-reload. Each phase must be atomic and testable before proceeding.

8. **Keep a curl test script for the webhook** — one test command per success criterion, runnable any time. Having the webhook URL, secret token, and admin chat_id available in notes saves significant debugging time.

9. **Use Supabase MCP `execute_sql` to verify DB state as part of every test** — don't rely only on HTTP response codes. For `qualify` callback, HTTP 200 is necessary but not sufficient; confirm the tag was actually written to `contacts.tags`.

---

## Process Improvements

1. **Add a "model sanity check" to Phase 5 tests** — after deploying the LLM handler, send a freeform message and explicitly verify the response contains no external URLs or citation markers before marking the phase complete.

2. **Document Edge Function secrets separately from Vault secrets** in the environment variables table — they behave differently and the distinction trips up debugging.

3. **Create a Telegram bot test harness** — a single bash script that fires one valid and one invalid request for each command and checks the DB state. Would have saved 15 minutes per phase.

---

## Technical Improvements (Future)

| Improvement | Priority | Effort |
|---|---|---|
| Function calling / tool use in `handleFreeform` (the "brain" pattern) | High | ~4h |
| `/add` command for adding contacts via conversational flow | High | ~2h |
| Persistent rate limiting via Postgres (vs in-memory) | Medium | ~1h |
| Write errors to `agent_actions` for observability | Medium | ~1h |
| `/contacts` command — search contacts by name/email | Medium | ~1h |
| Conversation memory trim strategy (currently capped at 10 messages) | Low | ~30m |

---

## Final State

| Component | Status |
|---|---|
| `telegram-webhook` Edge Function | ✅ Live — version 10 |
| `_shared/telegram.ts` | ✅ Stable |
| `mc-send` Telegram delivery | ✅ Live — delivery_type 'telegram' |
| `data-monitor` push alerts | ✅ Live — inserts to outbound_queue |
| DB tables (`telegram_sessions`, `telegram_messages`) | ✅ Applied |
| `agent-registry.md` | ✅ Agent 5 added |
| `architecture.md` | ✅ Updated with Telegram integration |
| System prompt | ✅ Grounded with live context + boundaries |
| LLM model | ✅ `openai/gpt-4o-mini` (no web search) |
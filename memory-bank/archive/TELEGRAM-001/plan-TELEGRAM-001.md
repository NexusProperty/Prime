# TELEGRAM-001 — Implementation Plan
**Task:** Telegram Bot Integration for Mission Control & AI Agents  
**Complexity:** Level 4  
**Created:** 2026-02-23  
**Status:** 🔵 PLANNING — No creative phases required. Proceed to /build after user completes prerequisites.  
**Reference plan:** `plans/telegram-integration-2026-02-23.md`

---

## Architecture Decision

**Integration pattern:** Supabase Edge Function webhook handler — mirrors `vapi-webhook/index.ts` exactly.  
**Auth pattern:** `X-Telegram-Bot-Api-Secret-Token` header → timing-safe string comparison. Same as `verifyVapiSignature` in `_shared/security.ts`.  
**Mode:** Webhook (not polling). Telegram POST → Edge Function URL (always public, no tunneling needed).  
**No creative phases:** Architecture is fully determined by existing codebase patterns.

---

## Verified Codebase Context

### Pattern Files (read and verified)
- `supabase/functions/vapi-webhook/index.ts` — **TEMPLATE** for telegram-webhook structure
- `supabase/functions/_shared/security.ts` — `verifyVapiSignature` → adapt to `verifyTelegramToken`
- `supabase/functions/mc-send/index.ts` — add `deliverTelegram()` + delivery_type 'telegram'
- `supabase/functions/lead-qualifier/index.ts` — agent invocation pattern (POST + Bearer auth)
- `supabase/functions/data-monitor/index.ts` — accepts POST + Bearer auth → returns `{ alerts[], sites_checked, ... }`
- `supabase/functions/_shared/ingest.ts` — fire-and-forget fetch pattern

### Key Schema Facts (verified)
- `outbound_queue.delivery_type` CHECK: `IN ('webhook', 'email', 'sms')` — needs `'telegram'` added
- No `telegram_chat_id` column on `outbound_queue` yet
- No `telegram_sessions` table
- No `telegram_messages` table
- `vapi_caller_sessions` is the session model to replicate for `telegram_sessions`

### Edge Function Auth (verified)
- `data-monitor` and `lead-qualifier` both authenticate with: `Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
- Telegram webhook auth: `X-Telegram-Bot-Api-Secret-Token` header (plain string comparison)

---

## Phase 1 — Foundation

**Goal:** Working Telegram webhook Edge Function that echoes messages back. No DB yet.  
**Estimated effort:** 2–3 hours  
**Gate to Phase 2:** Bot responds to any Telegram message with an echo within 2 seconds.

### Files to Create
1. `supabase/functions/telegram-webhook/index.ts` — Main webhook handler
2. `supabase/functions/_shared/telegram.ts` — Telegram Bot API helper

### File 1: `supabase/functions/_shared/telegram.ts`

This file provides the Telegram Bot API client functions. Implement exactly:

```typescript
const TELEGRAM_API_BASE = 'https://api.telegram.org';

function getTelegramToken(): string {
  const token = Deno.env.get('TELEGRAM_BOT_TOKEN');
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN not set');
  return token;
}

/** Send a plain text or MarkdownV2 message to a chat */
export async function sendMessage(
  chatId: number,
  text: string,
  parseMode?: 'MarkdownV2' | 'HTML',
): Promise<void> {
  const token = getTelegramToken();
  const body: Record<string, unknown> = { chat_id: chatId, text };
  if (parseMode) body.parse_mode = parseMode;

  const res = await fetch(`${TELEGRAM_API_BASE}/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('[telegram][sendMessage] API error:', err);
  }
}

/** Send a typing indicator */
export async function sendTyping(chatId: number): Promise<void> {
  const token = getTelegramToken();
  await fetch(`${TELEGRAM_API_BASE}/bot${token}/sendChatAction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, action: 'typing' }),
    signal: AbortSignal.timeout(5_000),
  }).catch(() => {/* non-critical */});
}

/** Escape text for Telegram MarkdownV2 */
export function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
}

/** Send a message with inline keyboard buttons */
export async function sendInlineKeyboard(
  chatId: number,
  text: string,
  buttons: Array<Array<{ text: string; callback_data: string }>>,
): Promise<void> {
  const token = getTelegramToken();
  await fetch(`${TELEGRAM_API_BASE}/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      reply_markup: { inline_keyboard: buttons },
    }),
    signal: AbortSignal.timeout(10_000),
  }).catch((err: unknown) => console.error('[telegram][sendInlineKeyboard]', err));
}

/** Answer a callback query (dismiss loading spinner on inline button) */
export async function answerCallbackQuery(
  callbackQueryId: string,
  text?: string,
): Promise<void> {
  const token = getTelegramToken();
  await fetch(`${TELEGRAM_API_BASE}/bot${token}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
    signal: AbortSignal.timeout(5_000),
  }).catch(() => {/* non-critical */});
}
```

### File 2: `supabase/functions/telegram-webhook/index.ts` (Phase 1 — echo bot)

Structure mirrors `vapi-webhook/index.ts`. Implement:

```typescript
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { timingSafeEqual } from 'node:crypto';
import { sendMessage } from '../_shared/telegram.ts';

// ── Auth ─────────────────────────────────────────────────────────────────────

function verifyTelegramToken(header: string | null, secret: string): boolean {
  if (!header) return false;
  const expected = new TextEncoder().encode(secret);
  const received = new TextEncoder().encode(header);
  if (expected.byteLength !== received.byteLength) return false;
  return timingSafeEqual(expected, received);
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface TelegramUser {
  id: number;
  first_name?: string;
  username?: string;
}

interface TelegramChat {
  id: number;
  type: string;
}

interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  text?: string;
  date: number;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: {
    id: string;
    from: TelegramUser;
    message?: TelegramMessage;
    data?: string;
  };
}

// ── Main Handler ──────────────────────────────────────────────────────────────

Deno.serve(async (req: Request): Promise<Response> => {
  const startTime = Date.now();

  const secret = Deno.env.get('TELEGRAM_WEBHOOK_SECRET');
  if (!secret) {
    console.error('[telegram-webhook] TELEGRAM_WEBHOOK_SECRET not set');
    return new Response('Internal Server Error', { status: 500 });
  }

  // Verify Telegram secret token
  const tokenHeader = req.headers.get('X-Telegram-Bot-Api-Secret-Token');
  if (!verifyTelegramToken(tokenHeader, secret)) {
    console.warn('[telegram-webhook] Invalid token | ip=', req.headers.get('cf-connecting-ip') ?? 'unknown');
    return new Response('Unauthorized', { status: 401 });
  }

  let update: TelegramUpdate;
  try {
    update = await req.json();
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  const message = update.message;
  if (!message?.text) {
    // Non-text updates (stickers, photos, etc.) — acknowledge and return
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const chatId = message.chat.id;
  const text = message.text.trim();

  try {
    // Phase 1: Echo bot
    await sendMessage(chatId, `Echo: ${text}`);

    const duration = Date.now() - startTime;
    console.log(`[telegram-webhook] echo | chat=${chatId} duration=${duration}ms`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[telegram-webhook] handler error:', msg);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

### Phase 1 Deployment Steps
1. Create both files above
2. Deploy: `supabase functions deploy telegram-webhook --no-verify-jwt`
3. Register webhook (replace PROJECT_REF and tokens):
```bash
curl -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"https://[PROJECT_REF].supabase.co/functions/v1/telegram-webhook\", \"secret_token\": \"${TELEGRAM_WEBHOOK_SECRET}\"}"
```
4. Test: Send any message to the bot → should echo it back
5. Test auth rejection: `curl -X POST [url] -H "X-Telegram-Bot-Api-Secret-Token: wrong" -d '{}' ` → expect 401

### Phase 1 Success Criteria
- [ ] Bot responds to any message with `Echo: [message]` within 2 seconds
- [ ] Invalid secret token returns 401
- [ ] Valid update with no text field returns 200 `{"ok":true}`

---

## Phase 2 — Session Management & Auth Bridge

**Goal:** `/start` command links Telegram user to Mission Control contact. All messages logged.  
**Estimated effort:** 2–3 hours  
**Prerequisite:** Phase 1 complete and passing.  
**Gate to Phase 3:** New user completes /start, `chat_id` linked to `contact_id` in DB.

### Files to Create/Update
1. `supabase/migrations/20260223001_telegram_tables.sql` — NEW: DB schema changes
2. `supabase/functions/telegram-webhook/index.ts` — UPDATE: add session + /start + message logging

### Migration: `supabase/migrations/20260223001_telegram_tables.sql`

```sql
-- TELEGRAM-001: Phase 2 — Session management tables + outbound_queue extension
-- Date: 2026-02-23

-- Table: telegram_sessions
-- Maps Telegram chat_id to Mission Control contact + conversation context
CREATE TABLE IF NOT EXISTS telegram_sessions (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id         BIGINT UNIQUE NOT NULL,
  contact_id      UUID REFERENCES contacts(id),
  username        TEXT,
  first_name      TEXT,
  is_admin        BOOLEAN DEFAULT FALSE,
  context         JSONB DEFAULT '{}',
  last_active_at  TIMESTAMPTZ DEFAULT now(),
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_telegram_sessions_chat_id ON telegram_sessions(chat_id);
CREATE INDEX idx_telegram_sessions_contact_id ON telegram_sessions(contact_id);

-- Table: telegram_messages
CREATE TABLE IF NOT EXISTS telegram_messages (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id         BIGINT NOT NULL,
  direction       TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  message_text    TEXT,
  agent_used      TEXT,
  agent_response  JSONB,
  delivered       BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_telegram_messages_chat_id ON telegram_messages(chat_id);
CREATE INDEX idx_telegram_messages_created_at ON telegram_messages(created_at);

-- Extend outbound_queue for Telegram push notifications
ALTER TABLE outbound_queue ADD COLUMN IF NOT EXISTS telegram_chat_id BIGINT;

-- IMPORTANT: The outbound_queue.delivery_type CHECK constraint cannot be altered with ADD COLUMN.
-- The delivery_type column CHECK constraint ('webhook', 'email', 'sms') must be dropped and re-added.
-- Run this in the Supabase SQL editor OR as a separate migration step:
ALTER TABLE outbound_queue DROP CONSTRAINT IF EXISTS outbound_queue_delivery_type_check;
ALTER TABLE outbound_queue ADD CONSTRAINT outbound_queue_delivery_type_check
  CHECK (delivery_type IN ('webhook', 'email', 'sms', 'telegram'));
```

### Updated `telegram-webhook/index.ts` (Phase 2 additions)

Add imports at top:
```typescript
import { createClient } from 'jsr:@supabase/supabase-js@2';
```

Add session lookup + /start handler + message logging logic. Key functions to add:

**`getOrCreateSession(supabase, update)`:**
```typescript
async function getOrCreateSession(
  supabase: ReturnType<typeof createClient>,
  chatId: number,
  user?: TelegramUser,
) {
  const { data: session } = await supabase
    .from('telegram_sessions')
    .select('*')
    .eq('chat_id', chatId)
    .maybeSingle();

  if (session) {
    // Update last_active_at
    await supabase
      .from('telegram_sessions')
      .update({ last_active_at: new Date().toISOString() })
      .eq('chat_id', chatId);
    return session;
  }

  // Create new session
  const { data: newSession } = await supabase
    .from('telegram_sessions')
    .insert({
      chat_id: chatId,
      username: user?.username ?? null,
      first_name: user?.first_name ?? null,
    })
    .select()
    .single();

  return newSession;
}
```

**`logMessage(supabase, chatId, direction, text, agentUsed?)`:**
```typescript
async function logMessage(
  supabase: ReturnType<typeof createClient>,
  chatId: number,
  direction: 'inbound' | 'outbound',
  text: string,
  agentUsed?: string,
): Promise<void> {
  await supabase.from('telegram_messages').insert({
    chat_id: chatId,
    direction,
    message_text: text,
    agent_used: agentUsed ?? null,
    delivered: direction === 'outbound',
  }).catch((err: unknown) => console.error('[telegram-webhook][log]', err));
}
```

**`handleStart(supabase, chatId, session, pendingEmail?)`:**
```typescript
// /start command — prompt for email to link contact
async function handleStart(
  supabase: ReturnType<typeof createClient>,
  chatId: number,
  session: Record<string, unknown>,
): Promise<string> {
  if (session.contact_id) {
    return 'You are already linked to Mission Control.';
  }
  // Set pending_action in context
  await supabase
    .from('telegram_sessions')
    .update({ context: { pending_action: 'await_email' } })
    .eq('chat_id', chatId);
  return 'Welcome to Mission Control. Please send your email address to link your account.';
}

// Handle email input when pending_action = 'await_email'
async function handleEmailLink(
  supabase: ReturnType<typeof createClient>,
  chatId: number,
  email: string,
): Promise<string> {
  const { data: contact } = await supabase
    .from('contacts')
    .select('id, full_name')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle();

  if (!contact) {
    return `No contact found for ${email}. Please try a different email or contact your administrator.`;
  }

  await supabase
    .from('telegram_sessions')
    .update({
      contact_id: contact.id,
      context: {},
    })
    .eq('chat_id', chatId);

  return `Linked! Welcome, ${contact.full_name ?? email}. Send /help to see available commands.`;
}
```

**Updated message router (Phase 2):**
```typescript
const context = session?.context as Record<string, unknown> ?? {};

if (context.pending_action === 'await_email') {
  reply = await handleEmailLink(supabase, chatId, text);
} else if (text === '/start') {
  reply = await handleStart(supabase, chatId, session);
} else if (text === '/help') {
  reply = 'Available commands:\n/start — link your account\n/status — system health\n/leads — recent leads\n/help — this message';
} else {
  reply = `Unknown command. Send /help for options.`;
}
```

### Phase 2 Success Criteria
- [ ] `/start` responds with email prompt
- [ ] Valid email → "Linked! Welcome, [name]"
- [ ] Unknown email → "No contact found" message
- [ ] `telegram_sessions` row created with `chat_id` and `contact_id`
- [ ] `telegram_messages` row created for each inbound and outbound message
- [ ] Returning user `/start` → "You are already linked"

---

## Phase 3 — Data Monitor: /status command + push notifications

**Goal:** `/status` calls data-monitor and returns formatted report. Anomaly push notifications via mc-send.  
**Estimated effort:** 2–3 hours  
**Prerequisite:** Phase 2 complete. Admin `chat_id` stored in session with `is_admin = true`.  
**Gate to Phase 4:** /status returns live report; push notification arrives within 15 min of anomaly.

### Files to Update
1. `supabase/functions/telegram-webhook/index.ts` — add /status handler + admin check
2. `supabase/functions/mc-send/index.ts` — add `deliverTelegram()` + delivery_type 'telegram'
3. `supabase/functions/data-monitor/index.ts` — add outbound_queue push notification when TELEGRAM_ADMIN_CHAT_ID configured

### /status handler

Invoke data-monitor then format response:

```typescript
async function handleStatus(
  supabase: ReturnType<typeof createClient>,
  chatId: number,
  session: Record<string, unknown>,
): Promise<string> {
  // Admin-only check
  if (!session?.is_admin) {
    return 'Access denied. This command requires admin privileges.';
  }

  const dmUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/data-monitor`;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  try {
    const res = await fetch(dmUrl, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${serviceKey}` },
      signal: AbortSignal.timeout(35_000),
    });

    const report = await res.json() as {
      checked_at: string;
      sites_checked: number;
      alerts_raised: number;
      alerts: Array<{ type: string; severity: string; message: string }>;
    };

    if (report.alerts_raised === 0) {
      return `✅ All systems clear\n${report.sites_checked} sites checked • ${new Date(report.checked_at).toLocaleTimeString('en-NZ')}`;
    }

    const lines = [`⚠️ ${report.alerts_raised} alert(s) detected:\n`];
    for (const alert of report.alerts) {
      const icon = alert.severity === 'critical' ? '🔴' : '🟡';
      lines.push(`${icon} ${alert.message}`);
    }
    lines.push(`\n${report.sites_checked} sites • ${new Date(report.checked_at).toLocaleTimeString('en-NZ')}`);
    return lines.join('\n');
  } catch (err: unknown) {
    console.error('[telegram-webhook][/status]', err);
    return 'Failed to fetch system status. Please try again.';
  }
}
```

### mc-send update — add Telegram delivery

Add to `QueueItem` interface:
```typescript
interface QueueItem {
  // ... existing fields ...
  delivery_type: 'webhook' | 'email' | 'sms' | 'telegram';
  telegram_chat_id: number | null;
}
```

Add `deliverTelegram` function:
```typescript
async function deliverTelegram(item: QueueItem): Promise<{ ok: boolean; error?: string }> {
  const token = Deno.env.get('TELEGRAM_BOT_TOKEN');
  if (!token) return { ok: false, error: 'TELEGRAM_BOT_TOKEN not configured' };
  if (!item.telegram_chat_id) return { ok: false, error: 'No telegram_chat_id configured' };

  const text = (item.payload.text as string) ?? JSON.stringify(item.payload);
  const truncated = text.length > 4000 ? text.slice(0, 3997) + '...' : text;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: item.telegram_chat_id,
        text: truncated,
        parse_mode: (item.payload.parse_mode as string) ?? undefined,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({ description: 'Unknown error' }));
      return { ok: false, error: `Telegram API: ${(body as { description?: string }).description ?? res.status}` };
    }
    return { ok: true };
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error' };
  }
}
```

Update delivery router in mc-send:
```typescript
if (item.delivery_type === 'webhook') {
  result = await deliverWebhook(item);
} else if (item.delivery_type === 'email') {
  result = await deliverEmail(item);
} else if (item.delivery_type === 'telegram') {
  result = await deliverTelegram(item);
} else {
  result = { ok: false, error: `Unsupported delivery_type: ${item.delivery_type}` };
}
```

### data-monitor update — push to outbound_queue

At the end of data-monitor, after logging alerts, add push notification:
```typescript
// Push Telegram notification if admin chat_id is configured and alerts raised
const adminChatId = Deno.env.get('TELEGRAM_ADMIN_CHAT_ID');
if (adminChatId && alerts.length > 0 && agent?.id) {
  const lines = [`⚠️ Mission Control Alert (${alerts.length} issue${alerts.length > 1 ? 's' : ''}):\n`];
  for (const alert of alerts) {
    const icon = alert.severity === 'critical' ? '🔴' : '🟡';
    lines.push(`${icon} ${alert.message}`);
  }
  await supabase.from('outbound_queue').insert({
    site_id: sites?.[0]?.id, // Use first site as reference
    delivery_type: 'telegram',
    telegram_chat_id: parseInt(adminChatId),
    payload: { text: lines.join('\n') },
    created_by_agent: agent.id,
    idempotency_key: `dm-telegram-alert-${cycle}`,
  }).catch((err: unknown) => console.error('[data-monitor][telegram-push]', err));
}
```

### Phase 3 Success Criteria
- [ ] `/status` (admin user) → returns formatted alert report or "All systems clear"
- [ ] `/status` (non-admin user) → "Access denied"
- [ ] Anomaly in data-monitor → `outbound_queue` row created with `delivery_type: 'telegram'`
- [ ] `mc-send` processes Telegram row → message delivered to admin chat within 1 cron cycle (≤1 min)

---

## Phase 4 — Lead Qualifier: /leads command

**Goal:** `/leads` returns recent high-score contacts. Inline keyboard for quick actions.  
**Estimated effort:** 2–3 hours  
**Prerequisite:** Phase 3 complete.  
**Gate to Phase 5:** /leads returns contacts; inline button updates DB.

### Files to Update
1. `supabase/functions/telegram-webhook/index.ts` — add /leads handler + callback_query handler

### /leads handler

```typescript
async function handleLeads(
  supabase: ReturnType<typeof createClient>,
  chatId: number,
  session: Record<string, unknown>,
): Promise<void> {
  if (!session?.is_admin) {
    await sendMessage(chatId, 'Access denied. This command requires admin privileges.');
    return;
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: contacts } = await supabase
    .from('contacts')
    .select('id, full_name, email, phone, lead_score, tags, source_site')
    .gte('updated_at', since)
    .gte('lead_score', 60)
    .order('lead_score', { ascending: false })
    .limit(10);

  if (!contacts || contacts.length === 0) {
    await sendMessage(chatId, '📋 No leads with score ≥ 60 in the last 24h.');
    return;
  }

  for (const contact of contacts) {
    const tags = (contact.tags as string[]).join(', ') || 'none';
    const text = `👤 *${contact.full_name ?? 'Unknown'}*\nScore: ${contact.lead_score}/100\nEmail: ${contact.email}\nPhone: ${contact.phone ?? '—'}\nTags: ${tags}`;
    await sendInlineKeyboard(chatId, text, [
      [
        { text: '✅ Mark Qualified', callback_data: `qualify:${contact.id}` },
        { text: '📞 Request Call', callback_data: `call:${contact.id}` },
      ],
    ]);
  }
}
```

### Callback query handler (for inline buttons)

```typescript
async function handleCallbackQuery(
  supabase: ReturnType<typeof createClient>,
  callbackQueryId: string,
  chatId: number,
  data: string,
): Promise<void> {
  const [action, contactId] = data.split(':');

  if (action === 'qualify') {
    await supabase
      .from('contacts')
      .update({ tags: supabase.rpc('array_append_unique', { arr: 'tags', val: 'qualified' }) })
      .eq('id', contactId);
    // Simpler approach: fetch then update
    const { data: contact } = await supabase.from('contacts').select('tags').eq('id', contactId).single();
    const updatedTags = [...new Set([...(contact?.tags ?? []), 'qualified'])];
    await supabase.from('contacts').update({ tags: updatedTags }).eq('id', contactId);
    await answerCallbackQuery(callbackQueryId, '✅ Marked as qualified');
  } else if (action === 'call') {
    await answerCallbackQuery(callbackQueryId, '📞 Call request noted');
    await sendMessage(chatId, `Call request logged for contact ${contactId}. Check Mission Control dashboard.`);
  }
}
```

### Phase 4 Success Criteria
- [ ] `/leads` (admin) → returns contacts with score ≥ 60 from last 24h with inline buttons
- [ ] `/leads` → "No leads" message if none found
- [ ] "Mark Qualified" button → adds 'qualified' to contact tags in DB + confirms via callback answer
- [ ] `/leads` (non-admin) → "Access denied"

---

## Phase 5 — Freeform Chat (General Assistant)

**Goal:** Any non-command message routes to OpenRouter LLM with Mission Control context.  
**Estimated effort:** 3–4 hours  
**Prerequisite:** Phase 4 complete.  
**Gate to Phase 6:** Freeform questions answered with MC context < 5s; typing indicator shown.

### Files to Update
1. `supabase/functions/telegram-webhook/index.ts` — add freeform LLM handler

### Freeform handler

```typescript
async function handleFreeform(
  supabase: ReturnType<typeof createClient>,
  chatId: number,
  text: string,
  session: Record<string, unknown>,
): Promise<string> {
  const openRouterKey = Deno.env.get('OPENROUTER_API_KEY');
  const model = Deno.env.get('OPENROUTER_MODEL') ?? 'openai/gpt-4o-mini';

  if (!openRouterKey) return 'AI assistant is not configured.';

  // Load conversation history from session context
  const context = session?.context as Record<string, unknown> ?? {};
  const history = (context.messages as Array<{ role: string; content: string }>) ?? [];

  // Load recent agent_memory if contact is linked
  let memoryContext = '';
  if (session?.contact_id) {
    const { data: memory } = await supabase
      .from('agent_memory')
      .select('memory_type, content')
      .eq('contact_id', session.contact_id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (memory?.length) {
      memoryContext = '\n\nContact memory:\n' + memory.map((m: { memory_type: string; content: string }) => `[${m.memory_type}] ${m.content}`).join('\n');
    }
  }

  const systemPrompt = `You are an AI assistant for Mission Control — the central operations dashboard for United Trades (Prime Electrical, AKF Construction, CleanJet). You help operators understand their business data and agent activity. Answer only from context provided. If you don't know, say so.${memoryContext}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-6), // Keep last 3 turns (6 messages)
    { role: 'user', content: text },
  ];

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterKey}`,
      },
      body: JSON.stringify({ model, messages, max_tokens: 500 }),
      signal: AbortSignal.timeout(30_000),
    });

    const data = await res.json() as { choices: Array<{ message: { content: string } }> };
    const reply = data.choices?.[0]?.message?.content ?? 'No response from AI.';

    // Update conversation history in session context
    const updatedMessages = [...history, { role: 'user', content: text }, { role: 'assistant', content: reply }];
    await supabase.from('telegram_sessions').update({
      context: { messages: updatedMessages.slice(-10) }, // Keep last 5 turns
    }).eq('chat_id', chatId);

    return reply;
  } catch (err: unknown) {
    console.error('[telegram-webhook][freeform]', err);
    return 'Sorry, I could not process your request right now.';
  }
}
```

**Integration point:** In the main router, after all command checks:
```typescript
} else {
  await sendTyping(chatId);
  reply = await handleFreeform(supabase, chatId, text, session);
}
```

### Phase 5 Success Criteria
- [ ] Freeform message → typing indicator appears → LLM response within 5 seconds
- [ ] Response references Mission Control context (not generic answers)
- [ ] Conversation turns preserved across 3 exchanges (stored in `telegram_sessions.context`)
- [ ] Linked contact's agent_memory injected into system prompt

---

## Phase 6 — Production Hardening

**Goal:** Rate limiting, admin enforcement, error handling, monitoring.  
**Estimated effort:** 2–3 hours  
**Prerequisite:** Phase 5 complete.

### Files to Update
1. `supabase/functions/telegram-webhook/index.ts` — rate limiting + error envelope
2. `MissionControl/agent-registry.md` — add telegram_bot agent entry
3. `MissionControl/architecture.md` — update integration diagram

### Rate limiting (in-memory per Edge Function instance)

```typescript
// Simple per-chat rate limiter (resets on Edge Function cold start)
const rateLimitMap = new Map<number, { count: number; resetAt: number }>();

function isRateLimited(chatId: number, maxPerMinute = 10): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(chatId);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(chatId, { count: 1, resetAt: now + 60_000 });
    return false;
  }

  if (entry.count >= maxPerMinute) return true;
  entry.count++;
  return false;
}
```

Usage at top of main handler:
```typescript
if (isRateLimited(chatId)) {
  await sendMessage(chatId, 'Too many requests. Please wait a moment before sending another message.');
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
}
```

### agent-registry.md addition

Add a new Agent 5 entry for `telegram_bot`:
- Name: `telegram_bot`
- Type: `custom`
- Purpose: Routes Telegram messages to appropriate Mission Control agents and delivers responses
- Triggers: `telegram_message` (inbound Telegram message)
- can_read: `telegram_sessions`, `telegram_messages`, `contacts`, `agent_memory`
- can_write: `telegram_sessions`, `telegram_messages`, `outbound_queue`
- Deployment status: ✅ Live after Phase 6

### Phase 6 Success Criteria
- [ ] 11th message in 60 seconds → rate limit response
- [ ] Agent error → user-friendly error message, error logged to `agent_actions`
- [ ] `/status` and `/leads` blocked for non-admin users
- [ ] `agent-registry.md` updated with telegram_bot agent
- [ ] `architecture.md` updated with Telegram integration diagram

---

## Full Final File Tree

After all 6 phases, the complete file tree:

```
supabase/
├── functions/
│   ├── telegram-webhook/
│   │   └── index.ts          ← NEW (grows through phases 1-6)
│   ├── _shared/
│   │   └── telegram.ts       ← NEW (phase 1, stable after)
│   ├── mc-send/
│   │   └── index.ts          ← MODIFIED (phase 3: add deliverTelegram)
│   └── data-monitor/
│       └── index.ts          ← MODIFIED (phase 3: add outbound_queue push)
└── migrations/
    └── 20260223001_telegram_tables.sql  ← NEW (phase 2)

MissionControl/
├── agent-registry.md         ← MODIFIED (phase 6: add telegram_bot)
└── architecture.md           ← MODIFIED (phase 6: update diagram)
```

---

## Dependency Map

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6
   │           │         │
   └── No DB   └── DB    └── mc-send update
       needed      migration   + data-monitor update
```

Phase 1 is completely self-contained (no DB, no external calls).  
Each phase gates the next — do not skip forward.

---

## Environment Variables Required

| Variable | Phase Needed | Source |
|----------|-------------|--------|
| `TELEGRAM_BOT_TOKEN` | Phase 1 | Supabase Vault (user action) |
| `TELEGRAM_WEBHOOK_SECRET` | Phase 1 | Supabase Vault (user action) |
| `TELEGRAM_ADMIN_CHAT_ID` | Phase 3 | Supabase Vault (user action) |
| `SUPABASE_URL` | Phase 2 | Already set |
| `SUPABASE_SERVICE_ROLE_KEY` | Phase 2 | Already set |
| `OPENROUTER_API_KEY` | Phase 5 | Already set |
| `OPENROUTER_MODEL` | Phase 5 | Already set |

---

## No Creative Phases

All design decisions are resolved by existing codebase patterns:
- Auth: mirrors `vapi-webhook` / `_shared/security.ts`
- Session: mirrors `vapi_caller_sessions` table structure
- Agent invocation: mirrors `_shared/ingest.ts` fire-and-forget
- Delivery: mirrors `mc-send` webhook/email pattern
- Logging: mirrors `agent_actions` + `vapi_call_log` patterns

**Proceed directly to `/build` after prerequisites are met.**
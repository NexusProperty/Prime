-- =============================================================================
-- TELEGRAM-001: Phase 2 — Telegram Session Management
-- Adds: telegram_sessions, telegram_messages
-- Extends: outbound_queue (telegram_chat_id column + delivery_type constraint)
-- Date: 2026-02-23
-- =============================================================================

-- ── telegram_sessions ─────────────────────────────────────────────────────────
-- Maps Telegram chat_id to Mission Control contact + stores conversation context.
-- Model: mirrors vapi_caller_sessions (phone_number ↔ contact) for chat_id ↔ contact.

CREATE TABLE IF NOT EXISTS telegram_sessions (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id         BIGINT      UNIQUE NOT NULL,
  contact_id      UUID        REFERENCES contacts(id) ON DELETE SET NULL,
  username        TEXT,
  first_name      TEXT,
  is_admin        BOOLEAN     DEFAULT FALSE,
  context         JSONB       DEFAULT '{}',
  last_active_at  TIMESTAMPTZ DEFAULT now(),
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_telegram_sessions_chat_id
  ON telegram_sessions(chat_id);

CREATE INDEX IF NOT EXISTS idx_telegram_sessions_contact_id
  ON telegram_sessions(contact_id);

COMMENT ON TABLE telegram_sessions IS
  'Maps Telegram chat_id to MC contact. is_admin controls access to /status and /leads commands.';

-- ── telegram_messages ─────────────────────────────────────────────────────────
-- Immutable log of all inbound and outbound Telegram messages.

CREATE TABLE IF NOT EXISTS telegram_messages (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id         BIGINT      NOT NULL,
  direction       TEXT        NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  message_text    TEXT,
  agent_used      TEXT,
  agent_response  JSONB,
  delivered       BOOLEAN     DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_telegram_messages_chat_id
  ON telegram_messages(chat_id);

CREATE INDEX IF NOT EXISTS idx_telegram_messages_created_at
  ON telegram_messages(created_at DESC);

COMMENT ON TABLE telegram_messages IS
  'Immutable audit log of all inbound/outbound Telegram messages. INSERT only.';

-- ── outbound_queue extension ──────────────────────────────────────────────────
-- Add telegram_chat_id for Telegram push notification delivery.

ALTER TABLE outbound_queue
  ADD COLUMN IF NOT EXISTS telegram_chat_id BIGINT;

-- Update delivery_type CHECK to include 'telegram'.
-- Must drop and re-add because PostgreSQL does not support ALTER CONSTRAINT.
ALTER TABLE outbound_queue
  DROP CONSTRAINT IF EXISTS outbound_queue_delivery_type_check;

ALTER TABLE outbound_queue
  ADD CONSTRAINT outbound_queue_delivery_type_check
  CHECK (delivery_type IN ('webhook', 'email', 'sms', 'telegram'));

COMMENT ON COLUMN outbound_queue.telegram_chat_id IS
  'Target Telegram chat ID for delivery_type = ''telegram'' push notifications.';

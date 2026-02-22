-- ============================================================
-- Mission Control — Unified Supabase PostgreSQL Schema
-- ============================================================
-- Run with: supabase db push
-- Or apply via: supabase migration new mission_control_init
--               then paste this content into the migration file
-- ============================================================

-- ── Extensions ────────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;  -- pgvector for semantic search & agent memory
CREATE EXTENSION IF NOT EXISTS pg_trgm;     -- fuzzy text search on names/emails

-- ── Sites ─────────────────────────────────────────────────────────────────────
-- Represents each of the 3 business websites feeding data into Mission Control.

CREATE TABLE sites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  url         TEXT NOT NULL UNIQUE,
  purpose     TEXT,
  webhook_secret TEXT,                        -- HMAC secret for this site's webhook
  is_active   BOOLEAN DEFAULT true,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Contacts ──────────────────────────────────────────────────────────────────
-- Unified person record — deduplicated by email across all 3 sites.
-- One row per real-world person, regardless of how many sites they appear on.

CREATE TABLE contacts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,           -- PRIMARY deduplication key
  full_name     TEXT,
  first_name    TEXT,
  last_name     TEXT,
  phone         TEXT,
  company       TEXT,
  job_title     TEXT,
  tags          TEXT[] DEFAULT '{}',             -- e.g. ['lead', 'customer', 'vip']
  lead_score    INTEGER DEFAULT 0,               -- 0-100, set by Lead Qualifier agent
  source_site   UUID REFERENCES sites(id),       -- first site that created this contact
  metadata      JSONB DEFAULT '{}',              -- site-specific extra fields (flexible)
  embedding     extensions.vector(1536),         -- semantic profile for similarity search
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX contacts_email_idx ON contacts(email);
CREATE INDEX contacts_tags_idx ON contacts USING GIN(tags);
CREATE INDEX contacts_lead_score_idx ON contacts(lead_score DESC);
CREATE INDEX contacts_embedding_idx ON contacts
  USING ivfflat (embedding extensions.vector_cosine_ops) WITH (lists = 100);

-- ── Events ────────────────────────────────────────────────────────────────────
-- Immutable audit log. One row per thing that happened.
-- NEVER UPDATE — only INSERT. This is the system of record.

CREATE TABLE events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id       UUID REFERENCES sites(id),
  contact_id    UUID REFERENCES contacts(id),
  event_type    TEXT NOT NULL,
  -- Common values: 'form_submit', 'order_placed', 'order_updated', 'email_received',
  --                'ticket_created', 'page_view', 'contact_created', 'agent_triggered'
  payload       JSONB NOT NULL DEFAULT '{}',     -- full event data from the site
  source        TEXT NOT NULL DEFAULT 'webhook',
  -- Values: 'webhook', 'scheduled_pull', 'email_inbound', 'agent', 'manual'
  processed     BOOLEAN DEFAULT false,           -- has an agent acted on this event?
  processed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX events_contact_idx ON events(contact_id);
CREATE INDEX events_site_idx ON events(site_id);
CREATE INDEX events_type_idx ON events(event_type);
CREATE INDEX events_unprocessed_idx ON events(processed, created_at)
  WHERE processed = false;

-- Prevent accidental updates to the events table
CREATE RULE events_no_update AS ON UPDATE TO events DO INSTEAD NOTHING;

-- ── Emails ────────────────────────────────────────────────────────────────────

CREATE TABLE emails (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id    UUID REFERENCES contacts(id),
  direction     TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  subject       TEXT,
  body_text     TEXT,
  body_html     TEXT,
  from_address  TEXT NOT NULL,
  to_address    TEXT NOT NULL,
  cc_addresses  TEXT[] DEFAULT '{}',
  status        TEXT NOT NULL DEFAULT 'received'
    CHECK (status IN ('received', 'draft', 'sent', 'failed', 'bounced')),
  provider_id   TEXT UNIQUE,                     -- message ID from email provider (Resend/Postmark)
  thread_id     TEXT,                            -- group related emails into threads
  embedding     extensions.vector(1536),         -- semantic search over email content
  metadata      JSONB DEFAULT '{}',
  sent_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX emails_contact_idx ON emails(contact_id);
CREATE INDEX emails_direction_idx ON emails(direction);
CREATE INDEX emails_thread_idx ON emails(thread_id);
CREATE INDEX emails_status_idx ON emails(status);
CREATE INDEX emails_embedding_idx ON emails
  USING ivfflat (embedding extensions.vector_cosine_ops) WITH (lists = 100);

-- ── Agents ────────────────────────────────────────────────────────────────────
-- Registry of all AI agents that live inside Mission Control.
-- Agents declare their capabilities explicitly — least-privilege by design.

CREATE TABLE agents (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL UNIQUE,            -- snake_case identifier
  type          TEXT NOT NULL
    CHECK (type IN ('email', 'voice', 'data', 'monitor', 'qualifier', 'custom')),
  description   TEXT NOT NULL,
  can_read      TEXT[] DEFAULT '{}',             -- table names this agent is permitted to read
  can_write     TEXT[] DEFAULT '{}',             -- table names this agent is permitted to write
  triggers      TEXT[] DEFAULT '{}',             -- event_type values that activate this agent
  escalation_condition TEXT,                     -- when does this agent stop and ask a human?
  timeout_ms    INTEGER DEFAULT 10000,           -- max execution time before failure
  config        JSONB DEFAULT '{}',              -- agent-specific config (model, voice_id, etc.)
  cursor_agents TEXT[] DEFAULT '{}',             -- Cursor subagent filenames used to implement this agent
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Agent Actions ─────────────────────────────────────────────────────────────
-- Immutable log of every action every agent has ever taken.
-- This is the audit trail for accountability and debugging.

CREATE TABLE agent_actions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id      UUID NOT NULL REFERENCES agents(id),
  contact_id    UUID REFERENCES contacts(id),
  event_id      UUID REFERENCES events(id),      -- the event that triggered this action
  action_type   TEXT NOT NULL,
  -- Common values: 'email_sent', 'email_drafted', 'contact_tagged', 'contact_scored',
  --                'call_initiated', 'ticket_created', 'alert_sent', 'escalated'
  input         JSONB DEFAULT '{}',              -- what the agent received
  output        JSONB DEFAULT '{}',              -- what the agent produced
  status        TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'running', 'success', 'failed', 'escalated')),
  confidence    FLOAT,                           -- agent's self-reported confidence (0.0-1.0)
  duration_ms   INTEGER,
  error         TEXT,
  idempotency_key TEXT UNIQUE,                   -- prevents duplicate actions on retry
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX agent_actions_agent_idx ON agent_actions(agent_id);
CREATE INDEX agent_actions_contact_idx ON agent_actions(contact_id);
CREATE INDEX agent_actions_event_idx ON agent_actions(event_id);
CREATE INDEX agent_actions_status_idx ON agent_actions(status);
CREATE INDEX agent_actions_type_idx ON agent_actions(action_type);

-- ── Agent Memory ──────────────────────────────────────────────────────────────
-- Per-contact, per-agent persistent memory with vector embeddings.
-- Agents read their memory at the start of each interaction.

CREATE TABLE agent_memory (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id      UUID NOT NULL REFERENCES agents(id),
  contact_id    UUID NOT NULL REFERENCES contacts(id),
  memory_type   TEXT NOT NULL
    CHECK (memory_type IN ('conversation', 'preference', 'fact', 'note', 'summary')),
  content       TEXT NOT NULL,
  embedding     extensions.vector(1536),
  confidence    FLOAT DEFAULT 1.0,               -- how certain the agent is this is accurate
  source_action UUID REFERENCES agent_actions(id),
  expires_at    TIMESTAMPTZ,                     -- NULL = permanent memory
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agent_id, contact_id, memory_type)      -- one memory slot per type per contact per agent
);

CREATE INDEX agent_memory_agent_contact_idx ON agent_memory(agent_id, contact_id);
CREATE INDEX agent_memory_embedding_idx ON agent_memory
  USING ivfflat (embedding extensions.vector_cosine_ops) WITH (lists = 100);

-- ── Helper Functions ──────────────────────────────────────────────────────────

-- Semantic search over contacts
CREATE OR REPLACE FUNCTION match_contacts(
  query_embedding extensions.vector(1536),
  match_threshold FLOAT DEFAULT 0.75,
  match_count     INT DEFAULT 5
)
RETURNS TABLE (
  id          UUID,
  email       TEXT,
  full_name   TEXT,
  company     TEXT,
  lead_score  INTEGER,
  similarity  FLOAT
)
LANGUAGE sql STABLE AS $$
  SELECT
    id, email, full_name, company, lead_score,
    1 - (embedding <=> query_embedding) AS similarity
  FROM contacts
  WHERE embedding IS NOT NULL
    AND 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Semantic search over emails
CREATE OR REPLACE FUNCTION match_emails(
  query_embedding extensions.vector(1536),
  match_threshold FLOAT DEFAULT 0.75,
  match_count     INT DEFAULT 5
)
RETURNS TABLE (
  id          UUID,
  subject     TEXT,
  direction   TEXT,
  contact_id  UUID,
  similarity  FLOAT
)
LANGUAGE sql STABLE AS $$
  SELECT
    id, subject, direction, contact_id,
    1 - (embedding <=> query_embedding) AS similarity
  FROM emails
  WHERE embedding IS NOT NULL
    AND 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Semantic search over agent memory
CREATE OR REPLACE FUNCTION match_agent_memory(
  p_agent_id      UUID,
  p_contact_id    UUID,
  query_embedding extensions.vector(1536),
  match_threshold FLOAT DEFAULT 0.70,
  match_count     INT DEFAULT 3
)
RETURNS TABLE (
  id           UUID,
  memory_type  TEXT,
  content      TEXT,
  similarity   FLOAT
)
LANGUAGE sql STABLE AS $$
  SELECT
    id, memory_type, content,
    1 - (embedding <=> query_embedding) AS similarity
  FROM agent_memory
  WHERE agent_id = p_agent_id
    AND contact_id = p_contact_id
    AND embedding IS NOT NULL
    AND (expires_at IS NULL OR expires_at > NOW())
    AND 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Get unprocessed events for a specific event type (used by agent triggers)
CREATE OR REPLACE FUNCTION get_unprocessed_events(
  p_event_type TEXT,
  p_limit      INT DEFAULT 50
)
RETURNS SETOF events
LANGUAGE sql STABLE AS $$
  SELECT * FROM events
  WHERE event_type = p_event_type
    AND processed = false
  ORDER BY created_at ASC
  LIMIT p_limit;
$$;

-- Mark an event as processed
CREATE OR REPLACE FUNCTION mark_event_processed(p_event_id UUID)
RETURNS void
LANGUAGE sql AS $$
  UPDATE events
  SET processed = true, processed_at = NOW()
  WHERE id = p_event_id;
$$;

-- ══════════════════════════════════════════════════════════════════════════════
-- Phase 2 Extensions — API Connection Manager, Records, Workers, Outbound Queue
-- Added: 2026-02-22
-- ══════════════════════════════════════════════════════════════════════════════

-- ── Workers ────────────────────────────────────────────────────────────────────
-- Contractors and admins scoped to a specific site.
-- Linked to Supabase Auth users via user_id.

CREATE TABLE workers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id     UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name   TEXT NOT NULL,
  email       TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'worker'
    CHECK (role IN ('admin', 'manager', 'worker')),
  is_active   BOOLEAN DEFAULT true,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(site_id, email)
);

CREATE INDEX workers_site_idx ON workers(site_id);
CREATE INDEX workers_user_idx ON workers(user_id);
CREATE INDEX workers_email_idx ON workers(email);

-- ── Connections ────────────────────────────────────────────────────────────────
-- Third-party API integrations per site (CRMs, Zapier, Slack, accounting, etc.)
-- API keys are stored in Supabase Vault — vault_secret_id is only the secret name.

CREATE TABLE connections (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id           UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  app_name          TEXT NOT NULL,                      -- display name: "HubSpot", "Zapier"
  app_slug          TEXT NOT NULL,                      -- machine key: 'hubspot', 'zapier'
  vault_secret_id   TEXT,                               -- Vault secret name (never plaintext key)
  config            JSONB DEFAULT '{}',                 -- non-secret config (webhook URLs, scopes)
  is_enabled        BOOLEAN DEFAULT true,
  last_sync_at      TIMESTAMPTZ,
  last_sync_status  TEXT CHECK (last_sync_status IN ('success', 'error', 'pending')),
  last_sync_error   TEXT,
  created_by        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(site_id, app_slug)
);

CREATE INDEX connections_site_idx ON connections(site_id);
CREATE INDEX connections_enabled_idx ON connections(is_enabled);

-- ── Records ────────────────────────────────────────────────────────────────────
-- Unified business record storage: quotes, jobs, invoices, bookings, notes, tasks.
-- Tagged by site, worker, contact, and source event.

CREATE TABLE records (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id         UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  worker_id       UUID REFERENCES workers(id) ON DELETE SET NULL,
  contact_id      UUID REFERENCES contacts(id) ON DELETE SET NULL,
  source_event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  record_type     TEXT NOT NULL
    CHECK (record_type IN ('quote', 'job', 'invoice', 'note', 'booking', 'task')),
  status          TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'pending', 'approved', 'completed', 'cancelled')),
  title           TEXT NOT NULL,                        -- human-readable summary
  amount          NUMERIC(12, 2),                       -- dollar value for quotes/invoices
  currency        TEXT DEFAULT 'NZD',
  payload         JSONB NOT NULL DEFAULT '{}',          -- full record data (flexible per type)
  tags            TEXT[] DEFAULT '{}',
  due_at          TIMESTAMPTZ,
  closed_at       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX records_site_idx ON records(site_id);
CREATE INDEX records_worker_idx ON records(worker_id);
CREATE INDEX records_contact_idx ON records(contact_id);
CREATE INDEX records_type_idx ON records(record_type);
CREATE INDEX records_status_idx ON records(status);
CREATE INDEX records_created_idx ON records(created_at DESC);
CREATE INDEX records_site_type_idx ON records(site_id, record_type);
CREATE INDEX records_tags_idx ON records USING GIN(tags);

-- ── Outbound Queue ─────────────────────────────────────────────────────────────
-- Jobs to push data back to sites or external systems.
-- Processed by the mc-send Edge Function (cron, every 1 minute).
-- Exponential backoff: next_attempt_at = NOW() + (2 ^ attempt_count * 30 seconds)

CREATE TABLE outbound_queue (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id           UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  record_id         UUID REFERENCES records(id) ON DELETE SET NULL,
  contact_id        UUID REFERENCES contacts(id) ON DELETE SET NULL,
  delivery_type     TEXT NOT NULL
    CHECK (delivery_type IN ('webhook', 'email', 'sms')),
  destination_url   TEXT,                               -- target URL for webhook delivery
  destination_email TEXT,                               -- target email for email delivery
  payload           JSONB NOT NULL DEFAULT '{}',        -- data to deliver
  status            TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'sending', 'delivered', 'failed', 'cancelled')),
  attempt_count     INTEGER DEFAULT 0,
  max_attempts      INTEGER DEFAULT 5,
  last_attempted_at TIMESTAMPTZ,
  next_attempt_at   TIMESTAMPTZ DEFAULT NOW(),          -- backoff scheduling
  delivered_at      TIMESTAMPTZ,
  error             TEXT,
  created_by_agent  UUID REFERENCES agents(id) ON DELETE SET NULL,
  idempotency_key   TEXT UNIQUE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Partial index for the polling query in mc-send (only pending items that are due)
CREATE INDEX outbound_queue_pending_due_idx ON outbound_queue(next_attempt_at)
  WHERE status = 'pending';
CREATE INDEX outbound_queue_site_idx ON outbound_queue(site_id);
CREATE INDEX outbound_queue_status_idx ON outbound_queue(status);

-- ── Analytics Helper Function ──────────────────────────────────────────────────
-- Called by mc-analytics Edge Function. Returns a single JSON aggregate.

CREATE OR REPLACE FUNCTION analytics_summary(
  p_site_id UUID DEFAULT NULL,          -- NULL = all sites
  p_range_days INT DEFAULT 7
)
RETURNS JSONB
LANGUAGE plpgsql STABLE AS $$
DECLARE
  v_since TIMESTAMPTZ := NOW() - (p_range_days || ' days')::INTERVAL;
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'contacts_total',
      (SELECT COUNT(*) FROM contacts
       WHERE (p_site_id IS NULL OR source_site = p_site_id)),
    'events_in_range',
      (SELECT COUNT(*) FROM events
       WHERE created_at >= v_since
         AND (p_site_id IS NULL OR site_id = p_site_id)),
    'events_unprocessed',
      (SELECT COUNT(*) FROM events
       WHERE processed = false
         AND (p_site_id IS NULL OR site_id = p_site_id)),
    'records_by_type',
      (SELECT COALESCE(jsonb_object_agg(record_type, cnt), '{}')
       FROM (
         SELECT record_type, COUNT(*) AS cnt
         FROM records
         WHERE (p_site_id IS NULL OR site_id = p_site_id)
         GROUP BY record_type
       ) t),
    'agent_actions_by_status',
      (SELECT COALESCE(jsonb_object_agg(status, cnt), '{}')
       FROM (
         SELECT status, COUNT(*) AS cnt
         FROM agent_actions
         WHERE created_at >= v_since
         GROUP BY status
       ) t),
    'agent_failures_last_hour',
      (SELECT COUNT(*) FROM agent_actions
       WHERE status = 'failed'
         AND created_at >= NOW() - INTERVAL '1 hour'),
    'outbound_pending',
      (SELECT COUNT(*) FROM outbound_queue
       WHERE status = 'pending'
         AND (p_site_id IS NULL OR site_id = p_site_id)),
    'outbound_failed',
      (SELECT COUNT(*) FROM outbound_queue
       WHERE status = 'failed'
         AND (p_site_id IS NULL OR site_id = p_site_id)),
    'events_by_day',
      (SELECT COALESCE(jsonb_agg(day_row ORDER BY day ASC), '[]')
       FROM (
         SELECT DATE_TRUNC('day', created_at)::DATE AS day, COUNT(*) AS cnt
         FROM events
         WHERE created_at >= v_since
           AND (p_site_id IS NULL OR site_id = p_site_id)
         GROUP BY DATE_TRUNC('day', created_at)::DATE
       ) day_row),
    'top_workers',
      (SELECT COALESCE(jsonb_agg(w_row ORDER BY record_count DESC), '[]')
       FROM (
         SELECT w.full_name, w.id AS worker_id, COUNT(r.id) AS record_count
         FROM workers w
         LEFT JOIN records r ON r.worker_id = w.id
           AND r.created_at >= v_since
         WHERE (p_site_id IS NULL OR w.site_id = p_site_id)
         GROUP BY w.id, w.full_name
         ORDER BY record_count DESC
         LIMIT 10
       ) w_row)
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- ── Row Level Security ─────────────────────────────────────────────────────────
-- Workers see only their own site's data.
-- Admins (role = 'admin') see all data for all sites they belong to.

ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE records ENABLE ROW LEVEL SECURITY;
ALTER TABLE outbound_queue ENABLE ROW LEVEL SECURITY;

-- Helper: get all site IDs the current user is a worker for
CREATE OR REPLACE FUNCTION auth_user_site_ids()
RETURNS UUID[]
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT ARRAY_AGG(site_id)
  FROM workers
  WHERE user_id = auth.uid()
    AND is_active = true;
$$;

-- workers: users see only workers on their own sites
CREATE POLICY workers_select ON workers
  FOR SELECT USING (site_id = ANY(auth_user_site_ids()));

CREATE POLICY workers_insert ON workers
  FOR INSERT WITH CHECK (site_id = ANY(auth_user_site_ids()));

CREATE POLICY workers_update ON workers
  FOR UPDATE USING (site_id = ANY(auth_user_site_ids()));

-- connections: site workers see their site's connections; only admins/managers can mutate
CREATE POLICY connections_select ON connections
  FOR SELECT USING (site_id = ANY(auth_user_site_ids()));

CREATE POLICY connections_insert ON connections
  FOR INSERT WITH CHECK (
    site_id = ANY(auth_user_site_ids())
    AND EXISTS (
      SELECT 1 FROM workers
      WHERE user_id = auth.uid()
        AND site_id = connections.site_id
        AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY connections_update ON connections
  FOR UPDATE USING (
    site_id = ANY(auth_user_site_ids())
    AND EXISTS (
      SELECT 1 FROM workers
      WHERE user_id = auth.uid()
        AND site_id = connections.site_id
        AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY connections_delete ON connections
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM workers
      WHERE user_id = auth.uid()
        AND site_id = connections.site_id
        AND role = 'admin'
    )
  );

-- records: workers see only records for their site
CREATE POLICY records_select ON records
  FOR SELECT USING (site_id = ANY(auth_user_site_ids()));

CREATE POLICY records_insert ON records
  FOR INSERT WITH CHECK (site_id = ANY(auth_user_site_ids()));

CREATE POLICY records_update ON records
  FOR UPDATE USING (site_id = ANY(auth_user_site_ids()));

-- outbound_queue: site workers can view; only admins can cancel
CREATE POLICY outbound_select ON outbound_queue
  FOR SELECT USING (site_id = ANY(auth_user_site_ids()));

CREATE POLICY outbound_update ON outbound_queue
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM workers
      WHERE user_id = auth.uid()
        AND site_id = outbound_queue.site_id
        AND role IN ('admin', 'manager')
    )
  );

-- ── Outbound Queue Claim Function ─────────────────────────────────────────────
-- Atomically claims a batch of pending outbound_queue items for processing.
-- Uses FOR UPDATE SKIP LOCKED to prevent double-processing under concurrent cron runs.
-- Called by the mc-send Edge Function with service role key.

CREATE OR REPLACE FUNCTION claim_outbound_queue_items(p_batch_size INT DEFAULT 25)
RETURNS SETOF outbound_queue
LANGUAGE sql AS $$
  UPDATE outbound_queue
  SET status = 'sending', updated_at = NOW()
  WHERE id IN (
    SELECT id FROM outbound_queue
    WHERE status = 'pending'
      AND next_attempt_at <= NOW()
    ORDER BY next_attempt_at ASC
    LIMIT p_batch_size
    FOR UPDATE SKIP LOCKED
  )
  RETURNING *;
$$;

-- ── Initial Data — Site Registry ──────────────────────────────────────────────
-- Populate with real site details when connecting each property.

INSERT INTO sites (name, url, purpose, is_active) VALUES
  ('Prime Electrical', 'https://prime-electrical-nu.vercel.app', 'Electrical services, lead generation', true),
  ('AKF Construction', 'https://akf-construction.vercel.app', 'Construction & renovation, lead generation', true),
  ('CleanJet', 'https://cleanjet-phi.vercel.app', 'Cleaning services, online booking', true)
ON CONFLICT (url) DO NOTHING;

-- ── Initial Data — Agent Registry ────────────────────────────────────────────
-- Populate with the agents defined in MissionControl/agent-registry.md

INSERT INTO agents (name, type, description, can_read, can_write, triggers, escalation_condition, timeout_ms, config, cursor_agents) VALUES
(
  'email_responder',
  'email',
  'Reads inbound emails and drafts contextually appropriate replies using contact history and agent memory',
  ARRAY['contacts', 'emails', 'agent_memory', 'events'],
  ARRAY['emails', 'agent_actions', 'agent_memory'],
  ARRAY['email_received'],
  'Confidence < 0.7 OR email topic is complaint, legal, or refund request',
  10000,
  '{"model": "openai/gpt-4o-mini", "max_tokens": 500, "temperature": 0.7}'::jsonb,
  ARRAY['edge-function-developer-fast', 'documentation-manager-fast']
),
(
  'lead_qualifier',
  'qualifier',
  'Scores and tags new contacts from any site based on their event history and profile completeness',
  ARRAY['contacts', 'events', 'agent_memory'],
  ARRAY['contacts', 'agent_actions'],
  ARRAY['form_submit', 'contact_created', 'order_placed'],
  'Lead score > 80 (notify sales immediately) OR contact data is insufficient to score',
  5000,
  '{"model": "openai/gpt-4o-mini", "score_weights": {"company": 20, "phone": 10, "job_title": 15, "event_count": 30}}'::jsonb,
  ARRAY['codebase-scanner-fast', 'database-migration-specialist-fast']
),
(
  'data_monitor',
  'monitor',
  'Watches for anomalies — sites stopping data transmission, unusual event volumes, or agent failure spikes',
  ARRAY['sites', 'events', 'contacts', 'agent_actions'],
  ARRAY['agent_actions'],
  ARRAY['scheduled:15min'],
  'Always alerts human on anomaly — never self-resolves',
  30000,
  '{"check_interval_minutes": 15, "silence_threshold_hours": 2, "failure_spike_threshold": 5}'::jsonb,
  ARRAY['deployment-monitoring-engineer-fast']
),
(
  'voice_intake',
  'voice',
  'Handles inbound voice calls via Vapi.ai, looks up caller by phone number, and routes to appropriate workflow',
  ARRAY['contacts', 'emails', 'agent_memory', 'events'],
  ARRAY['events', 'agent_actions', 'agent_memory'],
  ARRAY['call_initiated'],
  'Caller requests human OR agent confidence < 0.6',
  0,
  '{"vapi_assistant_id": "[CONFIGURE IN VAPI DASHBOARD]", "fallback": "escalate_to_human"}'::jsonb,
  ARRAY['edge-function-developer-fast']
)
ON CONFLICT (name) DO NOTHING;

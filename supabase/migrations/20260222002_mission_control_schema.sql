-- =============================================================================
-- MISSION-CONTROL-001: Mission Control Orchestration Layer
-- Adds: sites, contacts, events, emails, agents, agent_actions, agent_memory
-- Supabase project: tfdxlhkaziskkwwohtwd
-- =============================================================================

-- ── Extensions ────────────────────────────────────────────────────────────────
-- vector already installed in extensions schema by VAPI-001 migration
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ── Sites ─────────────────────────────────────────────────────────────────────
-- Represents each of the 3 business websites feeding data into Mission Control.

CREATE TABLE sites (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT        NOT NULL,
  url            TEXT        NOT NULL UNIQUE,
  purpose        TEXT,
  webhook_secret TEXT,
  is_active      BOOLEAN     DEFAULT true,
  metadata       JSONB       DEFAULT '{}',
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE sites IS 'Registry of the 3 business websites feeding data into Mission Control.';

-- ── Contacts ──────────────────────────────────────────────────────────────────
-- Unified person record — deduplicated by email across all 3 sites.
-- One row per real-world person, regardless of how many sites they appear on.
-- Note: coexists with the existing `customers` Golden Record table.
-- contacts = Mission Control layer; customers = lead-capture layer (legacy).

CREATE TABLE contacts (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT        UNIQUE NOT NULL,
  full_name     TEXT,
  first_name    TEXT,
  last_name     TEXT,
  phone         TEXT,
  company       TEXT,
  job_title     TEXT,
  tags          TEXT[]      DEFAULT '{}',
  lead_score    INTEGER     DEFAULT 0,
  source_site   UUID        REFERENCES sites(id),
  metadata      JSONB       DEFAULT '{}',
  embedding     extensions.vector(1536),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE contacts IS 'Mission Control unified contact record. Deduplicated by email. Coexists with legacy customers table.';
COMMENT ON COLUMN contacts.embedding IS 'OpenAI text-embedding-3-small (1536 dimensions) for semantic search.';

CREATE INDEX contacts_email_idx       ON contacts(email);
CREATE INDEX contacts_tags_idx        ON contacts USING GIN(tags);
CREATE INDEX contacts_lead_score_idx  ON contacts(lead_score DESC);
CREATE INDEX contacts_embedding_idx   ON contacts
  USING ivfflat (embedding extensions.vector_cosine_ops) WITH (lists = 100);

-- ── Events ────────────────────────────────────────────────────────────────────
-- Immutable audit log. One row per thing that happened.
-- NEVER UPDATE — only INSERT. This is the system of record.

CREATE TABLE events (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id       UUID        REFERENCES sites(id),
  contact_id    UUID        REFERENCES contacts(id),
  event_type    TEXT        NOT NULL,
  payload       JSONB       NOT NULL DEFAULT '{}',
  source        TEXT        NOT NULL DEFAULT 'webhook',
  processed     BOOLEAN     DEFAULT false,
  processed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE events IS 'Immutable event log. INSERT only — never update. System of record for all site activity.';
COMMENT ON COLUMN events.event_type IS 'e.g. form_submit, order_placed, email_received, call_initiated, contact_created, agent_triggered';
COMMENT ON COLUMN events.source IS 'Values: webhook, scheduled_pull, email_inbound, agent, manual';

CREATE INDEX events_contact_idx      ON events(contact_id);
CREATE INDEX events_site_idx         ON events(site_id);
CREATE INDEX events_type_idx         ON events(event_type);
CREATE INDEX events_unprocessed_idx  ON events(processed, created_at) WHERE processed = false;

-- Prevent accidental updates to the events table
CREATE RULE events_no_update AS ON UPDATE TO events DO INSTEAD NOTHING;

-- ── Emails ────────────────────────────────────────────────────────────────────

CREATE TABLE emails (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id    UUID        REFERENCES contacts(id),
  direction     TEXT        NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  subject       TEXT,
  body_text     TEXT,
  body_html     TEXT,
  from_address  TEXT        NOT NULL,
  to_address    TEXT        NOT NULL,
  cc_addresses  TEXT[]      DEFAULT '{}',
  status        TEXT        NOT NULL DEFAULT 'received'
    CHECK (status IN ('received', 'draft', 'sent', 'failed', 'bounced')),
  provider_id   TEXT        UNIQUE,
  thread_id     TEXT,
  embedding     extensions.vector(1536),
  metadata      JSONB       DEFAULT '{}',
  sent_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE emails IS 'Inbound and outbound email log for the email_responder agent.';
COMMENT ON COLUMN emails.provider_id IS 'Message ID from email provider (Resend/Postmark) for deduplication.';

CREATE INDEX emails_contact_idx    ON emails(contact_id);
CREATE INDEX emails_direction_idx  ON emails(direction);
CREATE INDEX emails_thread_idx     ON emails(thread_id);
CREATE INDEX emails_status_idx     ON emails(status);
CREATE INDEX emails_embedding_idx   ON emails
  USING ivfflat (embedding extensions.vector_cosine_ops) WITH (lists = 100);

-- ── Agents ────────────────────────────────────────────────────────────────────
-- Registry of all AI agents that live inside Mission Control.
-- Agents declare their capabilities explicitly — least-privilege by design.

CREATE TABLE agents (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 TEXT        NOT NULL UNIQUE,
  type                 TEXT        NOT NULL
    CHECK (type IN ('email', 'voice', 'data', 'monitor', 'qualifier', 'custom')),
  description          TEXT        NOT NULL,
  can_read             TEXT[]      DEFAULT '{}',
  can_write            TEXT[]      DEFAULT '{}',
  triggers             TEXT[]      DEFAULT '{}',
  escalation_condition TEXT,
  timeout_ms           INTEGER     DEFAULT 10000,
  config               JSONB       DEFAULT '{}',
  cursor_agents        TEXT[]      DEFAULT '{}',
  is_active            BOOLEAN     DEFAULT true,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE agents IS 'Registry of all Mission Control AI agents with their declared capabilities and escalation conditions.';

-- ── Agent Actions ─────────────────────────────────────────────────────────────
-- Immutable log of every action every agent has ever taken.
-- This is the audit trail for accountability and debugging.

CREATE TABLE agent_actions (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id         UUID        NOT NULL REFERENCES agents(id),
  contact_id       UUID        REFERENCES contacts(id),
  event_id         UUID        REFERENCES events(id),
  action_type      TEXT        NOT NULL,
  input            JSONB       DEFAULT '{}',
  output           JSONB       DEFAULT '{}',
  status           TEXT        NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'running', 'success', 'failed', 'escalated')),
  confidence       FLOAT,
  duration_ms      INTEGER,
  error            TEXT,
  idempotency_key  TEXT        UNIQUE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE agent_actions IS 'Immutable audit log of every agent action. Used for debugging, confidence tracking, and accountability.';
COMMENT ON COLUMN agent_actions.idempotency_key IS 'Prevents duplicate actions on retry. Format: {agent_name}:{event_id}:{action_type}';

CREATE INDEX agent_actions_agent_idx    ON agent_actions(agent_id);
CREATE INDEX agent_actions_contact_idx  ON agent_actions(contact_id);
CREATE INDEX agent_actions_event_idx    ON agent_actions(event_id);
CREATE INDEX agent_actions_status_idx   ON agent_actions(status);
CREATE INDEX agent_actions_type_idx     ON agent_actions(action_type);

-- ── Agent Memory ──────────────────────────────────────────────────────────────
-- Per-contact, per-agent persistent memory with vector embeddings.
-- Agents read their memory at the start of each interaction.

CREATE TABLE agent_memory (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id       UUID        NOT NULL REFERENCES agents(id),
  contact_id     UUID        NOT NULL REFERENCES contacts(id),
  memory_type    TEXT        NOT NULL
    CHECK (memory_type IN ('conversation', 'preference', 'fact', 'note', 'summary')),
  content        TEXT        NOT NULL,
  embedding      extensions.vector(1536),
  confidence     FLOAT       DEFAULT 1.0,
  source_action  UUID        REFERENCES agent_actions(id),
  expires_at     TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agent_id, contact_id, memory_type)
);

COMMENT ON TABLE agent_memory IS 'Per-agent, per-contact persistent memory. One slot per memory type per contact per agent.';

CREATE INDEX agent_memory_agent_contact_idx  ON agent_memory(agent_id, contact_id);
CREATE INDEX agent_memory_embedding_idx      ON agent_memory
  USING ivfflat (embedding extensions.vector_cosine_ops) WITH (lists = 100);

-- ── Helper Functions ──────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION match_contacts(
  query_embedding  extensions.vector(1536),
  match_threshold  FLOAT DEFAULT 0.75,
  match_count      INT   DEFAULT 5
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

COMMENT ON FUNCTION match_contacts IS 'Cosine similarity search over contact embeddings. Returns contacts above match_threshold.';

CREATE OR REPLACE FUNCTION match_emails(
  query_embedding  extensions.vector(1536),
  match_threshold  FLOAT DEFAULT 0.75,
  match_count      INT   DEFAULT 5
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

CREATE OR REPLACE FUNCTION match_agent_memory(
  p_agent_id       UUID,
  p_contact_id     UUID,
  query_embedding  extensions.vector(1536),
  match_threshold  FLOAT DEFAULT 0.70,
  match_count      INT   DEFAULT 3
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
  WHERE agent_id  = p_agent_id
    AND contact_id = p_contact_id
    AND embedding IS NOT NULL
    AND (expires_at IS NULL OR expires_at > NOW())
    AND 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

CREATE OR REPLACE FUNCTION get_unprocessed_events(
  p_event_type  TEXT,
  p_limit       INT DEFAULT 50
)
RETURNS SETOF events
LANGUAGE sql STABLE AS $$
  SELECT * FROM events
  WHERE event_type = p_event_type
    AND processed  = false
  ORDER BY created_at ASC
  LIMIT p_limit;
$$;

CREATE OR REPLACE FUNCTION mark_event_processed(p_event_id UUID)
RETURNS void
LANGUAGE sql AS $$
  UPDATE events
  SET processed = true, processed_at = NOW()
  WHERE id = p_event_id;
$$;

-- ── RLS ───────────────────────────────────────────────────────────────────────
-- Edge Functions use service_role key — bypasses RLS automatically.
-- Restrict direct client access.

ALTER TABLE sites          ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE events         ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails         ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents         ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_actions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_memory   ENABLE ROW LEVEL SECURITY;

-- ── Initial Data — Site Registry ──────────────────────────────────────────────

INSERT INTO sites (name, url, purpose, is_active) VALUES
  ('Prime Electrical', 'https://prime-electrical-nu.vercel.app', 'Electrical services, lead generation', true),
  ('AKF Construction', 'https://akf-construction.vercel.app',   'Construction & renovation, lead generation', true),
  ('CleanJet',         'https://cleanjet-phi.vercel.app',        'Cleaning services, online booking', true)
ON CONFLICT (url) DO NOTHING;

-- ── Initial Data — Agent Registry ─────────────────────────────────────────────

INSERT INTO agents (name, type, description, can_read, can_write, triggers, escalation_condition, timeout_ms, config, cursor_agents) VALUES
(
  'email_responder', 'email',
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
  'lead_qualifier', 'qualifier',
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
  'data_monitor', 'monitor',
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
  'voice_intake', 'voice',
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

-- =============================================================================
-- VAPI-001: Voice Agent Backend Infrastructure
-- Knowledge Base (pgvector RAG), Call Logging, Idempotency, Conversation Memory
-- Supabase project: tfdxlhkaziskkwwohtwd
-- =============================================================================

-- Enable pgvector for RAG
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- ---------------------------------------------------------------------------
-- TABLE: knowledge_base
-- Stores chunked documents for RAG retrieval. One row per chunk (~512 tokens).
-- Each brand has its own rows, filtered via the 'brand' column.
-- ---------------------------------------------------------------------------
CREATE TABLE knowledge_base (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  brand       text        NOT NULL CHECK (brand IN ('prime', 'akf', 'cleanjet', 'shared')),
  title       text        NOT NULL,
  content     text        NOT NULL,
  embedding   extensions.vector(1536),       -- text-embedding-3-small dimensions
  metadata    jsonb       NOT NULL DEFAULT '{}',
  source      text,                           -- e.g. 'faq', 'pricing', 'services', 'policies'
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE knowledge_base IS 'RAG knowledge base for voice agent. Chunked at ~512 tokens with 50-token overlap.';
COMMENT ON COLUMN knowledge_base.brand IS 'Brand scope: prime | akf | cleanjet | shared (cross-brand facts).';
COMMENT ON COLUMN knowledge_base.embedding IS 'OpenAI text-embedding-3-small (1536 dimensions).';

CREATE INDEX knowledge_base_brand_idx ON knowledge_base (brand);
CREATE INDEX knowledge_base_embedding_idx
  ON knowledge_base
  USING ivfflat (embedding extensions.vector_cosine_ops)
  WITH (lists = 100);

-- ---------------------------------------------------------------------------
-- TABLE: vapi_call_log
-- One row per completed Vapi call. Written by end-of-call-report events.
-- ---------------------------------------------------------------------------
CREATE TABLE vapi_call_log (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  vapi_call_id     text        UNIQUE NOT NULL,
  assistant_id     text        NOT NULL,
  brand            text        CHECK (brand IN ('prime', 'akf', 'cleanjet')),
  caller_number    text,
  transcript       text,
  summary          text,
  duration_seconds integer,
  recording_url    text,
  ended_reason     text,
  lead_id          uuid        REFERENCES leads(id) ON DELETE SET NULL,
  metadata         jsonb       NOT NULL DEFAULT '{}',
  created_at       timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE vapi_call_log IS 'One row per completed Vapi voice call. Transcript and summary from end-of-call-report.';

CREATE INDEX vapi_call_log_assistant_idx ON vapi_call_log (assistant_id);
CREATE INDEX vapi_call_log_brand_idx     ON vapi_call_log (brand);
CREATE INDEX vapi_call_log_created_idx   ON vapi_call_log (created_at DESC);

-- ---------------------------------------------------------------------------
-- TABLE: vapi_tool_calls
-- Idempotency log. Prevents duplicate tool executions when Vapi retries.
-- Key format: '{call_id}:{tool_name}'
-- ---------------------------------------------------------------------------
CREATE TABLE vapi_tool_calls (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key text        UNIQUE NOT NULL,
  result          text        NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE vapi_tool_calls IS 'Idempotency log for Vapi tool calls. Deduplicates Vapi retries.';

CREATE INDEX vapi_tool_calls_key_idx ON vapi_tool_calls (idempotency_key);

-- ---------------------------------------------------------------------------
-- TABLE: vapi_caller_sessions
-- Per-phone-number context for return caller recognition across calls.
-- ---------------------------------------------------------------------------
CREATE TABLE vapi_caller_sessions (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  caller_number  text        UNIQUE NOT NULL,
  last_brand     text        CHECK (last_brand IN ('prime', 'akf', 'cleanjet')),
  call_count     integer     NOT NULL DEFAULT 1,
  last_called_at timestamptz NOT NULL DEFAULT now(),
  context        jsonb       NOT NULL DEFAULT '{}',
  lead_id        uuid        REFERENCES leads(id) ON DELETE SET NULL
);

COMMENT ON TABLE vapi_caller_sessions IS 'Per-caller session memory for return caller recognition.';

-- ---------------------------------------------------------------------------
-- FUNCTION: match_knowledge_base
-- Brand-scoped cosine similarity search via pgvector.
-- Returns speech-safe plain text chunks (no markdown).
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION match_knowledge_base(
  query_embedding  extensions.vector(1536),
  filter_brand     text          DEFAULT NULL,
  match_threshold  float         DEFAULT 0.75,
  match_count      int           DEFAULT 3
)
RETURNS TABLE (
  id          uuid,
  title       text,
  content     text,
  source      text,
  similarity  float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    id,
    title,
    content,
    source,
    1 - (embedding <=> query_embedding) AS similarity
  FROM knowledge_base
  WHERE
    (filter_brand IS NULL OR brand IN (filter_brand, 'shared'))
    AND 1 - (embedding <=> query_embedding) > match_threshold
    AND embedding IS NOT NULL
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

-- ---------------------------------------------------------------------------
-- RLS: Edge Functions use service_role key — bypasses RLS automatically.
-- Restrict direct client access to these tables.
-- ---------------------------------------------------------------------------
ALTER TABLE knowledge_base        ENABLE ROW LEVEL SECURITY;
ALTER TABLE vapi_call_log         ENABLE ROW LEVEL SECURITY;
ALTER TABLE vapi_tool_calls       ENABLE ROW LEVEL SECURITY;
ALTER TABLE vapi_caller_sessions  ENABLE ROW LEVEL SECURITY;

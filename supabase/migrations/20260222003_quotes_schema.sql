-- =============================================================================
-- QUOTES-001: AI Quote Generation System — Prime Group
-- Adds: workers, quotes, quote_line_items
-- Supabase project: tfdxlhkaziskkwwohtwd
-- =============================================================================

-- ── Workers ───────────────────────────────────────────────────────────────────
-- NOTE: workers table already existed (created by mission_control_schema migration).
-- The existing table has role values: 'admin', 'manager', 'worker'
-- Existing workers: 1 per brand (Prime Electrical, AKF Construction, CleanJet)
-- No DDL needed here — quotes.worker_id FKs reference the existing workers table.

-- ── Quotes ────────────────────────────────────────────────────────────────────
-- One row per quote. Shared across all brands — isolated by site_id.
-- FKs to contacts (Mission Control layer), not customers (legacy layer).

CREATE TABLE quotes (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id         UUID        REFERENCES sites(id) ON DELETE SET NULL,
  worker_id       UUID        NOT NULL REFERENCES workers(id),
  contact_id      UUID        REFERENCES contacts(id) ON DELETE SET NULL,
  lead_id         UUID        REFERENCES leads(id) ON DELETE SET NULL,
  status          TEXT        NOT NULL DEFAULT 'draft'
                              CHECK (status IN (
                                'draft', 'pending_review', 'sent',
                                'accepted', 'rejected', 'expired'
                              )),
  total_amount    INTEGER     NOT NULL DEFAULT 0,
  currency        TEXT        NOT NULL DEFAULT 'NZD',
  ai_generated    BOOLEAN     NOT NULL DEFAULT false,
  ai_model        TEXT,
  ai_notes        JSONB       DEFAULT '{}',
  notes           TEXT,
  valid_until     DATE,
  idempotency_key TEXT        UNIQUE,
  -- AKF Construction fields
  consent_required        BOOLEAN DEFAULT false,
  consent_notes           TEXT,
  project_timeline_weeks  INTEGER,
  start_date_estimate     DATE,
  -- CleanJet fields
  service_duration_hours  NUMERIC(4,1),
  cleaners_required       SMALLINT DEFAULT 1,
  subscription_interval   TEXT
                          CHECK (subscription_interval IN (
                            'weekly', 'fortnightly', 'monthly'
                          )),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE quotes IS 'AI-generated and manual quotes. Shared across all brands, isolated by site_id.';
COMMENT ON COLUMN quotes.total_amount IS 'Total in cents. e.g. $150.00 = 15000.';
COMMENT ON COLUMN quotes.idempotency_key IS 'Prevents duplicate quotes from retried Edge Function calls.';
COMMENT ON COLUMN quotes.ai_notes IS 'JSONB blob: enrichment results, upsell suggestions, cross-sell flags, duration estimates.';

CREATE INDEX quotes_site_idx      ON quotes(site_id);
CREATE INDEX quotes_worker_idx    ON quotes(worker_id);
CREATE INDEX quotes_contact_idx   ON quotes(contact_id);
CREATE INDEX quotes_lead_idx      ON quotes(lead_id);
CREATE INDEX quotes_status_idx    ON quotes(status);
CREATE INDEX quotes_created_idx   ON quotes(created_at DESC);

CREATE TRIGGER quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- ── Quote Line Items ──────────────────────────────────────────────────────────

CREATE TABLE quote_line_items (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id    UUID        NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  description TEXT        NOT NULL,
  quantity    NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit_price  INTEGER     NOT NULL DEFAULT 0,
  total       INTEGER     NOT NULL DEFAULT 0,
  sort_order  INTEGER     DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE quote_line_items IS 'Individual line items for each quote. Cascade-deleted with parent quote.';
COMMENT ON COLUMN quote_line_items.total IS 'Must equal quantity × unit_price. Validated in Zod before insert.';

CREATE INDEX quote_line_items_quote_idx ON quote_line_items(quote_id);

ALTER TABLE quote_line_items ENABLE ROW LEVEL SECURITY;

-- ── Helper View ───────────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW quotes_summary AS
  SELECT
    q.id,
    q.site_id,
    s.name            AS site_name,
    q.contact_id,
    c.full_name       AS contact_name,
    c.email           AS contact_email,
    q.worker_id,
    w.full_name       AS worker_name,
    q.status,
    q.total_amount,
    q.currency,
    q.ai_generated,
    q.consent_required,
    q.service_duration_hours,
    q.valid_until,
    q.created_at
  FROM quotes q
  LEFT JOIN sites    s ON s.id = q.site_id
  LEFT JOIN contacts c ON c.id = q.contact_id
  LEFT JOIN workers  w ON w.id = q.worker_id;

COMMENT ON VIEW quotes_summary IS 'Flattened quote view for Mission Control dashboard.';

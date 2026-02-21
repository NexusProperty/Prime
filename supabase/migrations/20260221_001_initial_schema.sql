-- =============================================================================
-- PHASE2-001: United Trades — Central Staging Database
-- "Golden Record" schema connecting Prime Electrical, AKF Construction, CleanJet
-- =============================================================================

-- Enable UUID support (available by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- ENUM TYPES
-- ---------------------------------------------------------------------------

CREATE TYPE site_brand AS ENUM ('prime', 'akf', 'cleanjet');

CREATE TYPE lead_status AS ENUM ('new', 'hot', 'warm', 'cold', 'converted', 'lost');

CREATE TYPE cross_sell_status AS ENUM ('triggered', 'accepted', 'declined', 'pending');

-- ---------------------------------------------------------------------------
-- TABLE: customers — The Golden Record
-- One row per unique customer across all three brands.
-- Matched by phone or email when a new lead arrives.
-- ---------------------------------------------------------------------------

CREATE TABLE customers (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  phone       text        UNIQUE,
  email       text        UNIQUE,
  address     text,
  notes       text,
  -- Array of service keywords across all past interactions, e.g. ['electrical', 'cleaning']
  tags        text[]      NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE customers IS 'Golden Record: one row per unique customer across all three brands.';

-- ---------------------------------------------------------------------------
-- TABLE: leads — One row per form submission or phone enquiry
-- ---------------------------------------------------------------------------

CREATE TABLE leads (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Linked to the Golden Record once phone/email is matched
  customer_id  uuid        REFERENCES customers(id) ON DELETE SET NULL,
  source_site  site_brand  NOT NULL,
  name         text        NOT NULL,
  phone        text,
  email        text,
  message      text,
  service_type text,
  lead_status  lead_status NOT NULL DEFAULT 'new',
  -- GPT-4o enrichment output (cross-sell reasoning, sentiment, urgency)
  ai_notes     text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE leads IS 'Every form submission and phone enquiry from all three websites.';
COMMENT ON COLUMN leads.ai_notes IS 'GPT-4o enrichment: cross-sell reasoning, sentiment, urgency score.';

-- ---------------------------------------------------------------------------
-- TABLE: cross_sell_events — Tracks AI cross-brand suggestions
-- ---------------------------------------------------------------------------

CREATE TABLE cross_sell_events (
  id            uuid              PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id       uuid              NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  source_brand  site_brand        NOT NULL,
  target_brand  site_brand        NOT NULL,
  pitch         text              NOT NULL,
  status        cross_sell_status NOT NULL DEFAULT 'triggered',
  created_at    timestamptz       NOT NULL DEFAULT now()
);

COMMENT ON TABLE cross_sell_events IS 'Tracks every AI-generated cross-brand service suggestion and its outcome.';

-- ---------------------------------------------------------------------------
-- INDEXES — Common query patterns
-- ---------------------------------------------------------------------------

CREATE INDEX leads_source_site_idx       ON leads(source_site);
CREATE INDEX leads_customer_id_idx       ON leads(customer_id);
CREATE INDEX leads_created_at_idx        ON leads(created_at DESC);
CREATE INDEX leads_lead_status_idx       ON leads(lead_status);
CREATE INDEX cross_sell_lead_id_idx      ON cross_sell_events(lead_id);
CREATE INDEX cross_sell_target_brand_idx ON cross_sell_events(target_brand);
CREATE INDEX cross_sell_status_idx       ON cross_sell_events(status);

-- ---------------------------------------------------------------------------
-- TRIGGER: auto-update updated_at on row change
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- Service role (used in API routes) bypasses RLS automatically.
-- Anon/authenticated users (browser) may only INSERT new leads.
-- ---------------------------------------------------------------------------

ALTER TABLE customers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads            ENABLE ROW LEVEL SECURITY;
ALTER TABLE cross_sell_events ENABLE ROW LEVEL SECURITY;

-- Allow website visitors to submit new leads (no read-back of other rows)
CREATE POLICY "anon_can_insert_leads"
  ON leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- PHASE4-001: Job Management Software Sync — Schema Additions
--
-- Adds two tracking columns to the `leads` table so we can record when a
-- converted lead has been pushed to Simpro or Fergus and store the resulting
-- job ID for future reference / deduplication.
-- ---------------------------------------------------------------------------

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS synced_at         timestamptz,
  ADD COLUMN IF NOT EXISTS job_management_id text;

COMMENT ON COLUMN leads.synced_at          IS 'Timestamp when this lead was synced to Simpro/Fergus. NULL = not yet synced.';
COMMENT ON COLUMN leads.job_management_id  IS 'Job ID assigned by Simpro or Fergus after a successful sync.';

-- Index to quickly surface converted-but-unsynced leads for manual review.
CREATE INDEX IF NOT EXISTS leads_unsynced_converted_idx
  ON leads (lead_status)
  WHERE lead_status = 'converted' AND synced_at IS NULL;

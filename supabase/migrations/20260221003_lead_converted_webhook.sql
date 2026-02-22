-- =============================================================================
-- PHASE5-001: Lead-to-Job Sync — Database Webhook via pg_net trigger
--
-- When a lead's status transitions to 'converted', this trigger POSTs the
-- full record payload to Prime Electrical's /api/jobs/sync endpoint.
-- The API route then calls the Simpro or Fergus adapter (jobSync.ts).
--
-- Pre-requisite: pg_net extension must be enabled.
--   CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA extensions;
-- =============================================================================

-- Enable pg_net for outbound HTTP requests from triggers
CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA extensions;

-- ---------------------------------------------------------------------------
-- Trigger function
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.notify_job_sync()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  payload jsonb;
BEGIN
  -- Only fire when lead_status transitions TO 'converted'
  IF NEW.lead_status = 'converted' AND (OLD.lead_status IS DISTINCT FROM 'converted') THEN
    payload := jsonb_build_object(
      'type',       'UPDATE',
      'record',     row_to_json(NEW)::jsonb,
      'old_record', row_to_json(OLD)::jsonb
    );

    PERFORM net.http_post(
      url     := 'https://prime-electrical-nu.vercel.app/api/jobs/sync',
      body    := payload,
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'x-sync-secret', current_setting('app.job_sync_secret', true)
      )
    );
  END IF;

  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- Trigger on leads table
-- ---------------------------------------------------------------------------
DROP TRIGGER IF EXISTS lead_converted_sync ON public.leads;

CREATE TRIGGER lead_converted_sync
  AFTER UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_job_sync();

-- ---------------------------------------------------------------------------
-- Store the webhook secret as a Postgres config setting
-- (avoids hardcoding the secret in the function body for new environments)
-- Run once manually or via env bootstrap:
--   ALTER DATABASE postgres SET app.job_sync_secret = '<JOB_SYNC_WEBHOOK_SECRET>';
-- ---------------------------------------------------------------------------

-- =============================================================================
-- QUOTE-ACCEPT: RLS SELECT policies for quotes and quote_line_items
-- Supabase project: tfdxlhkaziskkwwohtwd
-- Context: RLS is enabled on both tables (20260222003_quotes_schema.sql)
--          but no policies were added. These allow Mission Control dashboard
--          (authenticated users) to read quotes. Edge functions use
--          SUPABASE_SERVICE_ROLE_KEY and bypass RLS.
-- =============================================================================

CREATE POLICY "authenticated_select_quotes"
  ON quotes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "authenticated_select_quote_line_items"
  ON quote_line_items FOR SELECT
  TO authenticated
  USING (true);

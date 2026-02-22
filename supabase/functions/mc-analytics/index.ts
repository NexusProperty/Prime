/**
 * mc-analytics — Dashboard Aggregation
 *
 * Calls the `analytics_summary` DB function and returns structured JSON
 * suitable for the Mission Control dashboard.
 *
 * GET /functions/v1/mc-analytics?site_id=<uuid>&range=7d
 *
 * Query params:
 *   site_id  (optional) — UUID of a specific site; omit for cross-site view
 *   range    (optional) — '1d' | '7d' | '30d' — defaults to '7d'
 *
 * Auth: Supabase JWT required in Authorization header.
 * Response is scoped to the authenticated user's accessible sites via RLS.
 */

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const VALID_RANGES: Record<string, number> = {
  '1d': 1,
  '7d': 7,
  '30d': 30,
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

function errorResponse(message: string, status: number): Response {
  return jsonResponse({ error: message }, status);
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method !== 'GET') {
    return errorResponse('Method Not Allowed', 405);
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return errorResponse('Unauthorized', 401);
  }

  const url = new URL(req.url);
  const siteId = url.searchParams.get('site_id') || null;
  const rangeParam = url.searchParams.get('range') ?? '7d';
  const rangeDays = VALID_RANGES[rangeParam] ?? 7;

  // Validate site_id format if provided
  if (siteId && !/^[0-9a-f-]{36}$/.test(siteId)) {
    return errorResponse('Invalid site_id format', 400);
  }

  // User-scoped client — RLS applies, so user only sees their sites' data
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );

  try {
    const start = Date.now();

    // Call the analytics_summary DB function
    const { data, error } = await supabase
      .rpc('analytics_summary', {
        p_site_id: siteId,
        p_range_days: rangeDays,
      })
      .single();

    if (error) {
      console.error('[mc-analytics][rpc]', error.message);
      return errorResponse('Failed to compute analytics', 500);
    }

    const elapsed = Date.now() - start;
    console.log(`[mc-analytics] site=${siteId ?? 'all'} range=${rangeDays}d elapsed=${elapsed}ms`);

    return jsonResponse({
      summary: data,
      meta: {
        site_id: siteId,
        range_days: rangeDays,
        computed_at: new Date().toISOString(),
        elapsed_ms: elapsed,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[mc-analytics] Unhandled error:', msg);
    return errorResponse('Internal server error', 500);
  }
});

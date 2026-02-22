/**
 * mc-connections — API Connection Manager
 *
 * CRUD gateway for the `connections` table.
 * API keys are stored in Supabase Vault — never in plaintext columns.
 *
 * Routes (method + path suffix after /functions/v1/mc-connections):
 *   GET    /           list connections for caller's sites
 *   POST   /           create a new connection (writes API key to Vault)
 *   PATCH  /:id        update config, toggle enabled, rotate key
 *   DELETE /:id        delete connection and remove Vault secret
 *
 * Auth: Supabase JWT required in Authorization header.
 * RLS on `connections` table enforces site-level access.
 */

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

interface ConnectionCreateBody {
  site_id: string;
  app_name: string;
  app_slug: string;
  api_key?: string;          // written to Vault, not stored in DB
  config?: Record<string, unknown>;
  is_enabled?: boolean;
}

interface ConnectionUpdateBody {
  app_name?: string;
  api_key?: string;          // if provided, rotates the Vault secret
  config?: Record<string, unknown>;
  is_enabled?: boolean;
  last_sync_status?: 'success' | 'error' | 'pending';
  last_sync_error?: string;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function errorResponse(message: string, status: number): Response {
  return jsonResponse({ error: message }, status);
}

function vaultSecretName(siteId: string, appSlug: string): string {
  // Consistent Vault key naming: conn_{slug}_{first8 of siteId}
  return `conn_${appSlug}_${siteId.replace(/-/g, '').slice(0, 8)}`;
}

Deno.serve(async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  // path segments after the function name
  const segments = url.pathname.replace(/^\/functions\/v1\/mc-connections\/?/, '').split('/').filter(Boolean);
  const resourceId = segments[0] ?? null;

  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return errorResponse('Unauthorized', 401);
  }

  // Use user-scoped client so RLS policies apply
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );

  // Service-role client used only for Vault operations (requires elevated access)
  const serviceClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  try {
    // ── GET / — list connections ─────────────────────────────────────────────
    if (req.method === 'GET' && !resourceId) {
      const siteId = url.searchParams.get('site_id');
      let query = supabase
        .from('connections')
        .select('id, site_id, app_name, app_slug, config, is_enabled, last_sync_at, last_sync_status, last_sync_error, created_at')
        .order('app_name');

      if (siteId) query = query.eq('site_id', siteId);

      const { data, error } = await query;
      if (error) {
        console.error('[mc-connections][list]', error.message);
        return errorResponse('Failed to fetch connections', 500);
      }
      return jsonResponse({ connections: data });
    }

    // ── GET /:id — single connection ─────────────────────────────────────────
    if (req.method === 'GET' && resourceId) {
      const { data, error } = await supabase
        .from('connections')
        .select('id, site_id, app_name, app_slug, config, is_enabled, last_sync_at, last_sync_status, last_sync_error, created_at')
        .eq('id', resourceId)
        .single();

      if (error) return errorResponse('Connection not found', 404);
      return jsonResponse({ connection: data });
    }

    // ── POST / — create connection ───────────────────────────────────────────
    if (req.method === 'POST' && !resourceId) {
      let body: ConnectionCreateBody;
      try {
        body = await req.json() as ConnectionCreateBody;
      } catch {
        return errorResponse('Invalid JSON body', 400);
      }

      if (!body.site_id || !body.app_name || !body.app_slug) {
        return errorResponse('site_id, app_name, and app_slug are required', 400);
      }

      let vaultSecretId: string | null = null;

      if (body.api_key) {
        const secretName = vaultSecretName(body.site_id, body.app_slug);
        // Store API key in Supabase Vault
        const { error: vaultErr } = await serviceClient.rpc('vault_upsert_secret', {
          p_name: secretName,
          p_secret: body.api_key,
        }).throwOnError();

        if (vaultErr) {
          console.error('[mc-connections][vault-create]', vaultErr.message);
          return errorResponse('Failed to store API key securely', 500);
        }
        vaultSecretId = secretName;
      }

      const { data, error } = await supabase
        .from('connections')
        .insert({
          site_id: body.site_id,
          app_name: body.app_name,
          app_slug: body.app_slug,
          vault_secret_id: vaultSecretId,
          config: body.config ?? {},
          is_enabled: body.is_enabled ?? true,
        })
        .select('id, site_id, app_name, app_slug, is_enabled, created_at')
        .single();

      if (error) {
        console.error('[mc-connections][create]', error.message);
        const isDuplicate = error.code === '23505';
        return errorResponse(
          isDuplicate ? `Connection for ${body.app_slug} already exists on this site` : 'Failed to create connection',
          isDuplicate ? 409 : 500,
        );
      }

      return jsonResponse({ connection: data }, 201);
    }

    // ── PATCH /:id — update connection ───────────────────────────────────────
    if (req.method === 'PATCH' && resourceId) {
      let body: ConnectionUpdateBody;
      try {
        body = await req.json() as ConnectionUpdateBody;
      } catch {
        return errorResponse('Invalid JSON body', 400);
      }

      // Fetch current row to get vault_secret_id and site_id (RLS-protected)
      const { data: existing, error: fetchErr } = await supabase
        .from('connections')
        .select('vault_secret_id, site_id, app_slug')
        .eq('id', resourceId)
        .single();

      if (fetchErr || !existing) return errorResponse('Connection not found', 404);

      // Rotate Vault secret if new API key provided
      if (body.api_key) {
        const secretName = existing.vault_secret_id
          ?? vaultSecretName(existing.site_id, existing.app_slug);

        const { error: vaultErr } = await serviceClient.rpc('vault_upsert_secret', {
          p_name: secretName,
          p_secret: body.api_key,
        });

        if (vaultErr) {
          console.error('[mc-connections][vault-rotate]', vaultErr.message);
          return errorResponse('Failed to rotate API key', 500);
        }
      }

      const updatePayload: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (body.app_name !== undefined) updatePayload.app_name = body.app_name;
      if (body.config !== undefined) updatePayload.config = body.config;
      if (body.is_enabled !== undefined) updatePayload.is_enabled = body.is_enabled;
      if (body.last_sync_status !== undefined) updatePayload.last_sync_status = body.last_sync_status;
      if (body.last_sync_error !== undefined) updatePayload.last_sync_error = body.last_sync_error;
      if (body.last_sync_status === 'success') updatePayload.last_sync_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('connections')
        .update(updatePayload)
        .eq('id', resourceId)
        .select('id, app_name, app_slug, is_enabled, last_sync_at, last_sync_status, updated_at')
        .single();

      if (error) {
        console.error('[mc-connections][update]', error.message);
        return errorResponse('Failed to update connection', 500);
      }

      return jsonResponse({ connection: data });
    }

    // ── DELETE /:id — delete connection ──────────────────────────────────────
    if (req.method === 'DELETE' && resourceId) {
      const { data: existing, error: fetchErr } = await supabase
        .from('connections')
        .select('vault_secret_id')
        .eq('id', resourceId)
        .single();

      if (fetchErr || !existing) return errorResponse('Connection not found', 404);

      // Remove Vault secret if it exists
      if (existing.vault_secret_id) {
        await serviceClient.rpc('vault_delete_secret', {
          p_name: existing.vault_secret_id,
        }).catch((err: unknown) =>
          console.warn('[mc-connections][vault-delete]', err),
        );
      }

      const { error } = await supabase
        .from('connections')
        .delete()
        .eq('id', resourceId);

      if (error) {
        console.error('[mc-connections][delete]', error.message);
        return errorResponse('Failed to delete connection', 500);
      }

      return jsonResponse({ deleted: true });
    }

    return errorResponse('Not found', 404);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[mc-connections] Unhandled error:', msg);
    return errorResponse('Internal server error', 500);
  }
});

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { timingSafeEqual } from 'node:crypto';
import { ingestFormSubmit, type IngestPayload } from '../_shared/ingest.ts';

function verifySecret(header: string | null, secret: string): boolean {
  if (!header) return false;
  try {
    const expected = new TextEncoder().encode(secret);
    const received = new TextEncoder().encode(header);
    if (expected.byteLength !== received.byteLength) return false;
    return timingSafeEqual(expected, received);
  } catch {
    return false;
  }
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const secret = Deno.env.get('AKF_WEBHOOK_SECRET');
  if (!secret) {
    console.error('[ingest-akf] AKF_WEBHOOK_SECRET not configured');
    return new Response('Internal Server Error', { status: 500 });
  }

  if (!verifySecret(req.headers.get('x-webhook-secret'), secret)) {
    console.warn('[ingest-akf] Invalid webhook secret');
    return new Response('Unauthorized', { status: 401 });
  }

  let body: IngestPayload;
  try {
    body = await req.json() as IngestPayload;
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  if (!body.name) {
    return new Response(
      JSON.stringify({ error: 'name is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  try {
    const result = await ingestFormSubmit(body, 'akf');

    const n8nUrl = Deno.env.get('N8N_WEBHOOK_URL');
    if (n8nUrl && result.leadId !== 'unknown') {
      fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, leadId: result.leadId, brand: 'akf' }),
      }).catch((err: unknown) => console.error('[ingest-akf] n8n error:', err));
    }

    return new Response(
      JSON.stringify({ received: true, ...result }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[ingest-akf] Unhandled error:', msg);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
});

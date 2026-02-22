/**
 * mc-send — Outbound Delivery Processor
 *
 * Processes items from `outbound_queue` and delivers them to target sites
 * or external recipients. Intended to be triggered by a cron schedule
 * (every 1 minute via Supabase Dashboard → Functions → mc-send → Schedule).
 *
 * Delivery types:
 *   'webhook'  — POST payload to destination_url
 *   'email'    — Send via Resend API to destination_email
 *
 * Retry logic: exponential backoff
 *   next_attempt_at = NOW() + (2 ^ attempt_count * 30 seconds)
 *   After max_attempts: status = 'failed', alert logged to agent_actions
 *
 * Uses FOR UPDATE SKIP LOCKED to safely claim items under concurrent execution.
 */

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const BATCH_SIZE = 25;
const BACKOFF_BASE_SECONDS = 30;

interface QueueItem {
  id: string;
  site_id: string;
  record_id: string | null;
  contact_id: string | null;
  delivery_type: 'webhook' | 'email' | 'sms';
  destination_url: string | null;
  destination_email: string | null;
  payload: Record<string, unknown>;
  attempt_count: number;
  max_attempts: number;
  idempotency_key: string | null;
  created_by_agent: string | null;
}

interface ResendEmailPayload {
  from: string;
  to: string[];
  subject: string;
  html?: string;
  text?: string;
}

function nextBackoffAt(attemptCount: number): string {
  const delaySeconds = Math.pow(2, attemptCount) * BACKOFF_BASE_SECONDS;
  const next = new Date(Date.now() + delaySeconds * 1000);
  return next.toISOString();
}

async function deliverWebhook(item: QueueItem): Promise<{ ok: boolean; error?: string }> {
  if (!item.destination_url) {
    return { ok: false, error: 'No destination_url configured for webhook delivery' };
  }

  try {
    const res = await fetch(item.destination_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MissionControl/1.0',
      },
      body: JSON.stringify(item.payload),
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}: ${await res.text().catch(() => '')}` };
    }
    return { ok: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Network error';
    return { ok: false, error: msg };
  }
}

async function deliverEmail(item: QueueItem): Promise<{ ok: boolean; error?: string }> {
  const resendKey = Deno.env.get('RESEND_API_KEY');
  if (!resendKey) return { ok: false, error: 'RESEND_API_KEY not configured' };
  if (!item.destination_email) return { ok: false, error: 'No destination_email configured' };

  const fromAddress = Deno.env.get('RESEND_FROM_ADDRESS') ?? 'Mission Control <no-reply@missioncontrol.ai>';

  const emailBody: ResendEmailPayload = {
    from: fromAddress,
    to: [item.destination_email],
    subject: (item.payload.subject as string) ?? 'Notification from Mission Control',
    html: item.payload.html as string | undefined,
    text: item.payload.text as string | undefined,
  };

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendKey}`,
      },
      body: JSON.stringify(emailBody),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ message: 'Unknown error' }));
      return { ok: false, error: `Resend error: ${(body as { message?: string }).message ?? res.status}` };
    }
    return { ok: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Network error';
    return { ok: false, error: msg };
  }
}

async function logFailedAlert(
  supabase: ReturnType<typeof createClient>,
  item: QueueItem,
  errorMsg: string,
): Promise<void> {
  await supabase.from('agent_actions').insert({
    agent_id: item.created_by_agent,
    action_type: 'alert_sent',
    input: { queue_item_id: item.id, delivery_type: item.delivery_type },
    output: { error: errorMsg, max_attempts_reached: true },
    status: 'failed',
    error: `outbound_queue item ${item.id} permanently failed: ${errorMsg}`,
  }).catch((err: unknown) => console.error('[mc-send][log-alert]', err));
}

Deno.serve(async (_req: Request): Promise<Response> => {
  const serviceClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // Claim pending items using a function that applies FOR UPDATE SKIP LOCKED
  // to prevent double-processing under concurrent cron runs.
  const { data: items, error: claimErr } = await serviceClient
    .rpc('claim_outbound_queue_items', { p_batch_size: BATCH_SIZE });

  if (claimErr) {
    console.error('[mc-send][claim]', claimErr.message);
    return new Response(
      JSON.stringify({ error: 'Failed to claim queue items' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const queueItems = (items ?? []) as QueueItem[];
  if (queueItems.length === 0) {
    return new Response(JSON.stringify({ processed: 0 }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  console.log(`[mc-send] Claimed ${queueItems.length} items`);

  const results = await Promise.allSettled(
    queueItems.map(async (item) => {
      let result: { ok: boolean; error?: string };

      if (item.delivery_type === 'webhook') {
        result = await deliverWebhook(item);
      } else if (item.delivery_type === 'email') {
        result = await deliverEmail(item);
      } else {
        result = { ok: false, error: `Unsupported delivery_type: ${item.delivery_type}` };
      }

      const now = new Date().toISOString();

      if (result.ok) {
        await serviceClient
          .from('outbound_queue')
          .update({
            status: 'delivered',
            delivered_at: now,
            last_attempted_at: now,
            updated_at: now,
          })
          .eq('id', item.id);

        console.log(`[mc-send] ✓ delivered item=${item.id} type=${item.delivery_type}`);
      } else {
        const newAttemptCount = item.attempt_count + 1;
        const isPermanentFailure = newAttemptCount >= item.max_attempts;

        await serviceClient
          .from('outbound_queue')
          .update({
            status: isPermanentFailure ? 'failed' : 'pending',
            attempt_count: newAttemptCount,
            last_attempted_at: now,
            next_attempt_at: isPermanentFailure ? null : nextBackoffAt(newAttemptCount),
            error: result.error ?? 'Unknown delivery error',
            updated_at: now,
          })
          .eq('id', item.id);

        if (isPermanentFailure) {
          await logFailedAlert(serviceClient, item, result.error ?? 'Unknown error');
          console.warn(`[mc-send] ✗ permanent failure item=${item.id}: ${result.error}`);
        } else {
          console.warn(`[mc-send] ✗ retry item=${item.id} attempt=${newAttemptCount}: ${result.error}`);
        }
      }
    }),
  );

  const delivered = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;

  return new Response(
    JSON.stringify({ processed: queueItems.length, delivered, failed }),
    { headers: { 'Content-Type': 'application/json' } },
  );
});

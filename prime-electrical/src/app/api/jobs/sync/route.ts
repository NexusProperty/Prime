// ---------------------------------------------------------------------------
// PHASE4-001: Lead-to-Job Sync — Supabase Webhook Receiver
//
// This endpoint is called by a Supabase Database Webhook whenever a lead row
// is updated.  It filters for `lead_status = 'converted'` transitions and
// calls the job-management adapter (Simpro or Fergus).
//
// Supabase Webhook Setup (Dashboard → Database → Webhooks → Create):
//   Name:        lead_converted
//   Table:       leads
//   Events:      UPDATE
//   HTTP Method: POST
//   URL:         https://prime-electrical-nu.vercel.app/api/jobs/sync
//   Headers:     x-sync-secret: <JOB_SYNC_WEBHOOK_SECRET>
//
// The webhook fires on every UPDATE so we gate on the new status value and
// rely on the adapter's idempotency guard (synced_at check) to prevent
// duplicate jobs if the webhook fires more than once.
// ---------------------------------------------------------------------------

import { NextRequest, NextResponse } from 'next/server'
import { syncLeadToJobManagement } from '@/lib/jobSync'

interface SupabaseWebhookBody {
  type?: string
  record?: { id?: string; lead_status?: string; [key: string]: unknown }
  old_record?: { lead_status?: string; [key: string]: unknown }
}

export async function POST(request: NextRequest) {
  // Authenticate using a shared secret injected as a custom header.
  const secret = request.headers.get('x-sync-secret')
  if (process.env.JOB_SYNC_WEBHOOK_SECRET && secret !== process.env.JOB_SYNC_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: SupabaseWebhookBody
  try {
    body = (await request.json()) as SupabaseWebhookBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const record    = body?.record ?? {}
  const leadId    = record?.id   ?? ''
  const newStatus = record?.lead_status ?? ''

  if (!leadId) {
    return NextResponse.json({ error: 'No lead ID in payload' }, { status: 400 })
  }

  // Only act when the lead has been marked as converted.
  if (newStatus !== 'converted') {
    return NextResponse.json({ ok: true, skipped: true })
  }

  const result = await syncLeadToJobManagement(leadId)

  if (!result.ok) {
    console.error('[api/jobs/sync] Sync failed for lead', leadId, ':', result.error)
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json({ ok: true, jobId: result.jobId ?? null })
}

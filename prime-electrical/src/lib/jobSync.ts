// ---------------------------------------------------------------------------
// PHASE4-001: Job Management Software Sync — Adapter
//
// Supports Simpro and Fergus via the JOB_SYNC_TARGET environment variable:
//   JOB_SYNC_TARGET=simpro  → push converted leads to Simpro
//   JOB_SYNC_TARGET=fergus  → push converted leads to Fergus
//   JOB_SYNC_TARGET=disabled (default) → no-op, useful for local development
//
// After a successful push the adapter writes `synced_at` and
// `job_management_id` back onto the lead row for deduplication.
// ---------------------------------------------------------------------------

import { createServiceClient } from '@/lib/supabase'
import type { LeadRow } from '@/types/database'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SyncTarget = 'simpro' | 'fergus' | 'disabled'

export interface SyncResult {
  ok: boolean
  jobId?: string
  error?: string
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

export async function syncLeadToJobManagement(leadId: string): Promise<SyncResult> {
  const target = (process.env.JOB_SYNC_TARGET ?? 'disabled') as SyncTarget

  if (target === 'disabled') return { ok: true }

  const db = createServiceClient()
  const { data: lead, error } = await db
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single()

  if (error || !lead) return { ok: false, error: 'Lead not found' }

  // Skip if already synced (idempotency guard).
  if (lead.synced_at) return { ok: true, jobId: lead.job_management_id ?? undefined }

  let result: SyncResult

  if (target === 'simpro') result = await pushToSimpro(lead)
  else if (target === 'fergus') result = await pushToFergus(lead)
  else return { ok: false, error: `Unknown sync target: ${target}` }

  if (result.ok && result.jobId) {
    await db
      .from('leads')
      .update({ synced_at: new Date().toISOString(), job_management_id: result.jobId })
      .eq('id', leadId)
  }

  return result
}

// ---------------------------------------------------------------------------
// Simpro adapter — https://developer.simpro.co/
// ---------------------------------------------------------------------------

async function pushToSimpro(lead: LeadRow): Promise<SyncResult> {
  const baseUrl = process.env.SIMPRO_URL      ?? ''
  const apiKey  = process.env.SIMPRO_API_KEY  ?? ''

  const payload = {
    Name:        lead.name,
    Description: lead.message ?? `${lead.service_type ?? 'Enquiry'} from ${lead.source_site}`,
    Site: {
      Name:  lead.name,
      Phone: lead.phone  ?? '',
      Email: lead.email  ?? '',
    },
    CustomFields: [
      { CustomField: { Name: 'Source' },    Value: `United Trades — ${lead.source_site}` },
      { CustomField: { Name: 'AI Notes' },  Value: lead.ai_notes ?? '' },
    ],
  }

  const res = await fetch(`${baseUrl}/api/v1.0/companies/0/jobs/`, {
    method:  'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text()
    return { ok: false, error: `Simpro ${res.status}: ${text}` }
  }

  const data = await res.json() as { ID?: number | string }
  return { ok: true, jobId: String(data?.ID ?? '') }
}

// ---------------------------------------------------------------------------
// Fergus adapter — https://api.fergus.com/
// ---------------------------------------------------------------------------

async function pushToFergus(lead: LeadRow): Promise<SyncResult> {
  const baseUrl = process.env.FERGUS_URL     ?? ''
  const apiKey  = process.env.FERGUS_API_KEY ?? ''

  const nameParts = lead.name.split(' ')
  const payload = {
    contact: {
      firstName:    nameParts[0] ?? lead.name,
      lastName:     nameParts.slice(1).join(' ') || '',
      mobileNumber: lead.phone ?? '',
      email:        lead.email ?? '',
    },
    description:   lead.message ?? `${lead.service_type ?? 'Enquiry'} request`,
    internalNotes: lead.ai_notes ?? '',
    source:        `United Trades — ${lead.source_site}`,
  }

  const res = await fetch(`${baseUrl}/job`, {
    method:  'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text()
    return { ok: false, error: `Fergus ${res.status}: ${text}` }
  }

  const data = await res.json() as { id?: string | number; jobId?: string | number }
  return { ok: true, jobId: String(data?.id ?? data?.jobId ?? '') }
}

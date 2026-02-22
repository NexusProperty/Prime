/**
 * POST /api/leads/submit
 *
 * Proxy to the Mission Control ingest-cleanjet Edge Function.
 * The Edge Function handles: contacts upsert, events log, leads insert, n8n fire.
 */
import { NextRequest, NextResponse } from 'next/server'

const INGEST_URL = 'https://tfdxlhkaziskkwwohtwd.supabase.co/functions/v1/ingest-cleanjet'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, phone, email, message, serviceType } = body as {
    name: string
    phone: string
    email?: string
    message?: string
    serviceType?: string
  }

  if (!name || !phone) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const secret = process.env.CLEANJET_WEBHOOK_SECRET
  if (!secret) {
    console.error('[cleanjet/leads/submit] CLEANJET_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
  }

  const ingestRes = await fetch(INGEST_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-webhook-secret': secret,
    },
    body: JSON.stringify({ name, phone, email, message, serviceType }),
  }).catch((err) => {
    console.error('[cleanjet/leads/submit] ingest-cleanjet fetch error:', err)
    return null
  })

  if (!ingestRes?.ok) {
    console.error('[cleanjet/leads/submit] ingest-cleanjet error:', ingestRes?.status)
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }

  const result = await ingestRes.json() as { leadId: string }
  return NextResponse.json({ leadId: result.leadId })
}

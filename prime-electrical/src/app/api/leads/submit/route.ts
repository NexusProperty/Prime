/**
 * POST /api/leads/submit
 *
 * Thin proxy to the Mission Control ingest-prime Edge Function.
 * The Edge Function handles: contacts upsert, events log, leads insert, n8n fire.
 * This route adds cross-sell detection on top before returning to the client.
 * Returns contactId alongside leadId to enable client-side quote generation.
 */
import { NextRequest, NextResponse } from 'next/server'
import { detectCrossSell } from '@/lib/crossSell'
import type { SiteBrand } from '@/types/database'

const INGEST_URL = 'https://tfdxlhkaziskkwwohtwd.supabase.co/functions/v1/ingest-prime'
const SUPABASE_URL = 'https://tfdxlhkaziskkwwohtwd.supabase.co'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, phone, email, message, serviceType, brand } = body as {
    name: string
    phone: string
    email?: string
    message?: string
    serviceType?: string
    brand: string
  }

  if (!name || !phone) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const secret = process.env.PRIME_WEBHOOK_SECRET
  if (!secret) {
    console.error('[leads/submit] PRIME_WEBHOOK_SECRET not set')
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
    console.error('[leads/submit] ingest-prime fetch error:', err)
    return null
  })

  if (!ingestRes?.ok) {
    console.error('[leads/submit] ingest-prime error:', ingestRes?.status)
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }

  const result = await ingestRes.json() as { leadId: string }

  // Look up contactId by email so the client can call quote-generate-electrical
  let contactId: string | undefined
  if (email) {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (serviceKey) {
      const contactRes = await fetch(
        `${SUPABASE_URL}/rest/v1/contacts?email=eq.${encodeURIComponent(email)}&select=id&limit=1`,
        {
          headers: {
            'apikey': serviceKey,
            'Authorization': `Bearer ${serviceKey}`,
          },
        },
      ).catch(() => null)
      if (contactRes?.ok) {
        const contacts = await contactRes.json() as Array<{ id: string }>
        contactId = contacts[0]?.id
      }
    }
  }

  const crossSell = detectCrossSell(
    (brand ?? 'prime') as SiteBrand,
    serviceType,
    message,
  )

  return NextResponse.json({
    leadId: result.leadId,
    contactId,
    crossSell: crossSell ?? undefined,
  })
}

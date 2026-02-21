/**
 * POST /api/leads/submit
 *
 * Receives form data from LeadCaptureForm, saves a new lead to Supabase,
 * then fires a Make.com webhook so GPT-4o can analyse and enrich the lead.
 *
 * Make.com scenario setup:
 *   1. Create a "Custom Webhook" trigger in Make.com → copy the URL
 *   2. Set MAKE_WEBHOOK_URL in .env.local to that URL
 *   3. The scenario receives this payload and should call GPT-4o, then POST
 *      results back to /api/leads/enrich with header x-enrich-secret: <ENRICH_SECRET>
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import type { SiteBrand } from '@/types/database'
import { detectCrossSell } from '@/lib/crossSell'

const VALID_BRANDS = new Set<string>(['prime', 'akf', 'cleanjet'])

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

  if (!name || !phone || !VALID_BRANDS.has(brand)) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const db = createServiceClient()
  const { data: lead, error } = await db
    .from('leads')
    .insert({
      source_site: brand as SiteBrand,
      name,
      phone,
      email: email ?? null,
      message: message ?? null,
      service_type: serviceType ?? null,
    })
    .select('id')
    .single()

  if (error || !lead) {
    console.error('[leads/submit] Supabase error:', error)
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }

  // Fire-and-forget: trigger Make.com to process the lead with GPT-4o
  const webhookUrl = process.env.MAKE_WEBHOOK_URL
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId: lead.id, name, phone, email, message, serviceType, brand }),
    }).catch((err) => console.error('[leads/submit] Make.com webhook error:', err))
  }

  const crossSell = detectCrossSell(
    brand as SiteBrand,
    serviceType,
    message,
  )

  return NextResponse.json({ leadId: lead.id, crossSell: crossSell ?? undefined })
}

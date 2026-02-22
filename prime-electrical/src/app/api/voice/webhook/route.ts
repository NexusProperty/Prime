/**
 * PHASE3-003 — Vapi.ai Webhook Handler
 *
 * Receives server events from Vapi.ai voice assistants across all 3 brands.
 * Acts only on "end-of-call-report" events.
 *
 * Vapi.ai dashboard setup (one-time):
 *   1. Settings → Server URL: https://theprimeelectrical.co.nz/api/voice/webhook
 *   2. Settings → Server Secret: <set to VAPI_WEBHOOK_SECRET>
 *   3. Create 3 Assistants (Prime, AKF, CleanJet) — see memory-bank/ai-prompts/vapi-*.md
 *   4. Each assistant → Tools → add "escalateEmergency" tool pointing to /api/voice/emergency
 *   5. Connect each assistant to its Twilio phone number in Vapi.ai → Phone Numbers
 *
 * Required env vars: see .env.local.example
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { detectCrossSell } from '@/lib/crossSell'
import type { SiteBrand } from '@/types/database'

/** Maps Vapi.ai assistant UUIDs → brand identifiers. */
function resolveBrand(assistantId: string): SiteBrand {
  const map: Record<string, SiteBrand> = {
    [process.env.VAPI_ASSISTANT_PRIME ?? '']: 'prime',
    [process.env.VAPI_ASSISTANT_AKF ?? '']: 'akf',
    [process.env.VAPI_ASSISTANT_CLEANJET ?? '']: 'cleanjet',
  }
  return map[assistantId] ?? 'prime'
}

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-vapi-secret')
  if (process.env.VAPI_WEBHOOK_SECRET && secret !== process.env.VAPI_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const msg = body?.message ?? body
  const type = msg?.type ?? ''

  // Ignore everything except end-of-call summaries
  if (type !== 'end-of-call-report') {
    return NextResponse.json({ ok: true })
  }

  const callerNumber = msg?.customer?.number ?? ''
  const transcript = msg?.artifact?.transcript ?? ''
  const summary = msg?.analysis?.summary ?? ''
  const assistantId = msg?.call?.assistantId ?? ''
  const brand = resolveBrand(assistantId)

  if (!callerNumber) return NextResponse.json({ ok: true })

  // Persist as a lead in the staging DB
  const db = createServiceClient()
  const { data: lead } = await db
    .from('leads')
    .insert({
      source_site: brand,
      name: 'Voice Caller',
      phone: callerNumber,
      message: transcript,
      service_type: 'Voice Call',
      ai_notes: summary || null,
    })
    .select('id')
    .single()

  // Run instant cross-sell detection on the transcript
  const crossSell = detectCrossSell(brand, 'Voice Call', transcript)
  if (crossSell && lead?.id) {
    await db.from('cross_sell_events').insert({
      lead_id: lead.id,
      source_brand: brand,
      target_brand: crossSell.partnerBrand,
      pitch: crossSell.servicePitch,
      status: 'triggered',
    })
  }

  // Trigger n8n → GPT-4o enrichment (fire-and-forget)
  const webhookUrl = process.env.N8N_WEBHOOK_URL
  if (webhookUrl && lead?.id) {
    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leadId: lead.id,
        name: 'Voice Caller',
        phone: callerNumber,
        message: transcript,
        serviceType: 'Voice Call',
        brand,
      }),
    }).catch(console.error)
  }

  return NextResponse.json({ ok: true })
}

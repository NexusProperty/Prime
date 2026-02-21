/**
 * POST /api/leads/enrich
 *
 * Called by Make.com after GPT-4o has analysed a lead.
 * Updates the lead's ai_notes and records a cross_sell_event if detected.
 *
 * Expected JSON payload from Make.com:
 * {
 *   leadId: string
 *   aiNotes: string          // GPT-4o summary
 *   crossSell?: {
 *     partnerBrand: 'prime' | 'akf' | 'cleanjet'
 *     servicePitch: string
 *   }
 * }
 *
 * Security: Make.com must send header  x-enrich-secret: <ENRICH_SECRET>
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import type { SiteBrand } from '@/types/database'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-enrich-secret')
  if (!process.env.ENRICH_SECRET || secret !== process.env.ENRICH_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { leadId, aiNotes, crossSell } = (await request.json()) as {
    leadId: string
    aiNotes?: string
    crossSell?: { partnerBrand: SiteBrand; servicePitch: string }
  }

  if (!leadId) {
    return NextResponse.json({ error: 'leadId required' }, { status: 400 })
  }

  const db = createServiceClient()

  if (aiNotes) {
    await db.from('leads').update({ ai_notes: aiNotes }).eq('id', leadId)
  }

  if (crossSell?.partnerBrand && crossSell?.servicePitch) {
    const { data: lead } = await db
      .from('leads')
      .select('source_site')
      .eq('id', leadId)
      .single()

    if (lead) {
      await db.from('cross_sell_events').insert({
        lead_id: leadId,
        source_brand: lead.source_site,
        target_brand: crossSell.partnerBrand,
        pitch: crossSell.servicePitch,
        status: 'triggered',
      })
    }
  }

  return NextResponse.json({ ok: true })
}

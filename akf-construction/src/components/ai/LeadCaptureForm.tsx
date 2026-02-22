'use client'

import { useState } from 'react'
import { FormFields, AIProcessingOverlay, CrossSellPromptCard } from '@prime/ui-ai'
import type { Brand, FormState, CrossSellState, CrossSellData, LeadFormData } from '@prime/ui-ai'

interface Props {
  brand: Brand
  onSubmit?: (data: LeadFormData) => void
  crossSellData?: CrossSellData
}

interface QuoteData {
  quote_id: string
  total_amount: number
  line_items: Array<{ description: string; quantity: number; unit_price: number; total: number }>
  consent_required?: boolean
  consent_notes?: string | null
}

function detectAKFServiceType(
  serviceType: string | undefined,
): 'renovation' | 'deck' | 'new_build' | 'fencing' | 'landscaping' {
  const s = (serviceType ?? '').toLowerCase()
  if (s.includes('deck')) return 'deck'
  if (s.includes('fence') || s.includes('fencing') || s.includes('boundary')) return 'fencing'
  if (s.includes('new build') || s.includes('extension') || s.includes('addition')) return 'new_build'
  if (s.includes('landscape') || s.includes('garden') || s.includes('driveway')) return 'landscaping'
  return 'renovation'
}

export function LeadCaptureForm({ brand, onSubmit, crossSellData }: Props) {
  const [state, setState] = useState<FormState>('idle')
  const [csState, setCsState] = useState<CrossSellState>('hidden')
  const [activeCrossData, setActiveCrossData] = useState<CrossSellData | null>(null)
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null)
  const [pendingState, setPendingState] = useState<'cross_sell_triggered' | 'confirmed'>('confirmed')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const data: LeadFormData = {
      name: fd.get('name') as string,
      phone: fd.get('phone') as string,
      email: fd.get('email') as string,
      message: fd.get('message') as string,
      serviceType: fd.get('serviceType') as string,
    }
    setState('submitting')
    setState('ai_processing')

    try {
      const res = await fetch('/api/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, brand }),
      })
      if (!res.ok) throw new Error('Submit failed')

      const result = await res.json() as {
        leadId: string
        contactId?: string
        crossSell?: CrossSellData
      }

      const crossSell = result.crossSell ?? crossSellData ?? null
      const next: 'cross_sell_triggered' | 'confirmed' = crossSell ? 'cross_sell_triggered' : 'confirmed'
      setPendingState(next)
      if (crossSell) setActiveCrossData(crossSell)
      onSubmit?.(data)

      // Attempt AI quote generation
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      const siteId = process.env.NEXT_PUBLIC_AKF_SITE_ID
      const workerId = process.env.NEXT_PUBLIC_DEFAULT_WORKER_ID

      if (supabaseUrl && anonKey && siteId && workerId && result.contactId && data.message) {
        const quoteRes = await fetch(`${supabaseUrl}/functions/v1/quote-generate-akf`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${anonKey}`,
          },
          body: JSON.stringify({
            job_description: data.message,
            service_type: detectAKFServiceType(data.serviceType),
            site_id: siteId,
            worker_id: workerId,
            contact_id: result.contactId,
            lead_id: result.leadId ?? undefined,
            idempotency_key: `lead-${result.leadId}`,
          }),
        }).catch(() => null)

        if (quoteRes?.ok) {
          const quoteJson = await quoteRes.json() as { data: QuoteData | null; error: string | null }
          if (quoteJson.data) {
            setQuoteData(quoteJson.data)
            setState('quote_preview')
            return
          }
        }
      }

      // Fallback: skip quote preview
      if (crossSell) {
        setState('cross_sell_triggered')
        setCsState('appearing')
        setTimeout(() => setCsState('visible'), 50)
      } else {
        setState('confirmed')
      }
    } catch {
      setState('idle')
    }
  }

  if (state === 'confirmed' || state === 'confirmed_with_crosssell') {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <p className="text-lg font-semibold text-emerald-700">✓ Request received!</p>
        <p className="mt-2 text-sm text-slate-500">We&apos;ll be in touch within 2 business hours.</p>
        {state === 'confirmed_with_crosssell' && (
          <p className="mt-2 text-sm font-medium text-emerald-600">Bundle enquiry forwarded ✓</p>
        )}
      </div>
    )
  }

  if (state === 'ai_processing') {
    return <AIProcessingOverlay brand={brand} message="Our AI is reviewing your request and checking for service bundles…" />
  }

  if (state === 'quote_preview' && quoteData) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
        <div className="mb-1 text-sm font-medium text-amber-700 uppercase tracking-wide">
          Your Instant Estimate
        </div>
        <div className="text-4xl font-bold text-amber-900 tracking-tight">
          ${(quoteData.total_amount / 100).toLocaleString('en-NZ', { maximumFractionDigits: 0 })}
        </div>
        <div className="mt-1 text-sm text-amber-700">NZD · {quoteData.line_items.length} line items</div>
        {quoteData.consent_required && (
          <div className="mt-3 rounded-lg border border-amber-300 bg-amber-100 p-3 text-left">
            <p className="text-xs font-semibold text-amber-800">📋 Building Consent Required</p>
            <p className="mt-0.5 text-xs text-amber-700">
              This project likely requires Auckland Council building consent.
              Estimated fee is included in your quote. AKF handles the full application.
            </p>
          </div>
        )}
        <p className="mt-3 text-xs text-amber-600">
          Estimate only — final price confirmed after site assessment.
          Full itemised quote sent to your email shortly.
        </p>
        <button
          onClick={() => {
            if (pendingState === 'cross_sell_triggered' && activeCrossData) {
              setState('cross_sell_triggered')
              setCsState('appearing')
              setTimeout(() => setCsState('visible'), 50)
            } else {
              setState('confirmed')
            }
          }}
          className="mt-4 rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition-colors"
        >
          Continue →
        </button>
      </div>
    )
  }

  if (state === 'cross_sell_triggered' && activeCrossData) {
    return (
      <CrossSellPromptCard
        brand={brand}
        state={csState}
        data={activeCrossData}
        onAccept={() => { setCsState('accepted'); setState('confirmed_with_crosssell') }}
        onDecline={() => { setCsState('declined'); setState('confirmed') }}
      />
    )
  }

  return <FormFields brand={brand} disabled={state === 'submitting'} onSubmit={handleSubmit} />
}

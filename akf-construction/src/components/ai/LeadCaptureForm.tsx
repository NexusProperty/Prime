'use client'

import { useState } from 'react'
import { FormFields, AIProcessingOverlay, CrossSellPromptCard } from '@prime/ui-ai'
import type { Brand, FormState, CrossSellState, CrossSellData, LeadFormData } from '@prime/ui-ai'

interface Props {
  brand: Brand
  onSubmit?: (data: LeadFormData) => void
  crossSellData?: CrossSellData
}

export function LeadCaptureForm({ brand, onSubmit, crossSellData }: Props) {
  const [state, setState] = useState<FormState>('idle')
  const [csState, setCsState] = useState<CrossSellState>('hidden')

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
    await new Promise((r) => setTimeout(r, 500))
    setState('ai_processing')
    await new Promise((r) => setTimeout(r, 2000))
    if (crossSellData) {
      setState('cross_sell_triggered')
      setCsState('appearing')
      setTimeout(() => setCsState('visible'), 50)
    } else {
      setState('confirmed')
    }
    onSubmit?.(data)
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

  if (state === 'cross_sell_triggered' && crossSellData) {
    return (
      <CrossSellPromptCard
        brand={brand}
        state={csState}
        data={crossSellData}
        onAccept={() => { setCsState('accepted'); setState('confirmed_with_crosssell') }}
        onDecline={() => { setCsState('declined'); setState('confirmed') }}
      />
    )
  }

  return <FormFields brand={brand} disabled={state === 'submitting'} onSubmit={handleSubmit} />
}

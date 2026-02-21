'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

const MESSAGES = {
  'prime-electrical': {
    headline: 'Just had electrical work done?',
    body: 'Electrical installations create dust and debris. Book a post-install dust-down — we specialise in it.',
    cta: 'Book Now — $99',
  },
  'akf-construction': {
    headline: 'Project just completed?',
    body: 'Post-build cleans from $149. We remove construction dust, debris, and residue professionally.',
    cta: 'Book Post-Build Clean',
  },
} as const

type Referrer = keyof typeof MESSAGES

function AIUpsellCardInner() {
  const params = useSearchParams()
  const ref = params.get('ref') as Referrer | null
  const [dismissed, setDismissed] = useState(false)

  if (!ref || !(ref in MESSAGES) || dismissed) return null

  const msg = MESSAGES[ref]

  return (
    <div className="border-l-4 border-cyan-500 bg-cyan-50">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <span className="shrink-0 text-xs font-bold text-violet-700">✦ AI Tip</span>
            <div>
              <p className="text-sm font-semibold text-slate-900">{msg.headline}</p>
              <p className="mt-0.5 text-sm text-slate-600">{msg.body}</p>
              <a
                href="#booking"
                className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-cyan-600 hover:text-cyan-700"
              >
                {msg.cta} →
              </a>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="shrink-0 text-lg leading-none text-slate-400 hover:text-slate-600"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}

export function AIUpsellCard() {
  return (
    <Suspense fallback={null}>
      <AIUpsellCardInner />
    </Suspense>
  )
}

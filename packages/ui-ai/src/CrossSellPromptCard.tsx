'use client'

import clsx from 'clsx'
import { brandConfig } from './brandConfig'
import type { Brand, CrossSellState, CrossSellData } from './types'

interface Props {
  brand: Brand
  state: CrossSellState
  data: CrossSellData
  onAccept: () => void
  onDecline: () => void
}

export function CrossSellPromptCard({ brand: _brand, state, data, onAccept, onDecline }: Props) {
  const partner = brandConfig[data.partnerBrand]

  if (state === 'hidden' || state === 'declined') return null

  if (state === 'accepted') {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
        ✓ {partner.label} added to your enquiry
      </div>
    )
  }

  return (
    <div
      role="dialog"
      aria-label={`AI recommendation: Add ${partner.label} to your enquiry`}
      className={clsx(
        'rounded-xl border border-slate-200 bg-white p-5 shadow-md transition-all duration-300',
        state === 'appearing' ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100',
      )}
    >
      <div className="mb-3">
        <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-semibold text-violet-700">
          ✦ AI Recommendation
        </span>
      </div>
      <p className="font-semibold text-slate-900">{partner.label}</p>
      <p className="mt-1.5 text-sm text-slate-500">
        {data.servicePitch}
        {data.price && <span className="ml-1 font-semibold text-slate-700">{data.price}</span>}
      </p>
      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={onAccept}
          className={clsx(
            'flex-1 rounded-lg py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90',
            partner.bg,
          )}
        >
          Yes, include {partner.label}
        </button>
        <button onClick={onDecline} className="text-sm text-slate-400 underline hover:text-slate-600">
          No thanks
        </button>
      </div>
    </div>
  )
}

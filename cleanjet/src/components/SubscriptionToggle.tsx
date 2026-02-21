'use client'

import { useState } from 'react'
import clsx from 'clsx'

export function SubscriptionToggle({ basePrice = 99 }: { basePrice?: number }) {
  const [isSubscription, setIsSubscription] = useState(false)
  const weeklyPrice = Math.round(basePrice * 0.8)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-slate-400">
        Choose your plan
      </p>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setIsSubscription(false)}
          className={clsx(
            'rounded-xl border p-4 text-left transition-all',
            !isSubscription ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200 hover:border-slate-300',
          )}
        >
          <p className="font-bold text-slate-900">One-off</p>
          <p
            className={clsx(
              'mt-1 text-2xl font-bold transition-opacity duration-200',
              !isSubscription ? 'opacity-100' : 'opacity-50',
            )}
          >
            ${basePrice}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">per visit</p>
        </button>
        <button
          onClick={() => setIsSubscription(true)}
          className={clsx(
            'relative rounded-xl border p-4 text-left transition-all',
            isSubscription ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200 hover:border-slate-300',
          )}
        >
          {isSubscription && (
            <span className="absolute right-2 top-2 rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-bold text-cyan-700">
              SAVE 20%
            </span>
          )}
          <p className="font-bold text-slate-900">Weekly</p>
          <p
            className={clsx(
              'mt-1 text-2xl font-bold transition-opacity duration-200',
              isSubscription ? 'opacity-100' : 'opacity-50',
            )}
          >
            ${weeklyPrice}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">per visit</p>
        </button>
      </div>
    </div>
  )
}

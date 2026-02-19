'use client'

import { useState } from 'react'
import { Button } from '@/components/Button'

const PRICING = {
  'one-off': { '1-2': 99, '3-4': 149, '5+': 199 },
  weekly: { '1-2': 79, '3-4': 119, '5+': 159 },
} as const

type BedroomKey = '1-2' | '3-4' | '5+'
type FrequencyKey = 'one-off' | 'weekly'

const trustBadges = [
  {
    icon: (
      <svg aria-hidden="true" className="h-5 w-5 text-sky-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
      </svg>
    ),
    label: 'Vetted & insured',
  },
  {
    icon: (
      <svg aria-hidden="true" className="h-5 w-5 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20c9 0 11-9 11-9s-3 3-8.01 4.02C12.39 13.6 12 12.84 12 12c0-2.21 2.24-4 5-4z" />
      </svg>
    ),
    label: 'Eco-friendly products',
  },
  {
    icon: (
      <svg aria-hidden="true" className="h-5 w-5 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ),
    label: '100% satisfaction guarantee',
  },
  {
    icon: (
      <svg aria-hidden="true" className="h-5 w-5 text-slate-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
      </svg>
    ),
    label: 'No lock-in contracts',
  },
]

export function Hero() {
  const [bedrooms, setBedrooms] = useState<BedroomKey>('3-4')
  const [frequency, setFrequency] = useState<FrequencyKey>('one-off')

  const price = PRICING[frequency][bedrooms]

  return (
    <section className="overflow-hidden bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">

          {/* Left — headline + trust */}
          <div className="flex-1">
            {/* Review count — MyClean pattern */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                {[
                  'bg-sky-400',
                  'bg-emerald-400',
                  'bg-amber-400',
                  'bg-violet-400',
                  'bg-pink-400',
                ].map((color, i) => (
                  <div
                    key={i}
                    className={`h-7 w-7 rounded-full ${color} ring-2 ring-white flex items-center justify-center`}
                  >
                    <span className="text-xs font-bold text-white">
                      {['S', 'J', 'M', 'A', 'P'][i]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-semibold text-slate-900">5.0</span>
                <span className="text-sm text-slate-500">· 200+ verified reviews</span>
              </div>
            </div>

            <h1 className="mt-6 font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Auckland home cleaning.{' '}
              <span className="text-sky-600">Book in 60 seconds.</span>
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              We clean. You relax. Vetted, insured professionals delivering
              sparkling results across Auckland — with a 100% satisfaction
              guarantee or we reclean for free.
            </p>

            {/* Trust badges grid */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {trustBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-4 py-3"
                >
                  {badge.icon}
                  <span className="text-sm font-medium text-slate-700">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Stats row — CleanBoss inspired */}
            <div className="mt-10 grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-200 pt-8">
              {[
                { value: '200+', label: 'Homes cleaned' },
                { value: '100%', label: 'Satisfaction rate' },
                { value: '5★', label: 'Average rating' },
              ].map((stat) => (
                <div key={stat.label} className="px-4 first:pl-0 last:pr-0">
                  <p className="font-display text-2xl font-semibold text-sky-600">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — live pricing calculator card (MyClean booking widget pattern) */}
          <div className="flex-1 lg:max-w-md">
            <div className="rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-slate-900/10">
              {/* Promo badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-1.5 ring-1 ring-sky-200">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                <span className="text-sm font-medium text-sky-700">
                  🎉 First clean 20% off — book before Friday
                </span>
              </div>

              <h2 className="font-display text-xl font-semibold text-slate-900">
                Get an instant price
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                No obligation. Takes 30 seconds.
              </p>

              {/* Bedrooms */}
              <div className="mt-6">
                <p className="mb-2 text-sm font-semibold text-slate-700">
                  How many bedrooms?
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(['1-2', '3-4', '5+'] as BedroomKey[]).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setBedrooms(opt)}
                      className={`rounded-xl py-3 text-sm font-semibold transition-all ${
                        bedrooms === opt
                          ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {opt} bed
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency */}
              <div className="mt-5">
                <p className="mb-2 text-sm font-semibold text-slate-700">
                  How often?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { key: 'one-off', label: 'One-off clean', sub: '' },
                      { key: 'weekly', label: 'Weekly', sub: 'Save ~20%' },
                    ] as { key: FrequencyKey; label: string; sub: string }[]
                  ).map(({ key, label, sub }) => (
                    <button
                      key={key}
                      onClick={() => setFrequency(key)}
                      className={`rounded-xl py-3 text-sm font-semibold transition-all ${
                        frequency === key
                          ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {label}
                      {sub && (
                        <span className="ml-1 block text-xs font-normal opacity-80">
                          {sub}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price display */}
              <div className="mt-6 flex items-end justify-between rounded-2xl bg-slate-50 px-5 py-4">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                    Estimated price
                  </p>
                  <p className="mt-1 font-display text-4xl font-semibold text-slate-900">
                    ${price}
                    <span className="ml-1 text-lg font-normal text-slate-500">
                      NZD
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Includes GST ·{' '}
                    {frequency === 'weekly'
                      ? 'billed fortnightly'
                      : 'one-time payment'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                    ✓ Eco products
                  </span>
                </div>
              </div>

              <Button href="#booking" color="blue" className="mt-4 w-full justify-center">
                Book This Clean →
              </Button>

              <p className="mt-3 text-center text-xs text-slate-500">
                Cancel or reschedule any time · No lock-in
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

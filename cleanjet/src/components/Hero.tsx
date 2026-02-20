'use client'

import { useState } from 'react'
import { Button } from '@/components/Button'

const PRICING = {
  'one-off': { '1-2': 99, '3-4': 149, '5+': 199 },
  'weekly': { '1-2': 79, '3-4': 119, '5+': 159 },
  'fortnightly': { '1-2': 89, '3-4': 129, '5+': 179 },
} as const

type BedroomKey = '1-2' | '3-4' | '5+'
type FrequencyKey = 'one-off' | 'weekly' | 'fortnightly'

export function Hero() {
  const [bedrooms, setBedrooms] = useState<BedroomKey>('3-4')
  const [frequency, setFrequency] = useState<FrequencyKey>('weekly')
  
  const price = PRICING[frequency][bedrooms]

  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-slate-50 border-b border-slate-200 pt-20 pb-16">
      
      {/* Pristine Architectural Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-multiply"
        style={{
          // Bright, sun-drenched living space placeholder
          backgroundImage: 'url("https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop")',
        }}
        aria-hidden="true"
      />

      {/* Subtle Medical/Clinical Grid */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-20">
          
          {/* Left Text / Value Prop */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                Auckland Coverage Active
              </span>
            </div>

            <h1 className="font-display text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl lg:text-[5rem] leading-[1.1]">
              Pristine. <br />
              <span className="text-sky-500">Professional.</span> <br />
              Guaranteed.
            </h1>
            
            <p className="mt-6 max-w-2xl text-lg font-medium text-slate-600 mx-auto lg:mx-0">
              Meticulous residential cleaning by fully vetted professionals. We use clinical-grade, eco-friendly products for a flawless, sterile finish.
            </p>

            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
              {[
                { label: 'Police Vetted Staff', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                { label: 'Eco-Certified Products', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                { label: '100% Satisfaction', icon: 'M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.514' }
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 bg-white px-4 py-2 rounded-none border border-slate-200 shadow-sm">
                  <svg className="h-5 w-5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d={badge.icon} />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-700">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Clinical Booking Form */}
          <div className="flex-1 w-full lg:max-w-md">
            <div className="bg-white p-8 border-t-4 border-sky-500 shadow-2xl rounded-none relative overflow-hidden">
              {/* Clinical accent top corner */}
              <div className="absolute top-0 right-0 h-16 w-16 bg-sky-50/50 pointer-events-none" />

              <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-slate-900 mb-2">
                Service Request
              </h2>
              <p className="text-sm font-medium text-slate-500 mb-8">
                Configure your clean. Instant verified pricing.
              </p>

              {/* Bedrooms Toggle */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-700 mb-3">
                  Property Size (Bedrooms)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['1-2', '3-4', '5+'] as BedroomKey[]).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setBedrooms(opt)}
                      className={`h-12 text-sm font-bold transition-colors border rounded-none ${
                        bedrooms === opt
                          ? 'bg-sky-50 border-sky-500 text-sky-700'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency Toggle */}
              <div className="mb-8">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-700 mb-3">
                  Service Interval
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { key: 'one-off', label: 'One-off' },
                      { key: 'fortnightly', label: 'Bi-Weekly' },
                      { key: 'weekly', label: 'Weekly' },
                    ] as { key: FrequencyKey; label: string }[]
                  ).map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setFrequency(key)}
                      className={`h-12 text-xs font-bold uppercase tracking-wider transition-colors border rounded-none ${
                        frequency === key
                          ? 'bg-sky-50 border-sky-500 text-sky-700'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing Display */}
              <div className="flex items-center justify-between border-t border-slate-200 pt-6 mb-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Verified Estimate
                  </p>
                  <div className="flex items-baseline gap-1 text-slate-900">
                    <span className="text-4xl font-display font-bold tabular-nums tracking-tight">
                      ${price}
                    </span>
                    <span className="text-sm font-bold text-slate-500">NZD</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Taxes
                  </p>
                  <p className="text-xs font-bold text-slate-600">GST Included</p>
                </div>
              </div>

              <Button href="#booking" color="blue" className="w-full h-14 !rounded-none !bg-sky-500 hover:!bg-sky-600 uppercase tracking-widest text-sm font-bold flex justify-center items-center gap-2">
                Confirm Booking
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Button>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}

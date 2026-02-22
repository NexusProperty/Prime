'use client'

import { useState } from 'react'
import { WizardProgressBar } from './BookingWizard/WizardProgressBar'
import { RoomSelector } from './BookingWizard/RoomSelector'
import { DatePicker } from './BookingWizard/DatePicker'
import { ConfirmReview } from './BookingWizard/ConfirmReview'

interface RoomSel { rooms: string; extras: string[]; basePrice: number }
interface DateSel { date: Date; timeSlot: string }

type CustomServiceType = 'post_build' | 'end_of_tenancy' | 'deep_clean_custom' | 'commercial'
type CustomStep = 'form' | 'loading' | 'result'

interface CustomQuoteResult {
  total_amount: number
  duration_hours?: number
  recommended_service?: string
  line_items: Array<{ description: string; quantity: number; unit_price: number; total: number }>
}

const CUSTOM_SERVICE_LABELS: Record<CustomServiceType, string> = {
  post_build: '🏗 Post-Build Clean',
  end_of_tenancy: '🔑 End of Tenancy',
  deep_clean_custom: '✨ Custom Deep Clean',
  commercial: '🏢 Commercial',
}

const SUPABASE_FUNCTIONS_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1`
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const CLEANJET_SITE_ID = process.env.NEXT_PUBLIC_CLEANJET_SITE_ID
const DEFAULT_WORKER_ID = process.env.NEXT_PUBLIC_DEFAULT_WORKER_ID

export function BookingWizard() {
  // Standard flow state
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [roomSel, setRoomSel] = useState<RoomSel | null>(null)
  const [dateSel, setDateSel] = useState<DateSel | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  // Custom quote flow state
  const [mode, setMode] = useState<'standard' | 'custom'>('standard')
  const [customStep, setCustomStep] = useState<CustomStep>('form')
  const [customServiceType, setCustomServiceType] = useState<CustomServiceType>('post_build')
  const [customBedrooms, setCustomBedrooms] = useState(3)
  const [customDescription, setCustomDescription] = useState('')
  const [customQuoteResult, setCustomQuoteResult] = useState<CustomQuoteResult | null>(null)
  const [customError, setCustomError] = useState<string | null>(null)

  const handleGetCustomQuote = async () => {
    if (customDescription.length < 10) return
    setCustomStep('loading')
    setCustomError(null)

    try {
      const endpoint = customServiceType === 'post_build'
        ? `${SUPABASE_FUNCTIONS_URL}/calculate-post-build-price`
        : `${SUPABASE_FUNCTIONS_URL}/generate-cleaning-quote`

      const body = customServiceType === 'post_build'
        ? {
            renovation_type: ['renovation'],
            property_bedrooms: customBedrooms,
            construction_dust_level: 'medium' as const,
            extras_needed: [],
            site_id: CLEANJET_SITE_ID,
            worker_id: DEFAULT_WORKER_ID,
          }
        : {
            job_description: customDescription,
            service_type: customServiceType,
            property_type: 'house' as const,
            bedrooms: customBedrooms,
            site_id: CLEANJET_SITE_ID,
            worker_id: DEFAULT_WORKER_ID,
          }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ANON_KEY}`,
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error(`API error: ${res.status}`)

      const json = await res.json() as {
        data: {
          total_amount: number
          duration_hours?: number
          cleaners_required?: number
          recommended_service?: string
          line_items?: CustomQuoteResult['line_items']
        } | null
        error: string | null
      }

      if (!json.data) throw new Error(json.error ?? 'No data returned')

      setCustomQuoteResult({
        total_amount: json.data.total_amount,
        duration_hours: json.data.duration_hours,
        recommended_service: json.data.recommended_service,
        line_items: json.data.line_items ?? [],
      })
      setCustomStep('result')
    } catch (err) {
      setCustomError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setCustomStep('form')
    }
  }

  if (confirmed) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <p className="text-2xl font-bold text-emerald-700">✓ Booking Confirmed!</p>
        <p className="mt-2 text-sm text-slate-500">
          We&apos;ll send a reminder SMS before your clean. See you soon!
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-xl font-bold text-slate-900">Book Your Clean</h3>

      {step === 1 && (
        <>
          {/* Tab toggle */}
          <div className="mb-5 flex rounded-lg border border-slate-200 p-1 gap-1">
            <button
              onClick={() => { setMode('standard'); setCustomStep('form') }}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                mode === 'standard'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Standard
            </button>
            <button
              onClick={() => setMode('custom')}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                mode === 'custom'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Custom Quote
            </button>
          </div>

          {mode === 'standard' && (
            <RoomSelector
              onNext={(sel) => {
                setRoomSel(sel)
                setStep(2)
              }}
            />
          )}

          {mode === 'custom' && customStep === 'form' && (
            <div className="space-y-4">
              {/* Service type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Service Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(CUSTOM_SERVICE_LABELS) as CustomServiceType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setCustomServiceType(type)}
                      className={`rounded-lg border p-3 text-left text-sm font-medium transition-colors ${
                        customServiceType === type
                          ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-cyan-300'
                      }`}
                    >
                      {CUSTOM_SERVICE_LABELS[type]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Bedrooms</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={customBedrooms}
                  onChange={(e) => setCustomBedrooms(Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Describe the property &amp; job
                </label>
                <textarea
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="e.g. 3-bed house just had kitchen and bathroom renovation. Heavy construction dust. Also need oven clean."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
                {customDescription.length > 0 && customDescription.length < 10 && (
                  <p className="mt-1 text-xs text-red-500">Please add a few more details (min 10 chars).</p>
                )}
              </div>

              {customError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{customError}</p>
              )}

              <button
                type="button"
                disabled={customDescription.length < 10}
                onClick={handleGetCustomQuote}
                className="w-full rounded-lg bg-cyan-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Get AI Quote →
              </button>
            </div>
          )}

          {mode === 'custom' && customStep === 'loading' && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-600 border-t-transparent" />
              <p className="text-sm text-slate-500">Generating your custom quote…</p>
            </div>
          )}

          {mode === 'custom' && customStep === 'result' && customQuoteResult && (
            <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-5">
              <div className="mb-1 text-xs font-medium uppercase tracking-wide text-cyan-700">
                Your Custom Clean Quote
              </div>
              <div className="text-4xl font-bold text-cyan-900">
                ${(customQuoteResult.total_amount / 100).toLocaleString('en-NZ', { maximumFractionDigits: 0 })}
              </div>
              <div className="mt-1 text-sm text-cyan-700">
                NZD
                {customQuoteResult.duration_hours
                  ? ` · Est. ${customQuoteResult.duration_hours}h`
                  : ''}
              </div>
              {customQuoteResult.line_items.length > 0 && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-cyan-800 hover:text-cyan-900">
                    View {customQuoteResult.line_items.length} line items ↓
                  </summary>
                  <div className="mt-2 space-y-1.5 border-t border-cyan-200 pt-2">
                    {customQuoteResult.line_items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm text-slate-700">
                        <span className="flex-1 pr-4">{item.description}</span>
                        <span className="whitespace-nowrap font-medium">
                          ${(item.total / 100).toLocaleString('en-NZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                </details>
              )}
              <p className="mt-3 text-xs text-cyan-600">
                Estimate only — final price confirmed at booking.
              </p>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="mt-4 w-full rounded-lg bg-cyan-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-700"
              >
                Book This Clean →
              </button>
              <button
                type="button"
                onClick={() => setCustomStep('form')}
                className="mt-2 w-full text-sm text-cyan-700 hover:text-cyan-900"
              >
                ← Edit details
              </button>
            </div>
          )}
        </>
      )}

      {step === 1 && mode === 'standard' && <WizardProgressBar currentStep={step} />}
      {step !== 1 && <WizardProgressBar currentStep={step} />}

      {step === 2 && (
        <DatePicker
          onNext={(sel) => {
            setDateSel(sel)
            setStep(3)
          }}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && roomSel && dateSel && (
        <ConfirmReview
          roomSel={roomSel}
          dateSel={dateSel}
          onBack={() => setStep(2)}
          onConfirm={async (contact) => {
            fetch('/api/leads/submit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: contact.name,
                phone: contact.phone,
                brand: 'cleanjet',
                serviceType: `Cleaning — ${roomSel.rooms} Bedrooms`,
                message: [
                  roomSel.extras.length ? `Extras: ${roomSel.extras.join(', ')}` : null,
                  `Date: ${dateSel.date.toLocaleDateString('en-NZ')} at ${dateSel.timeSlot}`,
                  `Price: $${roomSel.basePrice} NZD`,
                ].filter(Boolean).join('. '),
              }),
            }).catch((err) => console.error('[BookingWizard] ingest error:', err))
            setConfirmed(true)
          }}
        />
      )}
    </div>
  )
}

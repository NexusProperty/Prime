'use client'

import { useState } from 'react'
import { WizardProgressBar } from './BookingWizard/WizardProgressBar'
import { RoomSelector } from './BookingWizard/RoomSelector'
import { DatePicker } from './BookingWizard/DatePicker'
import { ConfirmReview } from './BookingWizard/ConfirmReview'

interface RoomSel { rooms: string; extras: string[]; basePrice: number }
interface DateSel { date: Date; timeSlot: string }

export function BookingWizard() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [roomSel, setRoomSel] = useState<RoomSel | null>(null)
  const [dateSel, setDateSel] = useState<DateSel | null>(null)
  const [confirmed, setConfirmed] = useState(false)

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
      <WizardProgressBar currentStep={step} />
      {step === 1 && (
        <RoomSelector
          onNext={(sel) => {
            setRoomSel(sel)
            setStep(2)
          }}
        />
      )}
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

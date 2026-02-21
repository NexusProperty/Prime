'use client'

import { useState } from 'react'

interface RoomSel {
  rooms: string
  extras: string[]
  basePrice: number
}
interface DateSel {
  date: Date
  timeSlot: string
}

interface Props {
  roomSel: RoomSel
  dateSel: DateSel
  onBack: () => void
  onConfirm: (contact: { name: string; phone: string }) => void
}

export function ConfirmReview({ roomSel, dateSel, onBack, onConfirm }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const dateStr = dateSel.date.toLocaleDateString('en-NZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="space-y-4">
      <div className="space-y-2 rounded-xl bg-slate-50 p-4 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Rooms</span>
          <span className="font-medium">{roomSel.rooms} Bedrooms</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Date</span>
          <span className="font-medium">{dateStr}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Time</span>
          <span className="font-medium">{dateSel.timeSlot}</span>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-2">
          <span className="font-semibold text-slate-700">Total</span>
          <span className="text-lg font-bold text-slate-900">${roomSel.basePrice} NZD</span>
        </div>
      </div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name *"
        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-400"
      />
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone number *"
        type="tel"
        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-400"
      />
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="h-11 flex-1 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
        >
          ← Back
        </button>
        <button
          onClick={() => name && phone && onConfirm({ name, phone })}
          disabled={!name || !phone}
          className="h-11 flex-1 rounded-xl bg-cyan-500 text-sm font-semibold text-white disabled:opacity-50 hover:bg-cyan-600"
        >
          Confirm Booking ✓
        </button>
      </div>
    </div>
  )
}

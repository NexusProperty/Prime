'use client'

import { useState } from 'react'
import clsx from 'clsx'

const ROOM_OPTIONS = [
  { id: '1-2', label: '1–2 Beds', price: 99 },
  { id: '3-4', label: '3–4 Beds', price: 149 },
  { id: '5+', label: '5+ Beds', price: 199 },
] as const

const EXTRAS = [
  { id: 'bathrooms', label: 'Extra Bathrooms', price: 20 },
  { id: 'oven', label: 'Oven Clean', price: 30 },
  { id: 'windows', label: 'Windows', price: 25 },
] as const

interface Selection {
  rooms: string
  extras: string[]
  basePrice: number
}

export function RoomSelector({ onNext }: { onNext: (sel: Selection) => void }) {
  const [rooms, setRooms] = useState('1-2')
  const [extras, setExtras] = useState<string[]>([])

  const basePrice = ROOM_OPTIONS.find((r) => r.id === rooms)?.price ?? 99
  const extrasTotal = EXTRAS.filter((e) => extras.includes(e.id)).reduce((s, e) => s + e.price, 0)
  const total = basePrice + extrasTotal

  const toggle = (id: string) =>
    setExtras((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {ROOM_OPTIONS.map((r) => (
          <button
            key={r.id}
            onClick={() => setRooms(r.id)}
            className={clsx(
              'rounded-xl border p-3 text-center text-sm font-medium transition-all',
              rooms === r.id
                ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                : 'border-slate-200 text-slate-600 hover:border-slate-300',
            )}
          >
            {r.label}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {EXTRAS.map((e) => (
          <label
            key={e.id}
            className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50"
          >
            <span className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={extras.includes(e.id)}
                onChange={() => toggle(e.id)}
                className="rounded border-slate-300"
              />
              {e.label}
            </span>
            <span className="text-sm text-slate-400">+${e.price}</span>
          </label>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
        <span className="text-sm text-slate-500">Estimated price</span>
        <span className="text-xl font-bold text-slate-900">${total} NZD</span>
      </div>
      <button
        onClick={() => onNext({ rooms, extras, basePrice: total })}
        className="h-11 w-full rounded-xl bg-cyan-500 text-sm font-semibold text-white hover:bg-cyan-600"
      >
        Next: Choose Date →
      </button>
    </div>
  )
}

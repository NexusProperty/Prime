'use client'

import { useState } from 'react'
import clsx from 'clsx'

const TIME_SLOTS = ['Morning (8am–12pm)', 'Afternoon (12pm–6pm)'] as const

interface DateSelection {
  date: Date
  timeSlot: string
}

interface Props {
  onNext: (sel: DateSelection) => void
  onBack: () => void
}

export function DatePicker({ onNext, onBack }: Props) {
  const [selected, setSelected] = useState<Date | null>(null)
  const [time, setTime] = useState('')

  const today = new Date()
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i + 1)
    return d
  })

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-slate-700">Select a date</p>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {dates.map((d) => (
          <button
            key={d.toISOString()}
            onClick={() => setSelected(d)}
            className={clsx(
              'flex flex-col items-center rounded-xl border p-2 text-xs transition-all',
              selected?.toDateString() === d.toDateString()
                ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                : 'border-slate-200 text-slate-600 hover:border-slate-300',
            )}
          >
            <span className="font-bold">
              {d.toLocaleDateString('en-NZ', { weekday: 'short' })}
            </span>
            <span>{d.getDate()}</span>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {TIME_SLOTS.map((t) => (
          <button
            key={t}
            onClick={() => setTime(t)}
            className={clsx(
              'rounded-xl border p-3 text-sm font-medium transition-all',
              time === t
                ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                : 'border-slate-200 text-slate-600 hover:border-slate-300',
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="h-11 flex-1 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
        >
          ← Back
        </button>
        <button
          onClick={() => selected && time && onNext({ date: selected, timeSlot: time })}
          disabled={!selected || !time}
          className="h-11 flex-1 rounded-xl bg-cyan-500 text-sm font-semibold text-white disabled:opacity-50 hover:bg-cyan-600"
        >
          Next: Confirm →
        </button>
      </div>
    </div>
  )
}

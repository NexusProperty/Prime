'use client'

import clsx from 'clsx'
import { brandConfig } from '../brandConfig'
import type { Brand } from '../types'

const SERVICE_OPTIONS = [
  'General Enquiry',
  'Electrical Services',
  'Solar / Heat Pump',
  'Smart Home & Automation',
  'Emergency',
] as const

interface Props {
  brand: Brand
  disabled: boolean
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function FormFields({ brand, disabled, onSubmit }: Props) {
  const { bg } = brandConfig[brand]
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Name *</span>
          <input
            required
            name="name"
            type="text"
            disabled={disabled}
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 disabled:opacity-50"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Phone *</span>
          <input
            required
            name="phone"
            type="tel"
            disabled={disabled}
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 disabled:opacity-50"
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
        <input
          name="email"
          type="email"
          disabled={disabled}
          className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 disabled:opacity-50"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Service needed</span>
        <select
          name="serviceType"
          disabled={disabled}
          className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 disabled:opacity-50"
        >
          {SERVICE_OPTIONS.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Message</span>
        <textarea
          name="message"
          rows={3}
          disabled={disabled}
          className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 disabled:opacity-50"
        />
      </label>
      <button
        type="submit"
        disabled={disabled}
        className={clsx(
          'h-11 w-full rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50',
          bg,
        )}
      >
        Send Request →
      </button>
    </form>
  )
}

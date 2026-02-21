'use client'

import { useEffect, useRef } from 'react'
import type { EmergencyState } from './types'

interface Props {
  state: EmergencyState
  detectedKeyword: string
  phone: string
  onDismiss: () => void
}

export function EmergencyTriageAlert({ state, detectedKeyword, phone, onDismiss }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const first = dialogRef.current?.querySelector<HTMLElement>('[href], button')
    first?.focus()
  }, [])

  if (state === 'scanning') return null

  return (
    <div
      ref={dialogRef}
      role="alertdialog"
      aria-modal="true"
      aria-label="Emergency detected"
      className="fixed inset-0 z-overlay flex items-center justify-center bg-red-600/90 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start gap-3">
          <span
            className="animate-pulse text-3xl motion-reduce:animate-none"
            role="img"
            aria-label="Warning"
          >
            ⚠
          </span>
          <div>
            <p className="font-bold text-red-600">Emergency Detected</p>
            <p className="mt-0.5 text-sm text-slate-500">
              We detected: &ldquo;{detectedKeyword}&rdquo;
            </p>
          </div>
        </div>
        <p className="mb-6 text-sm leading-relaxed text-slate-600">
          {state === 'confirmed'
            ? '✓ On-call technician notified. Expected response: 15–30 min.'
            : 'Our on-call electrician is being notified right now.'}
        </p>
        <div className="space-y-3">
          <a
            href={`tel:${phone}`}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-semibold text-white"
          >
            📞 Call {phone}
          </a>
          <a
            href="tel:111"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 text-sm font-semibold text-red-600"
          >
            🚨 Call 111 — Life Threatening
          </a>
          <button
            onClick={onDismiss}
            className="w-full text-sm text-slate-400 underline hover:text-slate-600"
          >
            This is not an emergency →
          </button>
        </div>
      </div>
    </div>
  )
}

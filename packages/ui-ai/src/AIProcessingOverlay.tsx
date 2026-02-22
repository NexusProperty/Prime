'use client'

import clsx from 'clsx'
import { brandConfig } from './brandConfig'
import type { Brand } from './types'

interface Props {
  brand: Brand
  message?: string
  fullScreen?: boolean
}

export function AIProcessingOverlay({
  brand,
  message = 'Our AI is reviewing your request…',
  fullScreen = false,
}: Props) {
  const { text } = brandConfig[brand]
  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        'flex flex-col items-center justify-center gap-4 p-8',
        fullScreen && 'fixed inset-0 z-overlay bg-white/90 backdrop-blur-sm',
      )}
    >
      <svg
        className={clsx('h-10 w-10 animate-spin motion-reduce:animate-none', text)}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <p className="max-w-xs text-center text-sm font-medium text-slate-500">{message}</p>
    </div>
  )
}

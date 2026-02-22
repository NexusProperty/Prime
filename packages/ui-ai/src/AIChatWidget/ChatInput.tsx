'use client'

import { useRef } from 'react'
import clsx from 'clsx'
import { brandConfig } from '../brandConfig'
import type { Brand } from '../types'

interface Props {
  brand: Brand
  onSubmit: (text: string) => void
  onMicToggle: () => void
  voiceActive: boolean
  disabled?: boolean
}

export function ChatInput({ brand, onSubmit, onMicToggle, voiceActive, disabled }: Props) {
  const ref = useRef<HTMLInputElement>(null)
  const { bg, bgLight, text } = brandConfig[brand]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const val = ref.current?.value.trim()
    if (val) {
      onSubmit(val)
      if (ref.current) ref.current.value = ''
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-100 p-3">
      <input
        ref={ref}
        type="text"
        placeholder="Ask a question…"
        disabled={disabled}
        aria-label="Chat message"
        className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-slate-400 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled}
        aria-label="Send message"
        className={clsx('flex h-9 w-9 items-center justify-center rounded-full text-white', bg)}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
      <button
        type="button"
        onClick={onMicToggle}
        aria-label={voiceActive ? 'Stop voice input' : 'Start voice input'}
        className={clsx(
          'flex h-9 w-9 items-center justify-center rounded-full',
          voiceActive ? 'bg-red-100 text-red-600' : clsx(bgLight, text),
        )}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" />
        </svg>
      </button>
    </form>
  )
}

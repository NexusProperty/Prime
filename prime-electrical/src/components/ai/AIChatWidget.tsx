'use client'

import { useState } from 'react'
import clsx from 'clsx'
import { brandConfig } from './brandConfig'
import { VoiceStatusIndicator } from './VoiceStatusIndicator'
import { ChatMessage } from './AIChatWidget/ChatMessage'
import { ChatInput } from './AIChatWidget/ChatInput'
import type { Brand, VoiceState, ChatMessageData } from './types'

interface Props {
  brand: Brand
  state: VoiceState
  messages: ChatMessageData[]
  onStateChange: (s: VoiceState) => void
  onMessage: (text: string) => void
}

export function AIChatWidget({ brand, state, messages, onStateChange, onMessage }: Props) {
  const [open, setOpen] = useState(false)
  const { bg, label } = brandConfig[brand]
  const isEmergency = state === 'emergency' || state === 'emergency_confirmed'

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label={`Open ${label} AI assistant`}
        className={clsx(
          'fixed bottom-20 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all sm:bottom-6',
          isEmergency ? 'animate-pulse bg-red-600 motion-reduce:animate-none' : bg,
        )}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" />
        </svg>
      </button>
    )
  }

  return (
    <div
      className={clsx(
        'fixed bottom-0 right-0 z-50 flex h-[480px] w-full flex-col rounded-t-2xl bg-white shadow-2xl sm:bottom-6 sm:right-6 sm:w-96 sm:rounded-2xl',
        isEmergency && 'ring-2 ring-red-500',
      )}
    >
      <div className={clsx('flex items-center justify-between border-b p-3', isEmergency ? 'bg-red-50' : 'bg-white')}>
        <VoiceStatusIndicator
          brand={brand}
          state={state}
          onMicClick={() => onStateChange('listening')}
          onStop={() => onStateChange('processing')}
        />
        <button
          onClick={() => setOpen(false)}
          aria-label="Close AI assistant"
          className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>
      <div
        aria-live="polite"
        aria-label="Chat messages"
        className="flex-1 space-y-3 overflow-y-auto p-4"
      >
        {messages.length === 0 && (
          <p className="text-center text-sm text-slate-400">Hi! How can I help you today?</p>
        )}
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} brand={brand} />
        ))}
      </div>
      <ChatInput
        brand={brand}
        onSubmit={onMessage}
        onMicToggle={() => onStateChange(state === 'listening' ? 'processing' : 'listening')}
        voiceActive={state === 'listening'}
        disabled={state === 'processing'}
      />
    </div>
  )
}

'use client'

import clsx from 'clsx'
import { brandConfig } from './brandConfig'
import { WaveformBars } from './VoiceStatusIndicator/WaveformBars'
import type { Brand, VoiceState } from './types'

const STATE_LABEL: Record<VoiceState, string> = {
  idle: 'Ask me anything',
  listening: 'Listening…',
  processing: 'Processing…',
  response: 'Here to help',
  cross_sell: 'Bundle available',
  emergency: 'Emergency detected',
  emergency_confirmed: 'Help is on the way',
}

interface Props {
  brand: Brand
  state: VoiceState
  onMicClick?: () => void
  onStop?: () => void
}

export function VoiceStatusIndicator({ brand, state, onMicClick, onStop }: Props) {
  const b = brandConfig[brand]
  const isEmergency = state === 'emergency' || state === 'emergency_confirmed'
  const isListening = state === 'listening'

  return (
    <div className="flex items-center gap-3">
      {isListening ? (
        <>
          <WaveformBars active colorClass={isEmergency ? 'bg-red-500' : b.bg} />
          <button
            onClick={onStop}
            aria-label="Stop listening"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100"
          >
            <span className="h-3 w-3 rounded-sm bg-red-600" aria-hidden="true" />
          </button>
        </>
      ) : (
        <button
          onClick={onMicClick}
          aria-label="Start voice assistant"
          aria-busy={state === 'processing'}
          className={clsx(
            'flex h-10 w-10 items-center justify-center rounded-full text-white transition-all',
            isEmergency ? 'animate-pulse bg-red-600 motion-reduce:animate-none' : b.bg,
          )}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" />
          </svg>
        </button>
      )}
      <span className={clsx('text-sm', isEmergency ? 'font-semibold text-red-600' : 'text-slate-500')}>
        {STATE_LABEL[state]}
      </span>
    </div>
  )
}

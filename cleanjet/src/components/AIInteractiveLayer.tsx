'use client'

import { useState } from 'react'
import { AIChatWidget, EmergencyTriageAlert } from '@/components/ai'
import type { VoiceState, EmergencyState, ChatMessageData } from '@/components/ai'
import { MobileStickyBar } from '@/components/MobileStickyBar'

const EMERGENCY_KEYWORDS = [
  'flood', 'flooding', 'water damage', 'leak', 'leaking',
  'mold', 'mould', 'contamination', 'hazard', 'spill', 'chemical',
  'emergency', 'urgent', 'unsafe', 'danger', 'accident',
]

export function AIInteractiveLayer() {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle')
  const [emergencyState, setEmergencyState] = useState<EmergencyState>('scanning')
  const [detectedKeyword, setDetectedKeyword] = useState('')
  const [messages, setMessages] = useState<ChatMessageData[]>([])
  const isEmergency = emergencyState !== 'scanning'

  const handleMessage = (text: string) => {
    const lower = text.toLowerCase()
    const keyword = EMERGENCY_KEYWORDS.find((k) => lower.includes(k))
    if (keyword) {
      setDetectedKeyword(keyword)
      setEmergencyState('alerting')
      return
    }
    const userMsg: ChatMessageData = { id: Date.now().toString(), role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setVoiceState('processing')
    setTimeout(() => {
      const reply: ChatMessageData = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Thanks for reaching out! Our team will be in touch shortly. Is there anything else I can help with?',
      }
      setMessages((prev) => [...prev, reply])
      setVoiceState('response')
    }, 1500)
  }

  return (
    <>
      {!isEmergency && (
        <MobileStickyBar phone="0800000000" bookingUrl="#booking" />
      )}
      <AIChatWidget
        brand="cleanjet"
        state={voiceState}
        messages={messages}
        onStateChange={setVoiceState}
        onMessage={handleMessage}
      />
      <EmergencyTriageAlert
        state={emergencyState}
        detectedKeyword={detectedKeyword}
        phone="0800000000"
        onDismiss={() => {
          setEmergencyState('scanning')
          setVoiceState('idle')
        }}
      />
    </>
  )
}

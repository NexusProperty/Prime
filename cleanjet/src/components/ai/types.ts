export type Brand = 'prime' | 'akf' | 'cleanjet'

export type VoiceState =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'response'
  | 'cross_sell'
  | 'emergency'
  | 'emergency_confirmed'

export type FormState =
  | 'idle'
  | 'filling'
  | 'submitting'
  | 'ai_processing'
  | 'cross_sell_triggered'
  | 'confirmed'
  | 'confirmed_with_crosssell'

export type CrossSellState =
  | 'hidden'
  | 'appearing'
  | 'visible'
  | 'accepted'
  | 'declined'

export type EmergencyState = 'scanning' | 'detected' | 'alerting' | 'confirmed'

export interface CrossSellData {
  partnerBrand: Brand
  servicePitch: string
  price?: string
}

export interface ChatMessageData {
  id: string
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export interface LeadFormData {
  name: string
  phone: string
  email: string
  message: string
  serviceType: string
}

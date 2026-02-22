// Shared components from @prime/ui-ai package
export {
  VoiceStatusIndicator,
  CrossSellPromptCard,
  EmergencyTriageAlert,
  AIProcessingOverlay,
  brandConfig,
} from '@prime/ui-ai'

export type {
  Brand,
  VoiceState,
  FormState,
  CrossSellState,
  EmergencyState,
  CrossSellData,
  ChatMessageData,
  LeadFormData,
} from '@prime/ui-ai'

// Per-site components (intentionally kept separate)
export { AIChatWidget } from './AIChatWidget'
export { LeadCaptureForm } from './LeadCaptureForm'

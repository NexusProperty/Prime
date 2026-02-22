import type { Brand } from './types'

export const brandConfig = {
  prime: {
    ring: 'ring-amber-500',
    bg: 'bg-amber-600',
    bgLight: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-500',
    label: 'Prime Electrical',
  },
  akf: {
    ring: 'ring-slate-900',
    bg: 'bg-slate-900',
    bgLight: 'bg-slate-100',
    text: 'text-slate-900',
    border: 'border-slate-900',
    label: 'AKF Construction',
  },
  cleanjet: {
    ring: 'ring-cyan-500',
    bg: 'bg-cyan-500',
    bgLight: 'bg-cyan-50',
    text: 'text-cyan-600',
    border: 'border-cyan-500',
    label: 'CleanJet',
  },
} as const

export const emergencyConfig = {
  bg: 'bg-red-600',
  bgLight: 'bg-red-50',
  text: 'text-red-600',
  border: 'border-red-500',
  ring: 'ring-red-500',
} as const

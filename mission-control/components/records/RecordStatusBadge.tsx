'use client'

import { Badge } from '@/components/catalyst/badge'
import type { RecordStatus } from '@/hooks/useRecords'

const statusColors: Record<RecordStatus, 'zinc' | 'amber' | 'blue' | 'green' | 'red'> = {
  open: 'zinc',
  pending: 'amber',
  approved: 'blue',
  completed: 'green',
  cancelled: 'red',
}

interface RecordStatusBadgeProps {
  status: RecordStatus
  className?: string
}

export function RecordStatusBadge({ status, className }: RecordStatusBadgeProps) {
  const color = statusColors[status]
  const label = status.charAt(0).toUpperCase() + status.slice(1)
  return (
    <Badge color={color} className={className}>
      {label}
    </Badge>
  )
}

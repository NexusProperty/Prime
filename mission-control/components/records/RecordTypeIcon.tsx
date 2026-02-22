'use client'

import {
  DocumentTextIcon,
  WrenchScrewdriverIcon,
  BanknotesIcon,
  DocumentMagnifyingGlassIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline'
import type { RecordType } from '@/hooks/useRecords'
import { cn } from '@/lib/utils'

const typeIcons: Record<RecordType, React.ComponentType<{ className?: string }>> = {
  quote: DocumentTextIcon,
  job: WrenchScrewdriverIcon,
  invoice: BanknotesIcon,
  note: DocumentMagnifyingGlassIcon,
  booking: CalendarDaysIcon,
  task: ClipboardDocumentCheckIcon,
}

interface RecordTypeIconProps {
  type: RecordType
  className?: string
}

export function RecordTypeIcon({ type, className }: RecordTypeIconProps) {
  const Icon = typeIcons[type]
  return (
    <Icon
      className={cn('size-5 text-zinc-500 dark:text-zinc-400', className)}
      aria-hidden
    />
  )
}

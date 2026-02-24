/* Source: Tailwind Plus UI Kit — Lists / Stacked Lists */

import { CpuChipIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

export interface AgentSummaryRowProps {
  name: string
  type: string
  isActive: boolean
  successRate?: number
  lastActionAt?: string
}

function formatRelativeTime(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60_000)
  const diffHours = Math.floor(diffMs / 3_600_000)
  const diffDays = Math.floor(diffMs / 86_400_000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-NZ', { month: 'short', day: 'numeric' })
}

export default function AgentSummaryRow({
  name,
  type,
  isActive,
  successRate,
  lastActionAt,
}: AgentSummaryRowProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Icon */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15">
        <CpuChipIcon className="h-5 w-5 text-indigo-400" aria-hidden="true" />
      </div>

      {/* Name + type */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-white truncate">{name}</span>
          <span className="shrink-0 rounded-full bg-white/5 ring-1 ring-white/10 px-2.5 py-0.5 text-xs text-gray-400">
            {type}
          </span>
        </div>
        {lastActionAt != null && (
          <p className="text-xs text-gray-500 mt-0.5">
            Last action {formatRelativeTime(lastActionAt)}
          </p>
        )}
      </div>

      {/* Status + success rate */}
      <div className="flex items-center gap-3 shrink-0">
        {successRate != null && (
          <span
            className={cn(
              'text-sm font-medium tabular-nums',
              successRate >= 80
                ? 'text-emerald-400'
                : successRate >= 50
                  ? 'text-amber-400'
                  : 'text-rose-400',
            )}
          >
            {successRate}%
          </span>
        )}
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
            isActive
              ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20'
              : 'bg-gray-500/10 text-gray-400 ring-gray-500/20',
          )}
          aria-label={isActive ? 'Active' : 'Inactive'}
        >
          <span
            className={cn('h-1.5 w-1.5 rounded-full', isActive ? 'bg-emerald-400' : 'bg-gray-500')}
            aria-hidden="true"
          />
          {isActive ? 'Active' : 'Idle'}
        </span>
      </div>
    </div>
  )
}

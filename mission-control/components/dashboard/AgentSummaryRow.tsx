export interface AgentSummaryRowProps {
  name: string
  type: string
  isActive: boolean
  successRate?: number // 0-100, may be undefined if no actions
  lastActionAt?: string // ISO timestamp
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

function successRateColor(rate: number): string {
  if (rate >= 80) return 'text-emerald-400'
  if (rate >= 50) return 'text-amber-400'
  return 'text-rose-400'
}

export default function AgentSummaryRow({
  name,
  type,
  isActive,
  successRate,
  lastActionAt,
}: AgentSummaryRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${
            isActive ? 'bg-emerald-400' : 'bg-gray-500'
          }`}
          aria-hidden
        />
        <span className="text-sm font-medium text-white">{name}</span>
      </div>
      <span className="rounded-full bg-gray-700/50 px-2 py-0.5 text-xs text-gray-400">
        {type}
      </span>
      {successRate != null && (
        <span className={successRateColor(successRate)}>
          {successRate}%
        </span>
      )}
      {lastActionAt != null && (
        <span className="text-xs text-gray-500">
          {formatRelativeTime(lastActionAt)}
        </span>
      )}
    </div>
  )
}

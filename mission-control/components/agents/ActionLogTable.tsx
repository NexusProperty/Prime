'use client'

import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/catalyst/table'
import { Badge } from '@/components/catalyst/badge'
import type { AgentActionRow } from '@/hooks/useAgentActions'

function formatDuration(ms: number | null): string {
  if (ms == null) return '—'
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

type BadgeColor = 'green' | 'red' | 'amber' | 'zinc'

function getStatusBadgeColor(status: AgentActionRow['status']): BadgeColor {
  switch (status) {
    case 'success':
      return 'green'
    case 'failed':
    case 'escalated':
      return 'red'
    case 'running':
    case 'pending':
      return 'amber'
    default:
      return 'zinc'
  }
}

interface ActionLogTableProps {
  actions: AgentActionRow[]
  showAgentColumn?: boolean
  emptyMessage?: string
}

export function ActionLogTable({
  actions,
  showAgentColumn = true,
  emptyMessage = 'No actions yet',
}: ActionLogTableProps) {
  if (actions.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-950/10 bg-white px-6 py-12 text-center dark:border-white/10 dark:bg-zinc-900">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <Table striped>
      <TableHead>
        <TableRow>
          {showAgentColumn && (
            <TableHeader>Agent</TableHeader>
          )}
          <TableHeader>Action Type</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>Confidence</TableHeader>
          <TableHeader>Duration</TableHeader>
          <TableHeader>Time</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {actions.map((action) => (
          <TableRow key={action.id} data-testid={`action-row-${action.id}`}>
            {showAgentColumn && (
              <TableCell>
                <span className="font-medium text-zinc-950 dark:text-white">
                  {action.agents?.name ?? 'Unknown'}
                </span>
              </TableCell>
            )}
            <TableCell>
              <span className="text-zinc-700 dark:text-zinc-300">
                {action.action_type}
              </span>
            </TableCell>
            <TableCell>
              <Badge color={getStatusBadgeColor(action.status)}>
                {action.status}
              </Badge>
            </TableCell>
            <TableCell>
              <span className="text-zinc-600 dark:text-zinc-400">
                {action.confidence != null
                  ? action.confidence.toFixed(2)
                  : '—'}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-zinc-600 dark:text-zinc-400">
                {formatDuration(action.duration_ms)}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-zinc-500 dark:text-zinc-400 text-sm">
                {formatTime(action.created_at)}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

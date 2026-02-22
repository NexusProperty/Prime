'use client'

import { useState } from 'react'
import { Switch, SwitchField } from '@/components/catalyst/switch'
import { Badge } from '@/components/catalyst/badge'
import { Button } from '@/components/catalyst/button'
import { ActionLogTable } from '@/components/agents/ActionLogTable'
import type { AgentActionRow } from '@/hooks/useAgentActions'

export interface Agent {
  id: string
  name: string
  type: string
  is_active: boolean
  description?: string
}

interface AgentCardProps {
  agent: Agent
  recentActions: AgentActionRow[]
  onToggleActive: (id: string, active: boolean) => void
}

function formatLastAction(actions: AgentActionRow[]): string {
  const latest = actions[0]
  if (!latest) return 'No actions yet'
  const d = new Date(latest.created_at)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function computeSuccessRate24h(actions: AgentActionRow[]): number | null {
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
  const recent = actions.filter((a) => new Date(a.created_at).getTime() >= oneDayAgo)
  if (recent.length === 0) return null
  const success = recent.filter((a) => a.status === 'success').length
  return success / recent.length
}

export function AgentCard({ agent, recentActions, onToggleActive }: AgentCardProps) {
  const [expanded, setExpanded] = useState(false)
  const lastActionTime = formatLastAction(recentActions)
  const successRate = computeSuccessRate24h(recentActions)
  const displayActions = recentActions.slice(0, 20)

  return (
    <div
      data-testid={`agent-card-${agent.id}`}
      className="rounded-xl border border-zinc-950/10 bg-white dark:border-white/10 dark:bg-zinc-900"
    >
      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-zinc-950 dark:text-white">
              {agent.name}
            </h3>
            <Badge color="zinc" data-testid={`agent-type-badge-${agent.id}`}>
              {agent.type}
            </Badge>
            <Badge
              color={agent.is_active ? 'green' : 'zinc'}
              data-testid={`agent-status-badge-${agent.id}`}
            >
              {agent.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
            <span>Last action: {lastActionTime}</span>
            {successRate != null && (
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                Success rate (24h): {(successRate * 100).toFixed(0)}%
              </span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <SwitchField>
            <span data-slot="label" className="text-sm font-medium text-zinc-950 dark:text-white">
              {agent.is_active ? 'Enabled' : 'Disabled'}
            </span>
            <Switch
              checked={agent.is_active}
              onChange={(checked) => onToggleActive(agent.id, checked)}
              data-testid={`agent-toggle-${agent.id}`}
            />
          </SwitchField>
          <Button
            outline
            onClick={() => setExpanded(!expanded)}
            data-testid={`agent-view-actions-${agent.id}`}
          >
            {expanded ? 'Hide Actions' : 'View Actions'}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-zinc-950/5 px-6 py-4 dark:border-white/5">
          <ActionLogTable
            actions={displayActions}
            showAgentColumn={false}
            emptyMessage="No actions for this agent"
          />
        </div>
      )}
    </div>
  )
}

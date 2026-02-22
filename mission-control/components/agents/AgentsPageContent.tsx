'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { useAgentActions } from '@/hooks/useAgentActions'
import { AgentCard } from '@/components/agents/AgentCard'
import { ActionLogTable } from '@/components/agents/ActionLogTable'
import { Heading, Subheading } from '@/components/catalyst/heading'
import type { Agent } from '@/components/agents/AgentCard'

interface AgentsPageContentProps {
  agents: Agent[]
}

export default function AgentsPageContent({ agents }: AgentsPageContentProps) {
  const router = useRouter()
  const { data: allActions, loading, error, refetch } = useAgentActions({ limit: 100 })
  const [agentStates, setAgentStates] = useState(
    () => new Map(agents.map((a) => [a.id, a.is_active]))
  )

  const handleToggleActive = useCallback(
    async (id: string, active: boolean) => {
      setAgentStates((prev) => new Map(prev).set(id, active))
      const supabase = createClient()
      const { error: err } = await supabase
        .from('agents')
        .update({ is_active: active })
        .eq('id', id)

      if (err) {
        console.error('Failed to toggle agent:', err)
        setAgentStates((prev) => new Map(prev).set(id, !active))
        return
      }
      await refetch()
      router.refresh()
    },
    [refetch, router]
  )

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <Heading level={1}>Agents</Heading>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Monitor agent activity and enable or disable agents
        </p>
      </div>

      {/* Agent cards */}
      <div className="space-y-4">
        <Subheading level={2}>Registered Agents</Subheading>
        {agents.length === 0 ? (
          <div className="rounded-xl border border-zinc-950/10 bg-white p-8 text-center dark:border-white/10 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">No agents registered</p>
          </div>
        ) : (
          <div className="space-y-4">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={{
                  ...agent,
                  is_active: agentStates.get(agent.id) ?? agent.is_active,
                }}
                recentActions={
                  allActions?.filter((a) => a.agent_id === agent.id) ?? []
                }
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        )}
      </div>

      {/* Global action log */}
      <div className="space-y-4">
        <Subheading level={2}>Recent Actions (All Agents)</Subheading>
        {loading && (
          <div className="rounded-xl border border-zinc-950/10 bg-white p-8 text-center dark:border-white/10 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading actions…</p>
          </div>
        )}
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
          >
            {error}
          </div>
        )}
        {!loading && !error && allActions && (
          <ActionLogTable
            actions={allActions}
            showAgentColumn={true}
            emptyMessage="No actions yet"
          />
        )}
      </div>
    </div>
  )
}

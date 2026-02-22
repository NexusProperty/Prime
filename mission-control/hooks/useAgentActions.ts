'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

export interface AgentActionRow {
  id: string
  agent_id: string
  action_type: string
  status: 'pending' | 'running' | 'success' | 'failed' | 'escalated'
  confidence: number | null
  duration_ms: number | null
  created_at: string
  agents: { name: string } | null
}

export interface UseAgentActionsOptions {
  agentId?: string
  status?: AgentActionRow['status']
  limit?: number
  paginated?: boolean
}

export interface UseAgentActionsResult {
  data: AgentActionRow[] | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useAgentActions(options: UseAgentActionsOptions = {}): UseAgentActionsResult {
  const { agentId, status, limit = 100, paginated = false } = options
  const [data, setData] = useState<AgentActionRow[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchActions = useCallback(async () => {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('agent_actions')
        .select('id, agent_id, action_type, status, confidence, duration_ms, created_at, agents(name)')
        .order('created_at', { ascending: false })

      if (agentId) {
        query = query.eq('agent_id', agentId)
      }
      if (status) {
        query = query.eq('status', status)
      }
      if (!paginated) {
        query = query.limit(limit)
      }

      const { data: rows, error: err } = await query

      if (err) throw err
      const normalized = (rows ?? []).map((r) => ({
        ...r,
        agents: Array.isArray(r.agents) ? r.agents[0] ?? null : r.agents,
      })) as AgentActionRow[]
      setData(normalized)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [agentId, status, limit, paginated])

  useEffect(() => {
    let cancelled = false

    async function run() {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        let query = supabase
          .from('agent_actions')
          .select('id, agent_id, action_type, status, confidence, duration_ms, created_at, agents(name)')
          .order('created_at', { ascending: false })

        if (agentId) {
          query = query.eq('agent_id', agentId)
        }
        if (status) {
          query = query.eq('status', status)
        }
        if (!paginated) {
          query = query.limit(limit)
        }

        const { data: rows, error: err } = await query

        if (cancelled) return

        if (err) throw err
        const normalized = (rows ?? []).map((r) => ({
          ...r,
          agents: Array.isArray(r.agents) ? r.agents[0] ?? null : r.agents,
        })) as AgentActionRow[]
        setData(normalized)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error')
          setData(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [agentId, status, limit, paginated])

  return {
    data,
    loading,
    error,
    refetch: fetchActions,
  }
}

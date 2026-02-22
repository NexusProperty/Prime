'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

export interface AnalyticsSummary {
  contacts_total: number
  events_in_range: number
  events_unprocessed: number
  records_by_type: Record<string, number>
  agent_actions_by_status: Record<string, number>
  agent_failures_last_hour: number
  outbound_pending: number
  outbound_failed: number
  events_by_day: Array<{ day: string; cnt: number }>
  top_workers: Array<{
    full_name: string
    worker_id: string
    record_count: number
  }>
}

export function useAnalytics(
  siteId: string | null,
  range: '1d' | '7d' | '30d' = '7d'
) {
  const [data, setData] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    async function fetchAnalytics() {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        setLoading(false)
        return
      }

      const params = new URLSearchParams({ range })
      if (siteId) params.set('site_id', siteId)

      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/mc-analytics?${params}`
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })

      if (!res.ok) {
        const msg = await res.text()
        if (!cancelled) setError(msg)
      } else {
        const json = (await res.json()) as { summary: AnalyticsSummary }
        if (!cancelled) setData(json.summary)
      }
      if (!cancelled) setLoading(false)
    }

    fetchAnalytics().catch((err: unknown) => {
      if (!cancelled) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [siteId, range])

  return { data, loading, error }
}

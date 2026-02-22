'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useSite } from '@/lib/site-context'

export interface Connection {
  id: string
  site_id: string
  app_name: string
  app_slug: string
  vault_secret_id: string | null
  config: Record<string, unknown>
  is_enabled: boolean
  last_sync_at: string | null
  last_sync_status: 'success' | 'error' | 'pending' | null
  last_sync_error: string | null
  created_at: string
  updated_at: string
}

interface UseConnectionsResult {
  data: Connection[] | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  updateConnection: (id: string, payload: Partial<Pick<Connection, 'is_enabled' | 'config'>>) => Promise<void>
  deleteConnection: (id: string) => Promise<void>
}

function getConnectionsUrl(siteId: string | null): string {
  const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/mc-connections`
  if (siteId) {
    return `${base}?site_id=${encodeURIComponent(siteId)}`
  }
  return base
}

export function useConnections(): UseConnectionsResult {
  const { activeSite } = useSite()
  const [data, setData] = useState<Connection[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConnections = useCallback(async () => {
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
      const url = getConnectionsUrl(activeSite?.id ?? null)
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })

      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || `HTTP ${res.status}`)
      }

      const json = (await res.json()) as { connections?: Connection[] }
      setData(json.connections ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [activeSite?.id])

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
        const url = getConnectionsUrl(activeSite?.id ?? null)
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })

        if (cancelled) return

        if (!res.ok) {
          const msg = await res.text()
          setError(msg || `HTTP ${res.status}`)
          setData(null)
        } else {
          const json = (await res.json()) as { connections?: Connection[] }
          setData(json.connections ?? [])
        }
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
  }, [activeSite?.id])

  const updateConnection = useCallback(
    async (id: string, payload: Partial<Pick<Connection, 'is_enabled' | 'config'>>) => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) return

      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/mc-connections/${id}`
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || `HTTP ${res.status}`)
      }

      await fetchConnections()
    },
    [fetchConnections]
  )

  const deleteConnection = useCallback(
    async (id: string) => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) return

      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/mc-connections/${id}`
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}` },
      })

      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || `HTTP ${res.status}`)
      }

      await fetchConnections()
    },
    [fetchConnections]
  )

  return {
    data,
    loading,
    error,
    refetch: fetchConnections,
    updateConnection,
    deleteConnection,
  }
}

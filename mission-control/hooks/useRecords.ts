'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

export type RecordType = 'quote' | 'job' | 'invoice' | 'note' | 'booking' | 'task'
export type RecordStatus = 'open' | 'pending' | 'approved' | 'completed' | 'cancelled'

export interface RecordRow {
  id: string
  site_id: string
  worker_id: string | null
  contact_id: string | null
  source_event_id: string | null
  record_type: RecordType
  status: RecordStatus
  title: string
  amount: number | null
  currency: string | null
  payload: Record<string, unknown>
  tags: string[]
  due_at: string | null
  closed_at: string | null
  created_at: string
  updated_at: string
  sites?: { id: string; name: string } | null
  workers?: { id: string; full_name: string } | null
}

export interface RecordFilters {
  siteId?: string | null
  type?: RecordType | null
  status?: RecordStatus | null
  workerId?: string | null
  from?: string | null
  to?: string | null
  q?: string | null
  page?: number
  pageSize?: number
}

export function useRecords(filters: RecordFilters) {
  const [data, setData] = useState<RecordRow[]>([])
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    async function fetchRecords() {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        setLoading(false)
        return
      }

      let query = supabase
        .from('records')
        .select(
          'id, site_id, worker_id, contact_id, source_event_id, record_type, status, title, amount, currency, payload, tags, due_at, closed_at, created_at, updated_at, sites(id, name), workers(id, full_name)',
          { count: 'exact' }
        )
        .order('created_at', { ascending: false })

      if (filters.siteId) {
        query = query.eq('site_id', filters.siteId)
      }
      if (filters.type) {
        query = query.eq('record_type', filters.type)
      }
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.workerId) {
        query = query.eq('worker_id', filters.workerId)
      }
      if (filters.from) {
        query = query.gte('created_at', filters.from)
      }
      if (filters.to) {
        query = query.lte('created_at', filters.to)
      }
      if (filters.q) {
        query = query.ilike('title', `%${filters.q}%`)
      }

      const page = filters.page ?? 1
      const pageSize = filters.pageSize ?? 50
      query = query.range((page - 1) * pageSize, page * pageSize - 1)

      const { data: rows, error: err, count } = await query

      if (cancelled) return

      if (err) {
        setError(err.message)
        setData([])
        setTotal(0)
      } else {
        setData((rows ?? []) as unknown as RecordRow[])
        setTotal(count ?? 0)
      }
      setLoading(false)
    }

    fetchRecords().catch((err: unknown) => {
      if (!cancelled) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setData([])
        setTotal(0)
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [
    filters.siteId,
    filters.type,
    filters.status,
    filters.workerId,
    filters.from,
    filters.to,
    filters.q,
    filters.page,
    filters.pageSize,
  ])

  return { data, total, loading, error }
}

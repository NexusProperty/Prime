'use client'

import { useCallback, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/catalyst/table'
import { Badge } from '@/components/catalyst/badge'
import { Button } from '@/components/catalyst/button'
import { Heading } from '@/components/catalyst/heading'
import { ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

export interface OutboundQueueItem {
  id: string
  site_id: string
  delivery_type: string
  destination_url: string | null
  destination_email: string | null
  status: string
  attempt_count: number
  max_attempts: number
  last_attempted_at: string | null
  next_attempt_at: string | null
  error: string | null
  created_at: string
  sites: { name: string } | null
}

interface OutboundQueueContentProps {
  initialItems: OutboundQueueItem[]
}

const STATUS_TABS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'sending', label: 'Delivering' },
  { id: 'failed', label: 'Failed' },
  { id: 'delivered', label: 'Delivered' },
] as const

function formatDestination(item: OutboundQueueItem): string {
  if (item.delivery_type === 'email' && item.destination_email) {
    return item.destination_email
  }
  if (item.delivery_type === 'webhook' && item.destination_url) {
    return item.destination_url.length > 50
      ? item.destination_url.slice(0, 47) + '...'
      : item.destination_url
  }
  if (item.delivery_type === 'sms') {
    return item.destination_email ?? item.destination_url ?? '—'
  }
  return '—'
}

function formatTime(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getStatusBadgeColor(status: string): 'green' | 'red' | 'amber' | 'zinc' {
  switch (status) {
    case 'delivered':
      return 'green'
    case 'failed':
    case 'cancelled':
      return 'red'
    case 'sending':
    case 'pending':
      return 'amber'
    default:
      return 'zinc'
  }
}

export default function OutboundQueueContent({
  initialItems,
}: OutboundQueueContentProps) {
  const [items, setItems] = useState<OutboundQueueItem[]>(initialItems)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const filteredItems = useMemo(() => {
    if (statusFilter === 'all') return items
    return items.filter((i) => i.status === statusFilter)
  }, [items, statusFilter])

  const failedCount = useMemo(
    () => items.filter((i) => i.status === 'failed').length,
    [items]
  )

  const handleRetry = useCallback(async (id: string) => {
    setUpdatingId(id)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('outbound_queue')
        .update({
          status: 'pending',
          next_attempt_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error

      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                status: 'pending',
                next_attempt_at: new Date().toISOString(),
              }
            : i
        )
      )
    } catch (err) {
      console.error('Retry failed:', err)
    } finally {
      setUpdatingId(null)
    }
  }, [])

  const handleCancel = useCallback(async (id: string) => {
    if (!confirm('Cancel this queue item? It will not be retried.')) return
    setUpdatingId(id)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('outbound_queue')
        .update({ status: 'cancelled' })
        .eq('id', id)

      if (error) throw error

      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: 'cancelled' } : i))
      )
    } catch (err) {
      console.error('Cancel failed:', err)
    } finally {
      setUpdatingId(null)
    }
  }, [])

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <Heading level={1}>Outbound Queue</Heading>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Monitor and manage outbound delivery jobs
        </p>
      </div>

      {failedCount > 0 && (
        <div
          role="alert"
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200"
          data-testid="failed-items-alert"
        >
          {failedCount} item{failedCount !== 1 ? 's' : ''} in failed state
        </div>
      )}

      {/* Filter tabs */}
      <div className="border-b border-zinc-950/10 dark:border-white/10">
        <nav aria-label="Filter by status" className="-mb-px flex space-x-8">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={cn(
                'border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap transition-colors',
                statusFilter === tab.id
                  ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:border-white/20 dark:hover:text-zinc-300'
              )}
              data-testid={`filter-tab-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Table */}
      {filteredItems.length === 0 ? (
        <div className="rounded-xl border border-zinc-950/10 bg-white p-12 text-center dark:border-white/10 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {statusFilter === 'all'
              ? 'No items in the outbound queue'
              : `No ${statusFilter} items`}
          </p>
        </div>
      ) : (
        <Table striped>
          <TableHead>
            <TableRow>
              <TableHeader>Destination</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Site</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Attempts</TableHeader>
              <TableHeader>Last Try</TableHeader>
              <TableHeader>Next Try</TableHeader>
              <TableHeader>Error</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id} data-testid={`outbound-row-${item.id}`}>
                <TableCell>
                  <span
                    className="font-mono text-sm text-zinc-700 dark:text-zinc-300 truncate max-w-[200px] block"
                    title={item.destination_url ?? item.destination_email ?? undefined}
                  >
                    {formatDestination(item)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge color="zinc">{item.delivery_type}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {item.sites?.name ?? 'Unknown'}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge color={getStatusBadgeColor(item.status)}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {item.attempt_count} / {item.max_attempts}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-zinc-500 dark:text-zinc-400 text-sm">
                    {formatTime(item.last_attempted_at)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-zinc-500 dark:text-zinc-400 text-sm">
                    {formatTime(item.next_attempt_at)}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className="text-sm text-red-600 dark:text-red-400 truncate max-w-[150px] block"
                    title={item.error ?? undefined}
                  >
                    {item.error ?? '—'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {item.status !== 'cancelled' && item.status !== 'delivered' && (
                      <Button
                        outline
                        onClick={() => handleRetry(item.id)}
                        disabled={updatingId === item.id}
                        className="min-w-0 px-2 py-1 text-xs"
                        data-testid={`retry-${item.id}`}
                        aria-label="Retry now"
                      >
                        <ArrowPathIcon
                          className={cn(
                            'size-4',
                            updatingId === item.id && 'animate-spin'
                          )}
                          aria-hidden="true"
                        />
                      </Button>
                    )}
                    {item.status !== 'cancelled' && item.status !== 'delivered' && (
                      <Button
                        outline
                        onClick={() => handleCancel(item.id)}
                        disabled={updatingId === item.id}
                        className="min-w-0 px-2 py-1 text-xs text-red-600 dark:text-red-400"
                        data-testid={`cancel-${item.id}`}
                        aria-label="Cancel"
                      >
                        <XMarkIcon className="size-4" aria-hidden="true" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

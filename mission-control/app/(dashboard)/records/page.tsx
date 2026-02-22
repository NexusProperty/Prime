'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSite } from '@/lib/site-context'
import { useRecords } from '@/hooks/useRecords'
import type { RecordFilters, RecordType, RecordStatus } from '@/hooks/useRecords'
import { RecordTable } from '@/components/records/RecordTable'
import { Select } from '@/components/catalyst/select'
import { Input } from '@/components/catalyst/input'
import { Button } from '@/components/catalyst/button'
import {
  Pagination,
  PaginationPrevious,
  PaginationNext,
  PaginationList,
  PaginationPage,
  PaginationGap,
} from '@/components/catalyst/pagination'
import Link from 'next/link'
import { PlusIcon } from '@heroicons/react/24/outline'

const RECORD_TYPES: { value: RecordType; label: string }[] = [
  { value: 'quote', label: 'Quote' },
  { value: 'job', label: 'Job' },
  { value: 'invoice', label: 'Invoice' },
  { value: 'note', label: 'Note' },
  { value: 'booking', label: 'Booking' },
  { value: 'task', label: 'Task' },
]

const RECORD_STATUSES: { value: RecordStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const PAGE_SIZE = 50

export default function RecordsPage() {
  const searchParams = useSearchParams()
  const { activeSite, sites } = useSite()

  const [type, setType] = useState<RecordType | ''>(
    () => (searchParams.get('type') as RecordType) ?? ''
  )
  const [status, setStatus] = useState<RecordStatus | ''>(
    () => (searchParams.get('status') as RecordStatus) ?? ''
  )
  const [q, setQ] = useState(() => searchParams.get('q') ?? '')
  const [from, setFrom] = useState(() => searchParams.get('from') ?? '')
  const [to, setTo] = useState(() => searchParams.get('to') ?? '')
  const [siteId, setSiteId] = useState<string | ''>(
    () => searchParams.get('site') ?? activeSite?.id ?? ''
  )
  const [page, setPage] = useState(() =>
    Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  )

  const filters: RecordFilters = useMemo(
    () => ({
      siteId: siteId || activeSite?.id || undefined,
      type: type || undefined,
      status: status || undefined,
      q: q || undefined,
      from: from || undefined,
      to: to || undefined,
      page,
      pageSize: PAGE_SIZE,
    }),
    [siteId, activeSite?.id, type, status, q, from, to, page]
  )

  const { data, total, loading, error } = useRecords(filters)

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const hasNext = page < totalPages
  const hasPrev = page > 1

  const pageUrl = (p: number) => {
    const params = new URLSearchParams()
    if (siteId) params.set('site', siteId)
    if (type) params.set('type', type)
    if (status) params.set('status', status)
    if (q) params.set('q', q)
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    params.set('page', String(p))
    return `?${params.toString()}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">
            Records
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {activeSite ? activeSite.name : 'All Sites'} · Quotes, jobs, invoices,
            bookings
          </p>
        </div>
        <Link
          href="/records/new"
          className="inline-flex items-center justify-center gap-x-2 rounded-lg border border-transparent bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:bg-zinc-600 dark:hover:bg-zinc-500"
        >
          <PlusIcon className="size-5" aria-hidden />
          New Record
        </Link>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-end gap-4 rounded-xl border border-zinc-950/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 p-4">
        <div className="min-w-[140px]">
          <label
            htmlFor="filter-site"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Site
          </label>
          <Select
            id="filter-site"
            value={siteId}
            onChange={(e) => {
              setSiteId(e.target.value)
              setPage(1)
            }}
          >
            <option value="">All Sites</option>
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="min-w-[120px]">
          <label
            htmlFor="filter-type"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Type
          </label>
          <Select
            id="filter-type"
            value={type}
            onChange={(e) => {
              setType(e.target.value as RecordType | '')
              setPage(1)
            }}
          >
            <option value="">All</option>
            {RECORD_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="min-w-[120px]">
          <label
            htmlFor="filter-status"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Status
          </label>
          <Select
            id="filter-status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as RecordStatus | '')
              setPage(1)
            }}
          >
            <option value="">All</option>
            {RECORD_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="min-w-[180px]">
          <label
            htmlFor="filter-q"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Search title
          </label>
          <Input
            id="filter-q"
            type="search"
            placeholder="Search..."
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <div className="min-w-[140px]">
          <label
            htmlFor="filter-from"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            From
          </label>
          <Input
            id="filter-from"
            type="date"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <div className="min-w-[140px]">
          <label
            htmlFor="filter-to"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            To
          </label>
          <Input
            id="filter-to"
            type="date"
            value={to}
            onChange={(e) => {
              setTo(e.target.value)
              setPage(1)
            }}
          />
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-700 dark:text-red-400"
        >
          {error}
        </div>
      )}

      <RecordTable records={data} loading={loading} />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination aria-label="Records pagination">
          <PaginationPrevious
            href={hasPrev ? pageUrl(page - 1) : null}
            className={!hasPrev ? 'pointer-events-none opacity-50' : undefined}
          />
          <PaginationList>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                if (totalPages <= 7) return true
                if (p === 1 || p === totalPages) return true
                if (Math.abs(p - page) <= 1) return true
                return false
              })
              .map((p, idx, arr) => {
                const prev = arr[idx - 1]
                const showGap = prev != null && p - prev > 1
                return (
                  <span key={p} className="flex items-center gap-x-2">
                    {showGap && <PaginationGap />}
                    <PaginationPage
                      href={pageUrl(p)}
                      current={p === page}
                    >
                      {p}
                    </PaginationPage>
                  </span>
                )
              })}
          </PaginationList>
          <PaginationNext
            href={hasNext ? pageUrl(page + 1) : null}
            className={!hasNext ? 'pointer-events-none opacity-50' : undefined}
          />
        </Pagination>
      )}
    </div>
  )
}

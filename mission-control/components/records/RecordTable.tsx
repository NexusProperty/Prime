'use client'

import Link from 'next/link'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from '@/components/catalyst/table'
import { RecordStatusBadge } from './RecordStatusBadge'
import { RecordTypeIcon } from './RecordTypeIcon'
import type { RecordRow } from '@/hooks/useRecords'
import { EyeIcon } from '@heroicons/react/24/outline'

function formatCurrency(amount: number | null, currency: string | null): string {
  if (amount == null) return '—'
  const code = currency ?? 'NZD'
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: code,
  }).format(Number(amount))
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

interface RecordTableProps {
  records: RecordRow[]
  loading?: boolean
}

export function RecordTable({ records, loading }: RecordTableProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-950/10 dark:border-white/10 overflow-hidden">
        <Table striped>
          <TableHead>
            <TableRow>
              <TableHeader>Title</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Site</TableHeader>
              <TableHeader>Worker</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Amount</TableHeader>
              <TableHeader>Created</TableHeader>
              <TableHeader>
                <span className="sr-only">Actions</span>
              </TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <span className="inline-block h-4 w-32 animate-pulse rounded bg-zinc-200 dark:bg-white/10" />
                </TableCell>
                <TableCell>
                  <span className="inline-block h-4 w-16 animate-pulse rounded bg-zinc-200 dark:bg-white/10" />
                </TableCell>
                <TableCell>
                  <span className="inline-block h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-white/10" />
                </TableCell>
                <TableCell>
                  <span className="inline-block h-4 w-20 animate-pulse rounded bg-zinc-200 dark:bg-white/10" />
                </TableCell>
                <TableCell>
                  <span className="inline-block h-4 w-16 animate-pulse rounded bg-zinc-200 dark:bg-white/10" />
                </TableCell>
                <TableCell>
                  <span className="inline-block h-4 w-20 animate-pulse rounded bg-zinc-200 dark:bg-white/10" />
                </TableCell>
                <TableCell>
                  <span className="inline-block h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-white/10" />
                </TableCell>
                <TableCell />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-950/10 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5 px-6 py-12 text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No records found. Try adjusting your filters.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-zinc-950/10 dark:border-white/10 overflow-hidden">
      <Table striped>
        <TableHead>
          <TableRow>
            <TableHeader>Title</TableHeader>
            <TableHeader>Type</TableHeader>
            <TableHeader>Site</TableHeader>
            <TableHeader>Worker</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Amount</TableHeader>
            <TableHeader>Created</TableHeader>
            <TableHeader>
              <span className="sr-only">Actions</span>
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell>
                <span className="font-medium text-zinc-950 dark:text-white">
                  {record.title}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <RecordTypeIcon type={record.record_type} />
                  <span className="capitalize text-zinc-600 dark:text-zinc-300">
                    {record.record_type}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-zinc-600 dark:text-zinc-300">
                  {record.sites?.name ?? record.site_id}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-zinc-600 dark:text-zinc-300">
                  {record.workers?.full_name ?? '—'}
                </span>
              </TableCell>
              <TableCell>
                <RecordStatusBadge status={record.status} />
              </TableCell>
              <TableCell>
                <span className="text-zinc-600 dark:text-zinc-300">
                  {formatCurrency(record.amount, record.currency)}
                </span>
              </TableCell>
              <TableCell>
                <time
                  dateTime={record.created_at}
                  className="text-zinc-600 dark:text-zinc-300"
                >
                  {formatDate(record.created_at)}
                </time>
              </TableCell>
              <TableCell>
                <Link
                  href={`/records/${record.id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                  aria-label={`View ${record.title}`}
                  data-testid={`record-view-${record.id}`}
                >
                  <EyeIcon className="size-4" aria-hidden />
                  View
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

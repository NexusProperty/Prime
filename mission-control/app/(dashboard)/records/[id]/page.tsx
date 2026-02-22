import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { RecordStatusBadge } from '@/components/records/RecordStatusBadge'
import { RecordTypeIcon } from '@/components/records/RecordTypeIcon'
import {
  DescriptionList,
  DescriptionTerm,
  DescriptionDetails,
} from '@/components/catalyst/description-list'
import { Badge } from '@/components/catalyst/badge'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

function formatCurrency(amount: number | null, currency: string | null): string {
  if (amount == null) return '—'
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: currency ?? 'NZD',
  }).format(Number(amount))
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function RecordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: record, error: recordError } = await supabase
    .from('records')
    .select(
      'id, site_id, worker_id, contact_id, source_event_id, record_type, status, title, amount, currency, payload, tags, due_at, closed_at, created_at, updated_at, sites(id, name), workers(id, full_name), contacts(id, full_name, email, phone)'
    )
    .eq('id', id)
    .single()

  if (recordError || !record) notFound()

  const sourceEventId = record.source_event_id as string | null
  type AgentAction = {
    id: string
    agent_id: string
    action_type: string
    status: string
    confidence: number | null
    duration_ms: number | null
    created_at: string
    agents?: { name: string } | { name: string }[] | null
  }
  let agentActions: AgentAction[] = []
  type SourceEvent = { id: string; event_type: string; payload: unknown; created_at: string }
  let sourceEvent: SourceEvent | null = null

  if (sourceEventId) {
    const [actionsRes, eventRes] = await Promise.all([
      supabase
        .from('agent_actions')
        .select('id, agent_id, action_type, status, confidence, duration_ms, created_at, agents(name)')
        .eq('event_id', sourceEventId)
        .order('created_at', { ascending: true }),
      supabase
        .from('events')
        .select('id, event_type, payload, created_at')
        .eq('id', sourceEventId)
        .single(),
    ])
    agentActions = (actionsRes.data ?? []) as AgentAction[]
    sourceEvent = eventRes.data as SourceEvent | null
  }

  const payload = (record.payload ?? {}) as Record<string, unknown>

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/records"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <ArrowLeftIcon className="size-4" aria-hidden />
        Back to Records
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <RecordTypeIcon type={record.record_type as 'quote' | 'job' | 'invoice' | 'note' | 'booking' | 'task'} />
          <div>
            <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">
              {record.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <RecordStatusBadge status={record.status as 'open' | 'pending' | 'approved' | 'completed' | 'cancelled'} />
              <span className="text-sm capitalize text-zinc-500 dark:text-zinc-400">
                {record.record_type}
              </span>
              {(() => {
                const s = record.sites as { name: string } | { name: string }[] | null
                const name = Array.isArray(s) ? s[0]?.name : s?.name
                return name ? <Badge color="zinc">{name}</Badge> : null
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Meta panel */}
      <div className="rounded-xl border border-zinc-950/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 p-6">
        <h2 className="text-base font-semibold text-zinc-950 dark:text-white mb-4">
          Details
        </h2>
        <DescriptionList>
          <DescriptionTerm>Site</DescriptionTerm>
          <DescriptionDetails>
            {(() => {
              const s = record.sites as { name: string } | { name: string }[] | null
              const name = Array.isArray(s) ? s[0]?.name : s?.name
              return name ?? record.site_id
            })()}
          </DescriptionDetails>
          <DescriptionTerm>Worker</DescriptionTerm>
          <DescriptionDetails>
            {(() => {
              const w = record.workers as { full_name: string } | { full_name: string }[] | null
              const name = Array.isArray(w) ? w[0]?.full_name : w?.full_name
              return name ?? '—'
            })()}
          </DescriptionDetails>
          <DescriptionTerm>Contact</DescriptionTerm>
          <DescriptionDetails>
            {record.contacts ? (
              <span>
                {(() => {
                  const c = record.contacts as { full_name?: string; email?: string } | { full_name?: string; email?: string }[]
                  const obj = Array.isArray(c) ? c[0] : c
                  return (
                    <>
                      {obj?.full_name ?? '—'}
                      {obj?.email && (
                        <span className="text-zinc-500 dark:text-zinc-400">
                          {' '}
                          · {obj.email}
                        </span>
                      )}
                    </>
                  )
                })()}
              </span>
            ) : (
              '—'
            )}
          </DescriptionDetails>
          <DescriptionTerm>Amount</DescriptionTerm>
          <DescriptionDetails>
            {formatCurrency(record.amount, record.currency)}
          </DescriptionDetails>
          <DescriptionTerm>Due date</DescriptionTerm>
          <DescriptionDetails>{formatDate(record.due_at)}</DescriptionDetails>
          <DescriptionTerm>Created</DescriptionTerm>
          <DescriptionDetails>{formatDate(record.created_at)}</DescriptionDetails>
          <DescriptionTerm>Updated</DescriptionTerm>
          <DescriptionDetails>{formatDate(record.updated_at)}</DescriptionDetails>
        </DescriptionList>
      </div>

      {/* Payload (formatted JSON) */}
      {Object.keys(payload).length > 0 && (
        <div className="rounded-xl border border-zinc-950/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 p-6">
          <h2 className="text-base font-semibold text-zinc-950 dark:text-white mb-4">
            Payload
          </h2>
          <DescriptionList>
            {Object.entries(payload).map(([key, value]) => (
              <div key={key} className="contents">
                <DescriptionTerm>{key}</DescriptionTerm>
                <DescriptionDetails>
                  {typeof value === 'object' && value !== null ? (
                    <pre className="overflow-x-auto rounded bg-zinc-100 dark:bg-zinc-800/50 p-3 text-sm">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  ) : (
                    String(value)
                  )}
                </DescriptionDetails>
              </div>
            ))}
          </DescriptionList>
        </div>
      )}

      {/* Source event */}
      {sourceEvent && (
        <details className="rounded-xl border border-zinc-950/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 overflow-hidden">
          <summary className="cursor-pointer px-6 py-4 text-base font-semibold text-zinc-950 dark:text-white hover:bg-zinc-50 dark:hover:bg-white/5">
            Source Event ({sourceEvent.event_type})
          </summary>
          <div className="border-t border-zinc-950/5 dark:border-white/5 px-6 py-4">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
              Created {formatDate(sourceEvent.created_at)}
            </p>
            <pre className="overflow-x-auto rounded bg-zinc-100 dark:bg-zinc-800/50 p-4 text-sm text-zinc-800 dark:text-zinc-200">
              {JSON.stringify(sourceEvent.payload, null, 2)}
            </pre>
          </div>
        </details>
      )}

      {/* Agent timeline */}
      <div className="rounded-xl border border-zinc-950/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 overflow-hidden">
        <div className="border-b border-zinc-950/10 dark:border-white/10 px-6 py-4">
          <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
            Agent Timeline
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Actions taken by agents for this record&apos;s source event
          </p>
        </div>
        {agentActions.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No agent actions for this event
          </div>
        ) : (
          <ul className="divide-y divide-zinc-950/5 dark:divide-white/5">
            {agentActions.map((action) => (
              <li key={action.id} className="px-6 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-zinc-950 dark:text-white">
                    {Array.isArray(action.agents)
                      ? action.agents[0]?.name
                      : (action.agents as { name: string } | null)?.name ?? 'Unknown agent'}
                  </span>
                  <Badge
                    color={
                      action.status === 'success'
                        ? 'green'
                        : action.status === 'failed'
                          ? 'red'
                          : action.status === 'escalated'
                            ? 'amber'
                            : 'zinc'
                    }
                  >
                    {action.status}
                  </Badge>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {action.action_type}
                  </span>
                </div>
                <div className="mt-1 flex gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                  {action.confidence != null && (
                    <span>Confidence: {(action.confidence * 100).toFixed(0)}%</span>
                  )}
                  {action.duration_ms != null && (
                    <span>Duration: {action.duration_ms}ms</span>
                  )}
                  <time dateTime={action.created_at}>
                    {formatDate(action.created_at)}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

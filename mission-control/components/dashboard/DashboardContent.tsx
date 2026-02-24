/* Source: Tailwind Plus UI Kit — Application Shells, Data Display / Stats + Charts + Tables, Forms / Input Groups */

'use client'

import { useState, useRef, useMemo } from 'react'
import {
  Bar,
  BarChart,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import {
  BoltIcon,
  UsersIcon,
  FolderIcon,
  CpuChipIcon,
  SparklesIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  Squares2X2Icon,
  InformationCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  GlobeAltIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { useSite } from '@/lib/site-context'
import { useAnalytics } from '@/hooks/useAnalytics'
import type { AnalyticsSummary } from '@/hooks/useAnalytics'
import AgentSummaryRow from './AgentSummaryRow'
import { cn } from '@/lib/utils'

// ─── Shared tokens ─────────────────────────────────────────────────────────────
const CARD = 'rounded-2xl ring-1 ring-white/5 bg-zinc-900'

const TOOLTIP_STYLE = {
  backgroundColor: '#18181b',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '0.75rem',
  padding: '10px 14px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
}

// ─── Formatters ────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'm'
  if (n >= 1_000) return n.toLocaleString()
  return String(n)
}

function fmtDay(day: string): string {
  return new Date(day).toLocaleDateString('en-NZ', { month: 'short', day: 'numeric' })
}

// ─── Action Bar ────────────────────────────────────────────────────────────────
// Maps to screenshot: "Last updated now ✓ | Customize Widget | Imports | Exports"

function ActionBar() {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2 text-xs text-emerald-400">
        <CheckCircleIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>Last updated now</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors border border-white/5"
        >
          <Squares2X2Icon className="h-3.5 w-3.5" aria-hidden="true" />
          Customize
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors border border-white/5"
        >
          <ArrowDownTrayIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Imports
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
        >
          <ArrowUpTrayIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Exports
        </button>
      </div>
    </div>
  )
}

// ─── Stats Row ─────────────────────────────────────────────────────────────────
// Maps to screenshot: Leads 129 +2% | CLV 14d +4% | Conv 24% +2% | Revenue $1.4K +4%

interface StatsRowProps {
  data: AnalyticsSummary | null
  loading: boolean
}

function StatsRow({ data, loading }: StatsRowProps) {
  const agentTotal = data
    ? Object.values(data.agent_actions_by_status).reduce((a, b) => a + b, 0)
    : 0
  const recordsTotal = data
    ? Object.values(data.records_by_type).reduce((a, b) => a + b, 0)
    : 0

  const stats = [
    {
      label: 'Contacts',
      value: loading ? '—' : fmt(data?.contacts_total ?? 0),
      trend: '+2%',
      positive: true,
      note: 'vs last week',
      icon: UsersIcon,
    },
    {
      label: 'Events (7d)',
      value: loading ? '—' : fmt(data?.events_in_range ?? 0),
      trend: '+4%',
      positive: true,
      note: 'vs last week',
      icon: BoltIcon,
    },
    {
      label: 'Records',
      value: loading ? '—' : fmt(recordsTotal),
      trend: '+2%',
      positive: true,
      note: 'vs last week',
      icon: FolderIcon,
    },
    {
      label: 'Agent Actions',
      value: loading ? '—' : fmt(agentTotal),
      trend: data && data.agent_failures_last_hour > 0
        ? `${data.agent_failures_last_hour} fail`
        : '+4%',
      positive: !data || data.agent_failures_last_hour === 0,
      note: 'vs last month',
      icon: CpuChipIcon,
    },
  ]

  return (
    <div className={`${CARD} grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/5`}>
      {stats.map((stat, i) => (
        <div key={i} className="px-5 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">{stat.label}</span>
            <InformationCircleIcon
              className="h-3.5 w-3.5 text-gray-600 hover:text-gray-400 cursor-help transition-colors"
              aria-hidden="true"
            />
          </div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-semibold text-white tabular-nums">{stat.value}</span>
            <span
              className={cn(
                'flex items-center gap-0.5 text-xs font-semibold',
                stat.positive ? 'text-emerald-400' : 'text-rose-400',
              )}
            >
              {stat.positive
                ? <ArrowTrendingUpIcon className="h-3 w-3" aria-hidden="true" />
                : <ArrowTrendingDownIcon className="h-3 w-3" aria-hidden="true" />}
              {stat.trend}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-600">{stat.note}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Hero Chart Card ──────────────────────────────────────────────────────────
// Maps to screenshot: Revenue $32,209 +22% + [1D|1W|1M|3M|6M|1Y|ALL] + bar chart

type RangeKey = '1d' | '7d' | '30d'
const RANGE_OPTIONS: { label: string; value: RangeKey }[] = [
  { label: '1D', value: '1d' },
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
]

interface HeroChartCardProps {
  data: AnalyticsSummary | null
  loading: boolean
  range: RangeKey
  onRangeChange: (r: RangeKey) => void
}

function HeroChartCard({ data, loading, range, onRangeChange }: HeroChartCardProps) {
  const chartData = (data?.events_by_day ?? []).map((d) => ({
    ...d,
    label: fmtDay(d.day),
  }))

  return (
    <div className={`${CARD} p-6 flex flex-col h-full`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-gray-500">Events</span>
            <InformationCircleIcon className="h-3.5 w-3.5 text-gray-600" aria-hidden="true" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-semibold text-white tabular-nums">
              {loading ? '—' : fmt(data?.events_in_range ?? 0)}
            </span>
            <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-400">
              <ArrowTrendingUpIcon className="h-3 w-3" aria-hidden="true" />
              +22% vs last month
            </span>
          </div>
        </div>

        {/* Time range selector */}
        <div className="flex rounded-lg overflow-hidden ring-1 ring-white/10 shrink-0">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onRangeChange(opt.value)}
              className={cn(
                'px-2.5 py-1.5 text-xs font-medium transition-colors',
                range === opt.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-800 text-gray-400 hover:text-white hover:bg-zinc-700',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barSize={16}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="label"
              tick={{ fill: '#52525b', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
            />
            <YAxis
              tick={{ fill: '#52525b', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickCount={4}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              contentStyle={TOOLTIP_STYLE}
              labelStyle={{ color: '#71717a', fontSize: 11, marginBottom: 4 }}
              itemStyle={{ color: '#fb923c', fontSize: 13, fontWeight: 600 }}
              formatter={(v: number) => [v.toLocaleString(), 'Events']}
            />
            <Bar dataKey="cnt" fill="#f97316" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ─── Mini Calendar ────────────────────────────────────────────────────────────
// Maps to screenshot: October 2025 calendar widget with today highlighted

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function MiniCalendar() {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const cells: (number | null)[] = [
    ...Array<null>(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const isToday = (d: number) =>
    d === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear()

  function prev() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function next() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  return (
    <div>
      {/* Month header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-white">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={prev}
            className="p-1 rounded-md text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={next}
            className="p-1 rounded-md text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Next month"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-[10px] font-medium text-gray-600 pb-1">{d}</div>
        ))}
        {cells.map((day, i) => (
          <div
            key={i}
            className={cn(
              'text-xs py-1 mx-auto w-7 rounded-full flex items-center justify-center',
              day === null && 'invisible',
              day !== null && isToday(day)
                ? 'bg-indigo-600 text-white font-semibold'
                : day !== null
                  ? 'text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors'
                  : '',
            )}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Upcoming Activity Card ────────────────────────────────────────────────────
// Maps to screenshot: Calendar + upcoming meetings list

interface UpcomingActivityCardProps {
  data: AnalyticsSummary | null
  loading: boolean
}

function CalendarCard({ data, loading }: UpcomingActivityCardProps) {
  const topWorkers = data?.top_workers ?? []

  return (
    <div className={`${CARD} p-5 flex flex-col gap-5`}>
      <MiniCalendar />

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* Top workers / upcoming (mirrors screenshot's "upcoming meetings") */}
      <div>
        <p className="text-xs font-medium text-gray-500 mb-3">Top Workers</p>
        {loading && <p className="text-xs text-gray-600">Loading...</p>}
        {!loading && topWorkers.length === 0 && (
          <p className="text-xs text-gray-600">No worker data available</p>
        )}
        <div className="space-y-3">
          {topWorkers.slice(0, 3).map((w) => (
            <div
              key={w.worker_id}
              className="flex items-center gap-3 group"
            >
              <div className="h-8 w-8 shrink-0 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-semibold text-indigo-400">
                {w.full_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{w.full_name}</p>
                <p className="text-xs text-gray-500">{w.record_count} records</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Records by Status Card ───────────────────────────────────────────────────
// Maps to screenshot: "Leads Management" with Status/Sources/Qualification tabs + bars

const TYPE_COLORS = [
  'bg-indigo-500',
  'bg-orange-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-violet-500',
  'bg-sky-500',
]

interface RecordsByStatusCardProps {
  data: AnalyticsSummary | null
  loading: boolean
}

function RecordsByStatusCard({ data, loading }: RecordsByStatusCardProps) {
  const [activeTab, setActiveTab] = useState<'records' | 'agents'>('records')

  const recordEntries = useMemo(() => {
    if (!data) return []
    return Object.entries(data.records_by_type).sort(([, a], [, b]) => b - a)
  }, [data])

  const agentEntries = useMemo(() => {
    if (!data) return []
    return Object.entries(data.agent_actions_by_status).sort(([, a], [, b]) => b - a)
  }, [data])

  const entries = activeTab === 'records' ? recordEntries : agentEntries
  const total = entries.reduce((s, [, v]) => s + v, 0)

  return (
    <div className={`${CARD} p-5 flex flex-col`}>
      {/* Header with tabs */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Activity Breakdown</h3>
        <div className="flex rounded-lg overflow-hidden ring-1 ring-white/10">
          {(['records', 'agents'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-2.5 py-1 text-[10px] font-medium capitalize transition-colors',
                activeTab === tab
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-800 text-gray-500 hover:text-white',
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {!loading && total > 0 && (
        <p className="text-xs text-gray-500 mb-4">
          {total.toLocaleString()} total {activeTab}
        </p>
      )}

      <div className="space-y-3 flex-1">
        {loading && <p className="text-xs text-gray-600">Loading...</p>}
        {!loading && entries.length === 0 && (
          <p className="text-xs text-gray-600">No data available</p>
        )}
        {entries.map(([label, count], i) => {
          const pct = total > 0 ? (count / total) * 100 : 0
          return (
            <div key={label} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-xs text-gray-400 truncate capitalize">
                {label.replace(/_/g, ' ')}
              </span>
              <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`${TYPE_COLORS[i % TYPE_COLORS.length]} h-full rounded-full transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                  aria-label={`${label}: ${count}`}
                />
              </div>
              <span className="w-8 text-right text-xs text-gray-400 tabular-nums shrink-0">
                {count}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Sites Panel ──────────────────────────────────────────────────────────────
// Maps to screenshot: "Top Country" list with flag + % breakdown

const SITE_DOT_COLORS = ['bg-blue-500', 'bg-orange-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-violet-500']

interface SitesPanelProps {
  sites: Array<{ id: string; name: string; url: string; is_active: boolean }>
}

function SitesPanel({ sites }: SitesPanelProps) {
  return (
    <div className={`${CARD} p-5`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Sites</h3>
        <span className="text-xs text-gray-500">{sites.filter(s => s.is_active).length} active</span>
      </div>

      <div className="space-y-2.5">
        {sites.length === 0 && (
          <p className="text-xs text-gray-600">No sites configured</p>
        )}
        {sites.map((site, i) => (
          <div key={site.id} className="flex items-center justify-between gap-3 group">
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={cn('h-2 w-2 rounded-full shrink-0', SITE_DOT_COLORS[i % SITE_DOT_COLORS.length])}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-xs font-medium text-white truncate">{site.name}</p>
                <p className="text-[10px] text-gray-600 truncate">{site.url}</p>
              </div>
            </div>
            <span
              className={cn(
                'text-xs font-semibold shrink-0',
                site.is_active ? 'text-emerald-400' : 'text-gray-600',
              )}
            >
              {site.is_active ? 'Active' : 'Off'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Agent Success Rate Card ──────────────────────────────────────────────────
// Maps to screenshot: "Retention Rate 95% +12%" with segmented bar chart

const SPARK_GRADIENT = 'agentSparkGrad'

interface AgentSuccessCardProps {
  data: AnalyticsSummary | null
  loading: boolean
}

function AgentSuccessCard({ data, loading }: AgentSuccessCardProps) {
  const chartData = (data?.events_by_day ?? []).map((d) => ({
    ...d,
    label: fmtDay(d.day),
  }))

  const agentEntries = Object.entries(data?.agent_actions_by_status ?? {})
  const total = agentEntries.reduce((s, [, v]) => s + v, 0)
  const successCount = agentEntries
    .filter(([k]) => ['success', 'completed'].includes(k))
    .reduce((s, [, v]) => s + v, 0)
  const successRate = total > 0 ? Math.round((successCount / total) * 100) : 0

  return (
    <div className={`${CARD} p-5 flex flex-col`}>
      <div className="flex items-start justify-between mb-1">
        <h3 className="text-sm font-semibold text-white">Agent Success</h3>
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-3xl font-semibold text-white tabular-nums">
          {loading ? '—' : `${successRate}%`}
        </span>
        <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-400">
          <ArrowTrendingUpIcon className="h-3 w-3" aria-hidden="true" />
          +12% vs last month
        </span>
      </div>

      {/* Legend dots */}
      {!loading && agentEntries.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4">
          {agentEntries.map(([status], i) => (
            <div key={status} className="flex items-center gap-1">
              <span className={cn('h-2 w-2 rounded-full', TYPE_COLORS[i % TYPE_COLORS.length])} aria-hidden="true" />
              <span className="text-[10px] text-gray-500 capitalize">{status}</span>
            </div>
          ))}
        </div>
      )}

      {/* Sparkline */}
      <div className="flex-1 min-h-[110px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -32, bottom: 0 }}>
            <defs>
              <linearGradient id={SPARK_GRADIENT} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tick={{ fill: '#52525b', fontSize: 9 }}
              axisLine={false}
              tickLine={false}
              tickCount={4}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              labelStyle={{ color: '#71717a', fontSize: 10 }}
              itemStyle={{ color: '#a5b4fc', fontSize: 12, fontWeight: 600 }}
              formatter={(v: number) => [v.toLocaleString(), 'Events']}
            />
            <Area
              type="monotone"
              dataKey="cnt"
              stroke="#6366f1"
              strokeWidth={2}
              fill={`url(#${SPARK_GRADIENT})`}
              dot={false}
              activeDot={{ r: 4, fill: '#6366f1', stroke: '#18181b', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ─── Agents Section ────────────────────────────────────────────────────────────

function AgentsSection({
  agents,
}: {
  agents: Array<{ id: string; name: string; type: string; is_active: boolean }>
}) {
  if (agents.length === 0) return null
  return (
    <div className={`${CARD} overflow-hidden`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <CpuChipIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-white">Registered Agents</h2>
        </div>
        <span className="text-xs text-gray-500">{agents.length} total</span>
      </div>
      <ul role="list" className="divide-y divide-white/5">
        {agents.map((agent) => (
          <li key={agent.id} className="px-6 py-4 hover:bg-white/2 transition-colors">
            <AgentSummaryRow name={agent.name} type={agent.type} isActive={agent.is_active} />
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── AI Prompt Bar ─────────────────────────────────────────────────────────────

function AiPromptBar() {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div className="relative rounded-2xl overflow-hidden p-6 flex flex-col items-center justify-center min-h-[160px]">
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-r from-indigo-600 via-violet-600 to-indigo-400 blur-3xl opacity-15 animate-pulse pointer-events-none" />
      <div aria-hidden="true" className="absolute -top-8 left-1/3 h-32 w-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 w-full max-w-2xl text-center mb-4">
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">Mission AI</p>
        <h3 className="text-base font-semibold text-white">What would you like to analyse?</h3>
      </div>
      <div className="relative z-10 w-full max-w-2xl backdrop-blur-md bg-zinc-900/80 ring-1 ring-white/10 rounded-full p-1.5 flex items-center shadow-xl focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
        <span className="pl-3 pr-2 shrink-0" aria-hidden="true">
          <SparklesIcon className="h-4 w-4 text-indigo-400" />
        </span>
        <input
          ref={inputRef}
          type="text"
          aria-label="Ask Mission AI"
          placeholder="Ask about your sites, agents, events..."
          className="w-full bg-transparent border-transparent focus:border-transparent focus:ring-0 text-sm text-white placeholder-gray-600 outline-none"
        />
        <button
          type="button"
          className="ml-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-4 py-1.5 text-xs font-semibold transition-colors shrink-0"
        >
          Ask
        </button>
      </div>
    </div>
  )
}

// ─── Main Export ───────────────────────────────────────────────────────────────

interface Agent {
  id: string
  name: string
  type: string
  is_active: boolean
}

interface SiteRow {
  id: string
  name: string
  url: string
  is_active: boolean
}

interface DashboardContentProps {
  sites: SiteRow[]
  agents: Agent[]
  rangeLabel: string
}

export default function DashboardContent({ sites, agents, rangeLabel }: DashboardContentProps) {
  const { activeSite } = useSite()
  const [range, setRange] = useState<RangeKey>('7d')
  const { data, loading } = useAnalytics(activeSite?.id ?? null, range)

  return (
    <div className="space-y-4">
      {/* Page heading */}
      <div>
        <p className="text-xs text-gray-500 mb-0.5">
          {activeSite ? activeSite.name : 'All Sites'} · Last {rangeLabel}
        </p>
        <h1 className="text-xl font-semibold text-white tracking-tight">Dashboard</h1>
      </div>

      {/* Action bar — matches screenshot top row */}
      <ActionBar />

      {/* Stats row — 4 inline metrics */}
      <StatsRow data={data} loading={loading} />

      {/* Main 2-column: chart (wider) + calendar panel */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
        <HeroChartCard data={data} loading={loading} range={range} onRangeChange={setRange} />
        <CalendarCard data={data} loading={loading} />
      </div>

      {/* Bottom 3-column: records breakdown + sites + agent success */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RecordsByStatusCard data={data} loading={loading} />
        <SitesPanel sites={sites} />
        <AgentSuccessCard data={data} loading={loading} />
      </div>

      {/* Agents list */}
      <AgentsSection agents={agents} />

      {/* AI prompt */}
      <AiPromptBar />
    </div>
  )
}

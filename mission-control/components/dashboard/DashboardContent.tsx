'use client'

import {
  BoltIcon,
  CpuChipIcon,
  FolderIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { useSite } from '@/lib/site-context'
import { useAnalytics } from '@/hooks/useAnalytics'
import AgentSummaryRow from './AgentSummaryRow'
import EventsChart from './EventsChart'
import SiteHealthTable from './SiteHealthTable'
import StatCard from './StatCard'

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

export default function DashboardContent({
  sites,
  agents,
  rangeLabel,
}: DashboardContentProps) {
  const { activeSite } = useSite()
  const { data, loading } = useAnalytics(activeSite?.id ?? null, '7d')

  const totalRecords = data
    ? Object.values(data.records_by_type).reduce((a, b) => a + b, 0)
    : 0
  const agentActionTotal = data
    ? Object.values(data.agent_actions_by_status).reduce((a, b) => a + b, 0)
    : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">
          {activeSite ? activeSite.name : 'All Sites'} · Last {rangeLabel}
        </p>
      </div>

      {/* KPI Stats */}
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Contacts"
          value={loading ? '—' : (data?.contacts_total ?? 0).toLocaleString()}
          icon={UsersIcon}
        />
        <StatCard
          label="Events (7d)"
          value={loading ? '—' : (data?.events_in_range ?? 0).toLocaleString()}
          sub={data ? `${data.events_unprocessed} unprocessed` : undefined}
          subPositive={data ? data.events_unprocessed === 0 : undefined}
          icon={BoltIcon}
        />
        <StatCard
          label="Records Created (7d)"
          value={loading ? '—' : totalRecords.toLocaleString()}
          icon={FolderIcon}
        />
        <StatCard
          label="Agent Actions (7d)"
          value={loading ? '—' : agentActionTotal.toLocaleString()}
          sub={data ? `${data.agent_failures_last_hour} failures (1h)` : undefined}
          subPositive={
            data ? data.agent_failures_last_hour === 0 : undefined
          }
          icon={CpuChipIcon}
        />
      </dl>

      {/* Events chart + Site health side by side on large screens */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <EventsChart data={data?.events_by_day ?? []} title="Events per Day (7d)" />
        <SiteHealthTable sites={sites} />
      </div>

      {/* Agents section */}
      {agents.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-gray-900">
          <div className="border-b border-white/10 px-6 py-4">
            <h2 className="text-sm font-semibold text-white">Active Agents</h2>
          </div>
          <ul role="list" className="divide-y divide-white/10">
            {agents.map((agent) => (
              <li key={agent.id} className="px-6 py-4">
                <AgentSummaryRow
                  name={agent.name}
                  type={agent.type}
                  isActive={agent.is_active}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

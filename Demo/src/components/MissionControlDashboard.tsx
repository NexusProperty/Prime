/* Source: Tailwind Plus UI Kit — Application Shells / Sidebar Layouts, Data Display / Stats + Tables, Overlays / Dropdowns, Forms / Input Groups */

'use client'

import { useState } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  MagnifyingGlassIcon,
  BellIcon,
  UserCircleIcon,
  SparklesIcon,
  HomeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  PuzzlePieceIcon,
  DocumentTextIcon,
  EllipsisVerticalIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowRightIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline'

// --- Mock Data ---

const performanceData = [
  { month: 'Jan', revenue: 65000, ops: 1200 },
  { month: 'Feb', revenue: 72000, ops: 1450 },
  { month: 'Mar', revenue: 68000, ops: 1380 },
  { month: 'Apr', revenue: 79000, ops: 1620 },
  { month: 'May', revenue: 81000, ops: 1780 },
  { month: 'Jun', revenue: 84500, ops: 2845 },
]

const stats = [
  { label: 'Total Revenue', value: '$84,500', trend: '+12%', up: true },
  { label: 'Active Missions', value: '14', trend: '+2', up: true },
  { label: 'System Health', value: '99.9%', trend: 'Stable', up: true },
  { label: 'AI Operations', value: '2,845', trend: '+24%', up: true },
]

const recentActivity = [
  { id: 1, label: 'AI Workflow #1204', detail: 'Processed 45 nodes successfully.', time: '2m ago' },
  { id: 2, label: 'Data Sync #0891', detail: 'Synced 1,203 records from API.', time: '11m ago' },
  { id: 3, label: 'Alert: High Load', detail: 'CPU peaked at 89% on node-07.', time: '34m ago' },
  { id: 4, label: 'AI Workflow #1199', detail: 'Completed with 2 warnings.', time: '1h ago' },
  { id: 5, label: 'Deploy: v2.4.1', detail: 'Rolled out to production cluster.', time: '2h ago' },
]

const transactions = [
  { id: 'INV-0041', client: 'Apex Systems', amount: '$12,400', status: 'Paid', date: 'Jun 14', statusColor: 'emerald' },
  { id: 'INV-0040', client: 'Northstar Inc.', amount: '$8,750', status: 'Pending', date: 'Jun 12', statusColor: 'amber' },
  { id: 'INV-0039', client: 'Vantage AI', amount: '$31,200', status: 'Paid', date: 'Jun 10', statusColor: 'emerald' },
  { id: 'INV-0038', client: 'BlueWave Corp', amount: '$5,900', status: 'Overdue', date: 'Jun 5', statusColor: 'red' },
  { id: 'INV-0037', client: 'Orbital Labs', amount: '$18,600', status: 'Paid', date: 'Jun 2', statusColor: 'emerald' },
]

const navItems = [
  { label: 'Overview', icon: HomeIcon, href: '#', active: true },
  { label: 'Analytics', icon: ChartBarIcon, href: '#', active: false },
  { label: 'Reports', icon: DocumentTextIcon, href: '#', active: false },
  { label: 'Integrations', icon: PuzzlePieceIcon, href: '#', active: false },
  { label: 'Settings', icon: Cog6ToothIcon, href: '#', active: false },
]

const cardActions = ['View Details', 'Export Data', 'Set Alert', 'Archive']

// --- Pure-SVG Area Chart (no external dependencies) ---

interface AreaChartProps {
  data: typeof performanceData
  dataKey: 'revenue' | 'ops'
  color: string
}

function AreaChart({ data, dataKey, color }: AreaChartProps) {
  const values = data.map((d) => d[dataKey])
  const max = Math.max(...values)
  const min = Math.min(...values) * 0.95
  const W = 400
  const H = 140
  const pad = { top: 12, right: 8, bottom: 28, left: 8 }

  const toX = (i: number) => pad.left + (i / (data.length - 1)) * (W - pad.left - pad.right)
  const toY = (v: number) => pad.top + (1 - (v - min) / (max - min)) * (H - pad.top - pad.bottom)

  const pts = data.map((d, i) => `${toX(i)},${toY(d[dataKey])}`).join(' ')
  const areaPath = `M ${toX(0)},${toY(data[0][dataKey])} ${data
    .map((d, i) => `L ${toX(i)},${toY(d[dataKey])}`)
    .join(' ')} L ${toX(data.length - 1)},${H - pad.bottom} L ${toX(0)},${H - pad.bottom} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((t) => (
        <line
          key={t}
          x1={pad.left}
          y1={pad.top + t * (H - pad.top - pad.bottom)}
          x2={W - pad.right}
          y2={pad.top + t * (H - pad.top - pad.bottom)}
          stroke="currentColor"
          strokeOpacity="0.06"
          strokeWidth="1"
          className="text-zinc-500"
        />
      ))}
      {/* Area fill */}
      <path d={areaPath} fill={`url(#grad-${dataKey})`} />
      {/* Line */}
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Data points */}
      {data.map((d, i) => (
        <circle key={i} cx={toX(i)} cy={toY(d[dataKey])} r="3" fill={color} stroke="white" strokeWidth="1.5" />
      ))}
      {/* X-axis labels */}
      {data.map((d, i) => (
        <text
          key={i}
          x={toX(i)}
          y={H - 6}
          textAnchor="middle"
          fontSize="9"
          fill="currentColor"
          fillOpacity="0.5"
          className="text-zinc-500 font-mono"
        >
          {d.month}
        </text>
      ))}
    </svg>
  )
}

// --- Stat Card with Headless UI Dropdown ---

interface StatCardProps {
  stat: (typeof stats)[0]
}

function StatCard({ stat }: StatCardProps) {
  return (
    <article className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm ring-1 ring-zinc-900/5 dark:ring-white/10 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</span>
        {/* Source: Tailwind Plus UI Kit — Overlays / Dropdowns */}
        <Menu as="div" className="relative -mr-1">
          <MenuButton
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            aria-label={`Actions for ${stat.label}`}
          >
            <EllipsisVerticalIcon className="h-4 w-4" />
          </MenuButton>
          <MenuItems className="absolute right-0 mt-1 w-40 rounded-xl bg-white dark:bg-zinc-800 shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none z-20 py-1">
            {cardActions.map((action) => (
              <MenuItem key={action}>
                {({ focus }) => (
                  <button
                    className={`${focus ? 'bg-zinc-50 dark:bg-zinc-700' : ''} block w-full px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors`}
                  >
                    {action}
                  </button>
                )}
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>
      </div>

      <div className="text-3xl font-display font-semibold text-gray-900 dark:text-white tracking-tight mb-3">
        {stat.value}
      </div>

      <div className="flex items-center gap-1.5">
        {stat.up ? (
          <ArrowTrendingUpIcon className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
        ) : (
          <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 shrink-0" aria-hidden="true" />
        )}
        {/* Source: Tailwind Plus UI Kit — Elements / Badges */}
        <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
          {stat.trend}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500">vs last month</span>
      </div>
    </article>
  )
}

// --- Status badge for table ---

function StatusBadge({ status, color }: { status: string; color: string }) {
  const styles: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20',
    amber: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20',
    red: 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20',
  }
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${styles[color]}`}>
      {status}
    </span>
  )
}

// --- Main Dashboard ---

export function MissionControlDashboard() {
  const [activeChart, setActiveChart] = useState<'revenue' | 'ops'>('revenue')

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-zinc-950 font-sans text-gray-900 dark:text-gray-100 overflow-hidden">

      {/* Source: Tailwind Plus UI Kit — Application Shells / Sidebar Layouts */}
      <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-linear-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            M
          </div>
          <span className="font-display font-semibold text-lg tracking-tight">Mission Control</span>
        </div>

        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto" aria-label="Sidebar navigation">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                item.active
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-sky-600 dark:text-sky-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            className="flex w-full items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 min-h-[44px]"
          >
            <UserCircleIcon className="h-8 w-8 text-gray-400 shrink-0" aria-hidden="true" />
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate">admin@prime.ai</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 shrink-0 z-10">
          {/* Source: Tailwind Plus UI Kit — Forms / Input Groups */}
          <div className="flex-1 max-w-sm relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search missions..."
              aria-label="Search"
              className="w-full pl-9 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800 border-transparent rounded-full text-sm focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-2 ml-4">
            <button
              type="button"
              aria-label="Notifications (3 unread)"
              className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-sky-500 ring-2 ring-white dark:ring-zinc-900" aria-hidden="true" />
              <BellIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">

            {/* Page Heading */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-display font-bold tracking-tight text-gray-900 dark:text-white">
                Mission Overview
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Monitor your systems and active AI tasks in real time.
              </p>
            </div>

            {/* Source: Tailwind Plus UI Kit — Data Display / Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              {stats.map((stat) => (
                <StatCard key={stat.label} stat={stat} />
              ))}
            </div>

            {/* Main Grid: Chart + Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">

              {/* Performance Chart */}
              <article className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm ring-1 ring-zinc-900/5 dark:ring-white/10 p-6 flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">Performance Metrics</h2>
                  {/* Chart toggle */}
                  <div className="flex rounded-lg overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-700">
                    {(['revenue', 'ops'] as const).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setActiveChart(key)}
                        className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                          activeChart === key
                            ? 'bg-sky-500 text-white'
                            : 'bg-white dark:bg-zinc-900 text-gray-500 dark:text-gray-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        {key === 'revenue' ? 'Revenue' : 'AI Ops'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 min-h-[160px]">
                  <AreaChart
                    data={performanceData}
                    dataKey={activeChart}
                    color={activeChart === 'revenue' ? '#0ea5e9' : '#8b5cf6'}
                  />
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${activeChart === 'revenue' ? 'bg-sky-500' : 'bg-violet-500'}`} />
                    {activeChart === 'revenue' ? 'Monthly revenue (USD)' : 'AI operations processed'}
                  </span>
                </div>
              </article>

              {/* Source: Tailwind Plus UI Kit — Lists / Stacked Lists */}
              <article className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm ring-1 ring-zinc-900/5 dark:ring-white/10 overflow-hidden flex flex-col">
                <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                  <button type="button" className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1">
                    View all <ArrowRightIcon className="h-3 w-3" aria-hidden="true" />
                  </button>
                </div>
                <ul className="flex-1 divide-y divide-zinc-100 dark:divide-zinc-800 overflow-y-auto" role="list">
                  {recentActivity.map((item) => (
                    <li
                      key={item.id}
                      className="px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors flex items-start gap-3 cursor-pointer"
                    >
                      <div className="mt-0.5 h-8 w-8 rounded-full bg-sky-100 dark:bg-sky-500/20 flex items-center justify-center shrink-0">
                        <SparklesIcon className="h-4 w-4 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.detail}</p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap mt-0.5">{item.time}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>

            {/* Source: Tailwind Plus UI Kit — Data Display / Tables */}
            <article className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm ring-1 ring-zinc-900/5 dark:ring-white/10 overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TableCellsIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">Invoice Ledger</h2>
                </div>
                <button type="button" className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1">
                  Export <ArrowRightIcon className="h-3 w-3" aria-hidden="true" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm" aria-label="Invoice ledger">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800">
                      {['Invoice', 'Client', 'Amount', 'Status', 'Date', ''].map((col) => (
                        <th
                          key={col}
                          scope="col"
                          className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors group">
                        <td className="px-5 py-3.5 font-mono text-xs text-gray-500 dark:text-gray-400">{tx.id}</td>
                        <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">{tx.client}</td>
                        <td className="px-5 py-3.5 font-semibold text-gray-900 dark:text-white tabular-nums">{tx.amount}</td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={tx.status} color={tx.statusColor} />
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{tx.date}</td>
                        <td className="px-5 py-3.5">
                          {/* Source: Tailwind Plus UI Kit — Overlays / Dropdowns */}
                          <Menu as="div" className="relative flex justify-end">
                            <MenuButton
                              type="button"
                              className="p-1 rounded-md text-gray-300 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-all focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                              aria-label={`Actions for ${tx.id}`}
                            >
                              <EllipsisVerticalIcon className="h-4 w-4" />
                            </MenuButton>
                            <MenuItems className="absolute right-0 mt-1 w-36 rounded-xl bg-white dark:bg-zinc-800 shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none z-20 py-1">
                              {['View Invoice', 'Download PDF', 'Send Reminder', 'Void'].map((action) => (
                                <MenuItem key={action}>
                                  {({ focus }) => (
                                    <button
                                      type="button"
                                      className={`${focus ? 'bg-zinc-50 dark:bg-zinc-700' : ''} block w-full px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors`}
                                    >
                                      {action}
                                    </button>
                                  )}
                                </MenuItem>
                              ))}
                            </MenuItems>
                          </Menu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            {/* Source: Tailwind Plus UI Blocks — AI / Chat Interfaces */}
            <div className="relative rounded-3xl overflow-hidden p-8 flex flex-col items-center justify-center min-h-[220px]">
              {/* Glowing orb background */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-r from-sky-400 via-purple-500 to-emerald-500 blur-3xl opacity-20 dark:opacity-40 animate-pulse pointer-events-none"
              />
              <div
                aria-hidden="true"
                className="absolute -top-8 left-1/4 h-48 w-48 bg-sky-500/20 rounded-full blur-2xl pointer-events-none"
              />

              <div className="relative z-10 w-full max-w-2xl text-center mb-5">
                <p className="text-xs font-medium text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-2">Mission AI</p>
                <h3 className="text-xl font-display font-medium text-gray-900 dark:text-white">
                  What would you like to analyze next?
                </h3>
              </div>

              {/* Source: Tailwind Plus UI Kit — Forms / Input Groups — Floating Prompt Bar */}
              <div className="relative z-10 w-full max-w-2xl backdrop-blur-md bg-white/70 dark:bg-black/50 ring-1 ring-zinc-900/10 dark:ring-white/20 rounded-full p-2 flex items-center shadow-lg transition-all focus-within:ring-2 focus-within:ring-sky-500">
                <span className="pl-4 pr-2 shrink-0" aria-hidden="true">
                  <SparklesIcon className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                </span>
                <input
                  type="text"
                  aria-label="AI prompt"
                  placeholder="Ask the AI about your missions..."
                  className="w-full bg-transparent border-transparent focus:border-transparent focus:ring-0 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none"
                />
                <button
                  type="button"
                  className="ml-2 bg-sky-500 hover:bg-sky-600 text-white rounded-full px-5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 shrink-0"
                >
                  Send
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Source: Tailwind Plus UI Kit — Navigation / Bottom Navigation — Mobile only */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 inset-x-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border-t border-zinc-200 dark:border-zinc-800 z-30"
      >
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
              className={`flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${
                item.active
                  ? 'text-sky-600 dark:text-sky-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">{item.label}</span>
            </a>
          ))}
        </div>
      </nav>

    </div>
  )
}

export default MissionControlDashboard

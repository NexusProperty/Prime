/* Source: Tailwind Plus UI Kit — Navigation / Tabs — Spreadsheet | Timeline | Kanban shell */

'use client'

import { useState } from 'react'
import {
  TableCellsIcon,
  CalendarDaysIcon,
  ViewColumnsIcon,
  PlusIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

type ViewMode = 'spreadsheet' | 'timeline' | 'kanban'

interface Tab {
  id: ViewMode
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const TABS: Tab[] = [
  { id: 'spreadsheet', label: 'Spreadsheet', icon: TableCellsIcon },
  { id: 'timeline', label: 'Timeline', icon: CalendarDaysIcon },
  { id: 'kanban', label: 'Kanban', icon: ViewColumnsIcon },
]

interface RecordsShellProps {
  title?: string
  breadcrumb?: string
  /** Rendered for the "spreadsheet" (default table) view */
  children: React.ReactNode
  /** Optional content for the timeline view */
  timelineContent?: React.ReactNode
  /** Optional content for the kanban view */
  kanbanContent?: React.ReactNode
  onNewRecord?: () => void
}

export function RecordsShell({
  title = 'Records',
  breadcrumb,
  children,
  timelineContent,
  kanbanContent,
  onNewRecord,
}: RecordsShellProps) {
  const [activeView, setActiveView] = useState<ViewMode>('spreadsheet')

  return (
    <div className="flex flex-col h-full space-y-0">
      {/* Breadcrumb + title */}
      <div className="flex items-center justify-between pb-4">
        <div>
          {breadcrumb && (
            <p className="text-xs text-gray-500 mb-0.5">{breadcrumb}</p>
          )}
          <h1 className="text-xl font-semibold text-white tracking-tight">{title}</h1>
        </div>
        {onNewRecord && (
          <button
            type="button"
            onClick={onNewRecord}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            <PlusIcon className="h-4 w-4" aria-hidden="true" />
            New Record
          </button>
        )}
      </div>

      {/* Tab bar — matches screenshot: Spreadsheet | Timeline | Kanban + Filter */}
      <div className="flex items-center justify-between border-b border-white/5 pb-0 mb-5">
        <div className="flex items-center gap-1" role="tablist" aria-label="View mode">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeView === tab.id}
              onClick={() => setActiveView(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-t-lg border-b-2 transition-all',
                activeView === tab.id
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5',
              )}
            >
              <tab.icon className="h-3.5 w-3.5" aria-hidden="true" />
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors mb-0.5"
        >
          <AdjustmentsHorizontalIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Filter
        </button>
      </div>

      {/* Tab panels */}
      <div role="tabpanel" aria-label={`${activeView} view`} className="flex-1">
        {activeView === 'spreadsheet' && children}

        {activeView === 'timeline' && (
          timelineContent ?? <TimelinePlaceholder />
        )}

        {activeView === 'kanban' && (
          kanbanContent ?? <KanbanPlaceholder />
        )}
      </div>
    </div>
  )
}

// ─── Placeholder views ─────────────────────────────────────────────────────────

function TimelinePlaceholder() {
  const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']
  const now = new Date()
  const currentHour = now.getHours()

  return (
    <div className="rounded-2xl ring-1 ring-white/5 bg-zinc-900 overflow-hidden">
      {/* Time header */}
      <div className="grid border-b border-white/5" style={{ gridTemplateColumns: `180px repeat(${hours.length}, 1fr)` }}>
        <div className="px-4 py-3 text-xs text-gray-600 border-r border-white/5">Task</div>
        {hours.map((h) => {
          const hNum = parseInt(h)
          const isNow = hNum === currentHour
          return (
            <div
              key={h}
              className={cn(
                'px-3 py-3 text-xs text-center border-r border-white/5 last:border-r-0',
                isNow ? 'text-indigo-400 font-semibold bg-indigo-500/5' : 'text-gray-500',
              )}
            >
              {h} {hNum < 12 ? 'AM' : 'PM'}
            </div>
          )
        })}
      </div>

      {/* Placeholder rows */}
      {['Design Review', 'Agent Sync', 'Data Pipeline', 'Site Audit', 'Deploy'].map((task, i) => (
        <div
          key={task}
          className="grid border-b border-white/5 last:border-b-0 hover:bg-white/2 transition-colors"
          style={{ gridTemplateColumns: `180px repeat(${hours.length}, 1fr)` }}
        >
          <div className="px-4 py-4 text-xs font-medium text-gray-400 border-r border-white/5 truncate">
            {task}
          </div>
          {hours.map((h, j) => {
            const showBlock = j === i % hours.length
            return (
              <div key={h} className="relative px-1 py-3 border-r border-white/5 last:border-r-0">
                {showBlock && (
                  <div className="absolute inset-x-1 inset-y-2 rounded-md bg-indigo-500/20 border border-indigo-500/30 flex items-center px-2">
                    <span className="text-[10px] text-indigo-400 truncate">{task}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function KanbanPlaceholder() {
  const columns = [
    { label: 'To Do', color: 'text-gray-400', items: ['Plan architecture', 'Design mockups', 'Write specs'] },
    { label: 'In Progress', color: 'text-amber-400', items: ['Build dashboard', 'API integration', 'Testing'] },
    { label: 'In Review', color: 'text-indigo-400', items: ['Code review', 'QA sign-off'] },
    { label: 'Done', color: 'text-emerald-400', items: ['Initial setup', 'Auth flow', 'DB schema'] },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((col) => (
        <div key={col.label} className="rounded-2xl ring-1 ring-white/5 bg-zinc-900 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-xs font-semibold ${col.color}`}>{col.label}</h3>
            <span className="text-xs text-gray-600">{col.items.length}</span>
          </div>
          <div className="space-y-2">
            {col.items.map((item) => (
              <div
                key={item}
                className="rounded-lg bg-zinc-800 ring-1 ring-white/5 p-3 hover:ring-white/10 transition-all cursor-pointer"
              >
                <p className="text-xs text-gray-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

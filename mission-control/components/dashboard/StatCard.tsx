/* Source: Tailwind Plus UI Kit — Data Display / Stats + Overlays / Dropdowns */

'use client'

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

type StatColor = 'indigo' | 'violet' | 'emerald' | 'sky' | 'amber' | 'rose'

export interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  subPositive?: boolean
  icon?: React.ComponentType<{ className?: string }>
  color?: StatColor
  trend?: number
  actions?: string[]
}

const colorMap: Record<StatColor, { icon: string; badge: string; trend: string }> = {
  indigo: {
    icon: 'bg-indigo-500/15 text-indigo-400',
    badge: 'bg-indigo-500/10 text-indigo-300 ring-indigo-500/20',
    trend: 'text-indigo-400',
  },
  violet: {
    icon: 'bg-violet-500/15 text-violet-400',
    badge: 'bg-violet-500/10 text-violet-300 ring-violet-500/20',
    trend: 'text-violet-400',
  },
  emerald: {
    icon: 'bg-emerald-500/15 text-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/20',
    trend: 'text-emerald-400',
  },
  sky: {
    icon: 'bg-sky-500/15 text-sky-400',
    badge: 'bg-sky-500/10 text-sky-300 ring-sky-500/20',
    trend: 'text-sky-400',
  },
  amber: {
    icon: 'bg-amber-500/15 text-amber-400',
    badge: 'bg-amber-500/10 text-amber-300 ring-amber-500/20',
    trend: 'text-amber-400',
  },
  rose: {
    icon: 'bg-rose-500/15 text-rose-400',
    badge: 'bg-rose-500/10 text-rose-300 ring-rose-500/20',
    trend: 'text-rose-400',
  },
}

const defaultActions = ['View Details', 'Export Data', 'Set Alert']

export default function StatCard({
  label,
  value,
  sub,
  subPositive,
  icon: Icon,
  color = 'indigo',
  trend,
  actions = defaultActions,
}: StatCardProps) {
  const colors = colorMap[color]

  const subColor =
    subPositive === true
      ? 'text-emerald-400'
      : subPositive === false
        ? 'text-rose-400'
        : 'text-gray-500'

  return (
    <div className="rounded-2xl ring-1 ring-white/10 bg-gray-900 shadow-sm p-6 flex flex-col gap-4 hover:ring-white/20 transition-all">
      {/* Header row: label + actions */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          {Icon != null && (
            <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', colors.icon)}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
          )}
          <p className="text-sm font-medium text-gray-400 leading-tight">{label}</p>
        </div>

        {/* Source: Tailwind Plus UI Kit — Overlays / Dropdowns */}
        <Menu as="div" className="relative shrink-0">
          <MenuButton
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 hover:text-gray-400 hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label={`Actions for ${label}`}
          >
            <EllipsisVerticalIcon className="h-4 w-4" />
          </MenuButton>
          <MenuItems className="absolute right-0 mt-1 w-40 rounded-xl bg-gray-800 ring-1 ring-white/10 shadow-xl focus:outline-none z-20 py-1">
            {actions.map((action) => (
              <MenuItem key={action}>
                {({ focus }) => (
                  <button
                    type="button"
                    className={cn(
                      'block w-full px-4 py-2 text-left text-xs font-medium text-gray-300 transition-colors',
                      focus && 'bg-white/5 text-white',
                    )}
                  >
                    {action}
                  </button>
                )}
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-3">
        <p className="text-3xl font-semibold text-white tabular-nums tracking-tight">{value}</p>
        {trend != null && (
          <span className={cn('flex items-center gap-1 text-xs font-medium ring-1 ring-inset rounded-md px-2 py-0.5', colors.badge)}>
            {trend >= 0 ? (
              <ArrowTrendingUpIcon className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ArrowTrendingDownIcon className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>

      {/* Sub text */}
      {sub != null && (
        <p className={cn('text-sm', subColor)}>{sub}</p>
      )}
    </div>
  )
}

/* Source: Tailwind Plus UI Kit — Data Display / Charts — Area chart with gradient fill */

'use client'

import { useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export interface EventsChartProps {
  data: Array<{ day: string; cnt: number }>
  title?: string
}

function formatDay(day: string): string {
  return new Date(day).toLocaleDateString('en-NZ', {
    month: 'short',
    day: 'numeric',
  })
}

const GRADIENT_ID = 'eventsGradient'

export default function EventsChart({ data, title }: EventsChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const chartData = data.map((d) => ({
    ...d,
    formattedDay: formatDay(d.day),
  }))

  const peak = Math.max(...data.map((d) => d.cnt), 1)

  return (
    <div className="rounded-2xl ring-1 ring-white/10 bg-gray-900 shadow-sm p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        {title != null && (
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        )}
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="h-2 w-2 rounded-full bg-indigo-400 shrink-0" aria-hidden="true" />
          Events / day
        </div>
      </div>

      {/* Peak stat */}
      {data.length > 0 && (
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold text-white tabular-nums">
            {data.reduce((s, d) => s + d.cnt, 0).toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">total events</span>
        </div>
      )}

      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <defs>
              <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="rgba(255,255,255,0.05)"
              strokeDasharray="0"
            />

            <XAxis
              dataKey="formattedDay"
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
            />

            <YAxis
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickCount={4}
            />

            <Tooltip
              cursor={{ stroke: 'rgba(99,102,241,0.3)', strokeWidth: 1 }}
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                padding: '10px 14px',
              }}
              labelStyle={{ color: '#9ca3af', fontSize: 11, marginBottom: 4 }}
              itemStyle={{ color: '#a5b4fc', fontSize: 13, fontWeight: 600 }}
              formatter={(value: number) => [value.toLocaleString(), 'Events']}
              labelFormatter={(label) => label}
            />

            <Area
              type="monotone"
              dataKey="cnt"
              stroke="#6366f1"
              strokeWidth={2}
              fill={`url(#${GRADIENT_ID})`}
              dot={false}
              activeDot={{
                r: 5,
                fill: '#6366f1',
                stroke: '#1f2937',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

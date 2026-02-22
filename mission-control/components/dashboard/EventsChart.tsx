'use client'

import {
  Bar,
  BarChart,
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

export default function EventsChart({ data, title }: EventsChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    formattedDay: formatDay(d.day),
  }))

  return (
    <div className="rounded-xl border border-white/10 bg-gray-900 p-6">
      {title != null && (
        <h3 className="mb-4 text-sm font-medium text-gray-400">{title}</h3>
      )}
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <XAxis
              dataKey="formattedDay"
              tick={{ fill: '#9ca3af' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis
              tick={{ fill: '#9ca3af' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: '#9ca3af' }}
              formatter={(value: number | undefined) => [value ?? 0, 'Events']}
              labelFormatter={(label) => label}
            />
            <Bar dataKey="cnt" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

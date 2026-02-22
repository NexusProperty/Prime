import { cn } from '@/lib/utils'

export interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  subPositive?: boolean // true = green, false = red, undefined = gray
  icon?: React.ComponentType<{ className?: string }>
}

export default function StatCard({
  label,
  value,
  sub,
  subPositive,
  icon: Icon,
}: StatCardProps) {
  const subColor =
    subPositive === true
      ? 'text-emerald-400'
      : subPositive === false
        ? 'text-rose-400'
        : 'text-gray-400'

  return (
    <div className="rounded-xl border border-white/10 bg-gray-900 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="mt-1 text-3xl font-semibold text-white">{value}</p>
          {sub != null && (
            <p className={cn('mt-1 text-sm', subColor)}>{sub}</p>
          )}
        </div>
        {Icon != null && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/20">
            <Icon className="h-5 w-5 text-indigo-400" />
          </div>
        )}
      </div>
    </div>
  )
}

import clsx from 'clsx'

const HEIGHTS = ['h-2', 'h-5', 'h-8', 'h-5', 'h-3'] as const
const DELAYS = ['0ms', '150ms', '75ms', '225ms', '110ms'] as const

interface Props {
  active: boolean
  colorClass: string
}

export function WaveformBars({ active, colorClass }: Props) {
  return (
    <div className="flex items-end gap-0.5" aria-hidden="true">
      {HEIGHTS.map((h, i) => (
        <div
          key={i}
          className={clsx(
            'w-1 rounded-full transition-all duration-300',
            h,
            colorClass,
            active && 'animate-bounce motion-reduce:animate-none',
          )}
          style={{ animationDelay: DELAYS[i] }}
        />
      ))}
    </div>
  )
}

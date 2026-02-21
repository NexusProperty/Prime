import clsx from 'clsx'

const STEPS = ['Rooms', 'Date', 'Confirm'] as const

export function WizardProgressBar({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  return (
    <div className="mb-6 flex items-start">
      {STEPS.map((label, i) => {
        const n = (i + 1) as 1 | 2 | 3
        const done = n < currentStep
        const active = n === currentStep
        return (
          <div key={label} className="flex flex-1 flex-col items-center gap-1.5 last:flex-none">
            <div className="flex w-full items-center">
              {i > 0 && (
                <div className={clsx('h-px flex-1', done ? 'bg-emerald-400' : 'bg-slate-200')} />
              )}
              <span
                className={clsx(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                  done
                    ? 'bg-emerald-500 text-white'
                    : active
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-200 text-slate-500',
                )}
              >
                {done ? '✓' : n}
              </span>
              {i < 2 && <div className="h-px flex-1 bg-slate-200" />}
            </div>
            <span
              className={clsx(
                'text-[11px] font-medium',
                active ? 'text-cyan-600' : done ? 'text-emerald-600' : 'text-slate-400',
              )}
            >
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

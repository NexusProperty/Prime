interface Props {
  position: number
}

export function SliderHandle({ position }: Props) {
  return (
    <div
      className="pointer-events-none absolute inset-y-0 z-10 flex items-center"
      style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      aria-hidden="true"
    >
      <div className="relative flex h-full items-center justify-center">
        <div className="h-full w-0.5 bg-white/70" />
        <div className="absolute flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-white shadow-lg">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

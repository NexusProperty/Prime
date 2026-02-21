'use client'

import { useState } from 'react'
import { SliderHandle } from './BeforeAfterSlider/SliderHandle'

interface Props {
  beforeSrc: string
  afterSrc: string
  beforeAlt: string
  afterAlt: string
}

export function BeforeAfterSlider({ beforeSrc, afterSrc, beforeAlt, afterAlt }: Props) {
  const [position, setPosition] = useState(50)

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-xl sm:h-80 lg:h-96">
      <img
        src={afterSrc}
        alt={afterAlt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img src={beforeSrc} alt={beforeAlt} className="h-full w-full object-cover" />
      </div>
      <span className="absolute left-3 top-3 rounded bg-black/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
        Before
      </span>
      <span className="absolute right-3 top-3 rounded bg-black/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
        After
      </span>
      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label="Drag to compare before and after renovation"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={position}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
      <SliderHandle position={position} />
    </div>
  )
}

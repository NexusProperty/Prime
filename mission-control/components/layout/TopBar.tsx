'use client'

import { Bars3Icon } from '@heroicons/react/24/outline'
import SiteSelector from './SiteSelector'

interface TopBarProps {
  onMobileMenuOpen: () => void
  title?: string
}

export default function TopBar({ onMobileMenuOpen, title }: TopBarProps) {
  return (
    <div className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-x-4 border-b border-white/10 bg-gray-950 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMobileMenuOpen}
        className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="size-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-white/10 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch items-center">
        <div className="flex items-center gap-x-3">
          <SiteSelector />
          {title && (
            <span className="text-sm text-gray-400 hidden sm:block">/ {title}</span>
          )}
        </div>
      </div>
    </div>
  )
}

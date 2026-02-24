/* Source: Tailwind Plus UI Kit — Application Shells / Stacked — Top navigation bar */

'use client'

import { useState } from 'react'
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import SiteSelector from './SiteSelector'
import { cn } from '@/lib/utils'

interface TopBarProps {
  onMobileMenuOpen: () => void
  title?: string
}

export default function TopBar({ onMobileMenuOpen, title }: TopBarProps) {
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <div className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-x-4 border-b border-white/5 bg-zinc-950 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu toggle */}
      <button
        type="button"
        onClick={onMobileMenuOpen}
        className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-200 transition-colors lg:hidden"
        aria-label="Open sidebar"
      >
        <Bars3Icon className="size-5" aria-hidden="true" />
      </button>

      <div className="h-6 w-px bg-white/5 lg:hidden" aria-hidden="true" />

      {/* Left: site selector + breadcrumb */}
      <div className="flex items-center gap-x-3">
        <SiteSelector />
        {title && (
          <span className="text-sm text-gray-600 hidden sm:block">/ {title}</span>
        )}
      </div>

      {/* Centre: search — matches screenshot "Search AI Mode" */}
      <div className="flex flex-1 justify-center px-4">
        <div
          className={cn(
            'relative flex items-center w-full max-w-sm rounded-lg ring-1 transition-all',
            searchFocused
              ? 'ring-indigo-500 bg-zinc-900'
              : 'ring-white/5 bg-zinc-900/60 hover:ring-white/10',
          )}
        >
          <MagnifyingGlassIcon
            className="absolute left-3 h-4 w-4 text-gray-500 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search AI Mode..."
            aria-label="Search"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full bg-transparent border-0 py-2 pl-9 pr-4 text-sm text-white placeholder-gray-600 focus:ring-0 focus:outline-none"
          />
          <kbd className="hidden sm:flex items-center gap-0.5 mr-2 rounded px-1.5 py-0.5 bg-zinc-800 text-[10px] text-gray-500 font-mono select-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: AI + notifications */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-lg p-2 text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Mission AI"
        >
          <SparklesIcon className="h-4.5 w-4.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="relative rounded-lg p-2 text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Notifications"
        >
          <BellIcon className="h-4.5 w-4.5" aria-hidden="true" />
          {/* Unread badge */}
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

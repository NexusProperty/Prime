/* Source: Tailwind Plus UI Kit — Application Shells / Sidebar Layouts */

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  HomeIcon,
  FolderIcon,
  LinkIcon,
  CpuChipIcon,
  Cog6ToothIcon,
  QueueListIcon,
  ArrowLeftStartOnRectangleIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { createClient } from '@/lib/supabase-browser'
import type { Site } from '@/lib/site-context'
import { cn } from '@/lib/utils'

interface SidebarProps {
  sites: Site[]
  userEmail: string
}

const mainNav = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Records', href: '/records', icon: FolderIcon },
  { name: 'Connections', href: '/connections', icon: LinkIcon },
  { name: 'Agents', href: '/agents', icon: CpuChipIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  { name: 'Outbound Queue', href: '/settings/outbound', icon: QueueListIcon },
]

// Dot colors matching screenshot's "SEARCHES" section
const SITE_DOT_COLORS = [
  'bg-blue-500',
  'bg-orange-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-violet-500',
]

export default function Sidebar({ sites, userEmail }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex grow flex-col overflow-y-auto bg-zinc-950 border-r border-white/5">

      {/* Logo / workspace header */}
      <div className="flex h-14 shrink-0 items-center gap-x-2.5 px-4 border-b border-white/5">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-500 text-white font-bold text-xs">
          MC
        </div>
        <span className="text-sm font-semibold text-white truncate">Mission Control</span>
      </div>

      {/* Search box — like screenshot's search */}
      <div className="px-3 py-3 border-b border-white/5">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-gray-500 hover:bg-white/8 transition-colors cursor-text">
          <MagnifyingGlassIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="text-xs">Search...</span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col px-2 py-3 gap-0.5 overflow-y-auto">

        {/* Main navigation */}
        {mainNav.map((item) => {
          const current = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              aria-current={current ? 'page' : undefined}
              className={cn(
                'group flex items-center gap-x-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                current
                  ? 'bg-white/8 text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white',
              )}
            >
              <item.icon
                className={cn('size-4 shrink-0', current ? 'text-white' : 'text-gray-500 group-hover:text-gray-300')}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}

        {/* SITES section — like "FAVOURITES" in screenshot */}
        {sites.length > 0 && (
          <div className="mt-5">
            <p className="px-3 mb-1.5 text-[10px] font-semibold text-gray-600 uppercase tracking-widest">
              Sites
            </p>
            {sites.map((site, i) => {
              const href = `/sites/${site.id}`
              const current = pathname.startsWith(href)
              const dotColor = SITE_DOT_COLORS[i % SITE_DOT_COLORS.length]
              return (
                <Link
                  key={site.id}
                  href={href}
                  aria-current={current ? 'page' : undefined}
                  className={cn(
                    'group flex items-center gap-x-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                    current
                      ? 'bg-white/8 text-white'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white',
                  )}
                >
                  <span className={cn('h-2 w-2 rounded-full shrink-0', dotColor)} aria-hidden="true" />
                  <span className="flex-1 truncate">{site.name}</span>
                  {!site.url.includes('localhost') && (
                    <GlobeAltIcon
                      className="h-3 w-3 text-gray-600 group-hover:text-gray-400 shrink-0 transition-colors"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </nav>

      {/* User footer */}
      <div className="shrink-0 border-t border-white/5 px-3 py-3">
        <div className="flex items-center gap-x-2.5 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors group">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-semibold">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <p className="flex-1 min-w-0 text-xs text-gray-400 truncate group-hover:text-white transition-colors">
            {userEmail}
          </p>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-gray-600 hover:text-rose-400 transition-colors shrink-0"
            title="Sign out"
            aria-label="Sign out"
          >
            <ArrowLeftStartOnRectangleIcon className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}

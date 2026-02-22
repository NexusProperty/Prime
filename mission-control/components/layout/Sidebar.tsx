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
} from '@heroicons/react/24/outline'
import { createClient } from '@/lib/supabase-browser'
import type { Site } from '@/lib/site-context'

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

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Sidebar({ sites, userEmail }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 border-r border-white/10 px-6 pb-4">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-x-2">
        <div className="h-7 w-7 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-xs">MC</span>
        </div>
        <span className="text-white font-semibold text-sm">Mission Control</span>
      </div>

      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          {/* Main nav */}
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {mainNav.map((item) => {
                const current = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={classNames(
                        current
                          ? 'bg-white/5 text-white'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white',
                        'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                      )}
                    >
                      <item.icon
                        className={classNames(
                          current ? 'text-white' : 'text-gray-400 group-hover:text-white',
                          'size-5 shrink-0',
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>

          {/* Sites */}
          {sites.length > 0 && (
            <li>
              <div className="text-xs/6 font-semibold text-gray-400 uppercase tracking-wider">
                Sites
              </div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {sites.map((site) => {
                  const href = `/sites/${site.id}`
                  const current = pathname.startsWith(href)
                  return (
                    <li key={site.id}>
                      <Link
                        href={href}
                        className={classNames(
                          current
                            ? 'bg-white/5 text-white'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white',
                          'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                        )}
                      >
                        <span
                          className={classNames(
                            current
                              ? 'border-indigo-400 text-indigo-400'
                              : 'border-white/10 text-gray-400 group-hover:border-white/20 group-hover:text-white',
                            'flex size-5 shrink-0 items-center justify-center rounded border bg-white/5 text-[0.6rem] font-medium',
                          )}
                        >
                          {site.name[0]}
                        </span>
                        <span className="truncate">{site.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
          )}

          {/* User + Sign out at bottom */}
          <li className="-mx-6 mt-auto">
            <div className="flex items-center gap-x-3 px-6 py-3 border-t border-white/10">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 truncate">{userEmail}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="text-gray-400 hover:text-white transition-colors"
                title="Sign out"
              >
                <ArrowLeftStartOnRectangleIcon className="size-5" aria-hidden="true" />
                <span className="sr-only">Sign out</span>
              </button>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  )
}

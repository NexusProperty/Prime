/* Source: Tailwind Plus UI Kit — Data Display / Tables */

import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

export interface SiteRow {
  id: string
  name: string
  url: string
  is_active: boolean
}

export interface SiteHealthTableProps {
  sites: SiteRow[]
  unprocessedBySite?: Record<string, number>
}

export default function SiteHealthTable({
  sites,
  unprocessedBySite = {},
}: SiteHealthTableProps) {
  return (
    <div className="rounded-2xl ring-1 ring-white/10 bg-gray-900 shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <GlobeAltIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-white">Site Health</h3>
        </div>
        <span className="text-xs text-gray-500">{sites.length} sites</span>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm" aria-label="Site health">
          <thead>
            <tr className="border-b border-white/5">
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Site
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                URL
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unprocessed
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sites.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                  No sites found
                </td>
              </tr>
            )}
            {sites.map((site) => {
              const unprocessed = unprocessedBySite[site.id] ?? 0
              return (
                <tr key={site.id} className="hover:bg-white/2 transition-colors group">
                  <td className="px-6 py-4 font-medium text-white">
                    {site.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500 hidden sm:table-cell truncate max-w-[160px]">
                    {site.url}
                  </td>
                  <td className="px-6 py-4">
                    {/* Source: Tailwind Plus UI Kit — Elements / Badges */}
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
                        site.is_active
                          ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 ring-rose-500/20',
                      )}
                    >
                      <span
                        className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          site.is_active ? 'bg-emerald-400' : 'bg-rose-400',
                        )}
                        aria-hidden="true"
                      />
                      {site.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={cn(
                        'tabular-nums text-sm font-medium',
                        unprocessed > 0 ? 'text-amber-400' : 'text-gray-600',
                      )}
                    >
                      {unprocessed > 0 ? unprocessed.toLocaleString() : '—'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

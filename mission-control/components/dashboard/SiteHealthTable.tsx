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
    <div className="overflow-hidden rounded-xl border border-white/10 bg-gray-900">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-4 text-left text-xs uppercase text-gray-400">
                Site Name
              </th>
              <th className="px-6 py-4 text-left text-xs uppercase text-gray-400">
                URL
              </th>
              <th className="px-6 py-4 text-left text-xs uppercase text-gray-400">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs uppercase text-gray-400">
                Unprocessed Events
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {sites.map((site) => {
              const unprocessed = unprocessedBySite[site.id] ?? 0
              return (
                <tr key={site.id}>
                  <td className="px-6 py-4 text-sm font-medium text-white">
                    {site.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{site.url}</td>
                  <td className="px-6 py-4">
                    <span
                      className={
                        site.is_active
                          ? 'inline-flex items-center rounded-full bg-emerald-400/10 px-2 py-0.5 text-xs font-medium text-emerald-400'
                          : 'inline-flex items-center rounded-full bg-rose-400/10 px-2 py-0.5 text-xs font-medium text-rose-400'
                      }
                    >
                      {site.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={
                        unprocessed > 0
                          ? 'text-sm text-amber-400'
                          : 'text-sm text-gray-400'
                      }
                    >
                      {unprocessed}
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

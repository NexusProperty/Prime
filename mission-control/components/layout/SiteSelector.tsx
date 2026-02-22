'use client'

import { GlobeAltIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSite } from '@/lib/site-context'

export default function SiteSelector() {
  const { sites, activeSite, setActiveSite } = useSite()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-x-2 rounded-md bg-white/5 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 transition-colors focus:outline-none">
          <GlobeAltIcon className="size-4 text-gray-400" aria-hidden="true" />
          <span>{activeSite ? activeSite.name : 'All Sites'}</span>
          <ChevronDownIcon className="size-3 text-gray-400" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52 bg-gray-800 border-white/10 text-white">
        <DropdownMenuItem
          onClick={() => setActiveSite(null)}
          className={`cursor-pointer text-sm ${!activeSite ? 'text-indigo-400' : 'text-gray-300 hover:text-white'}`}
        >
          <GlobeAltIcon className="mr-2 size-4" />
          All Sites
        </DropdownMenuItem>
        {sites.length > 0 && <DropdownMenuSeparator className="bg-white/10" />}
        {sites.map((site) => (
          <DropdownMenuItem
            key={site.id}
            onClick={() => setActiveSite(site)}
            className={`cursor-pointer text-sm ${activeSite?.id === site.id ? 'text-indigo-400' : 'text-gray-300 hover:text-white'}`}
          >
            <span className="mr-2 flex size-4 items-center justify-center rounded border border-white/10 bg-white/5 text-[0.6rem] font-medium">
              {site.name[0]}
            </span>
            {site.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

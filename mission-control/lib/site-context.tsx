'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export interface Site {
  id: string
  name: string
  url: string
}

interface SiteContextValue {
  sites: Site[]
  activeSite: Site | null
  setActiveSite: (site: Site | null) => void
}

const SiteContext = createContext<SiteContextValue>({
  sites: [],
  activeSite: null,
  setActiveSite: () => {},
})

export function SiteProvider({
  children,
  initialSites,
}: {
  children: React.ReactNode
  initialSites: Site[]
}) {
  const [activeSite, setActiveSiteState] = useState<Site | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('mc_active_site')
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Site
        const match = initialSites.find((s) => s.id === parsed.id)
        if (match) setActiveSiteState(match)
      } catch {}
    }
  }, [initialSites])

  function setActiveSite(site: Site | null) {
    setActiveSiteState(site)
    if (site) {
      localStorage.setItem('mc_active_site', JSON.stringify(site))
    } else {
      localStorage.removeItem('mc_active_site')
    }
  }

  return (
    <SiteContext.Provider value={{ sites: initialSites, activeSite, setActiveSite }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  return useContext(SiteContext)
}

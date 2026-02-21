/**
 * PHASE3-002: Rule-based cross-sell detection engine
 *
 * Checks a lead's brand, serviceType, and message against keyword rules
 * to detect cross-sell opportunities between the three United Trades brands.
 *
 * Rules encode the "Dependency Check" logic from Plan.md:
 *   - Electrical/solar installs → CleanJet (creates dust)
 *   - AKF renovations          → Prime Electrical (need wiring)
 *   - AKF renovations          → CleanJet (creates mess)
 *   - CleanJet post-reno       → AKF (if build not finished)
 */
import type { SiteBrand } from '@/types/database'

export interface CrossSellSuggestion {
  partnerBrand: SiteBrand
  servicePitch: string
  price?: string
}

interface Rule {
  brands: SiteBrand[]
  keywords: string[]
  suggestion: CrossSellSuggestion
}

const RULES: Rule[] = [
  {
    brands: ['prime'],
    keywords: ['solar', 'heat pump', 'ev charger', 'smart home', 'automation', 'wiring', 'lighting'],
    suggestion: {
      partnerBrand: 'cleanjet',
      servicePitch:
        'Electrical and heat pump installs create dust and debris. Add a CleanJet post-install clean.',
      price: '$99',
    },
  },
  {
    brands: ['akf'],
    keywords: ['renovation', 'extension', 'build', 'deck', 'ceiling', 'kitchen', 'bathroom', 'wall'],
    suggestion: {
      partnerBrand: 'prime',
      servicePitch:
        'Renovations almost always need certified electrical work. Let Prime Electrical quote the wiring.',
    },
  },
  {
    brands: ['akf'],
    keywords: ['interior', 'painting', 'plastering', 'kitchen', 'bathroom', 'renovation'],
    suggestion: {
      partnerBrand: 'cleanjet',
      servicePitch:
        'Renovation dust is inevitable. Book a CleanJet post-reno clean for a spotless handover.',
      price: '$199',
    },
  },
  {
    brands: ['cleanjet'],
    keywords: ['post-reno', 'after reno', 'construction clean', 'builder', 'new build'],
    suggestion: {
      partnerBrand: 'akf',
      servicePitch:
        "If your build or renovation isn't finished yet, AKF Construction can handle the remaining work.",
    },
  },
]

/**
 * Returns the first matching cross-sell suggestion for a lead, or null.
 * Matches against both serviceType and free-text message (case-insensitive).
 */
export function detectCrossSell(
  brand: SiteBrand,
  serviceType: string | null | undefined,
  message: string | null | undefined,
): CrossSellSuggestion | null {
  const haystack = `${serviceType ?? ''} ${message ?? ''}`.toLowerCase()
  for (const rule of RULES) {
    if (!rule.brands.includes(brand)) continue
    if (rule.keywords.some((kw) => haystack.includes(kw))) return rule.suggestion
  }
  return null
}

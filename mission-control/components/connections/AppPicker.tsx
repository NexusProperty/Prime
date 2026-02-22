'use client'

import { RadioGroup, Radio } from '@/components/catalyst/radio'
import { cn } from '@/lib/utils'

export interface AppOption {
  slug: string
  name: string
  description?: string
}

const SUPPORTED_APPS: AppOption[] = [
  { slug: 'zapier', name: 'Zapier', description: 'Connect 5000+ apps' },
  { slug: 'hubspot', name: 'HubSpot', description: 'CRM & marketing' },
  { slug: 'xero', name: 'Xero', description: 'Accounting' },
  { slug: 'slack', name: 'Slack', description: 'Team messaging' },
  { slug: 'custom', name: 'Custom', description: 'Webhook or API' },
]

interface AppPickerProps {
  value: string
  onChange: (appSlug: string, appName: string) => void
  apps?: AppOption[]
}

export function AppPicker({
  value,
  onChange,
  apps = SUPPORTED_APPS,
}: AppPickerProps) {
  return (
    <RadioGroup
      value={value}
      onChange={(slug: string) => {
        const app = apps.find((a) => a.slug === slug)
        if (app) onChange(slug, app.name)
      }}
      className="grid grid-cols-2 gap-3 sm:grid-cols-3"
    >
      {apps.map((app) => (
        <label
          key={app.slug}
          className={cn(
            'relative flex cursor-pointer flex-col rounded-xl border p-4 transition-colors',
            'border-zinc-950/10 dark:border-white/10',
            'hover:border-zinc-950/20 dark:hover:border-white/20',
            value === app.slug &&
              'border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-400 dark:ring-blue-400/20'
          )}
          data-testid={`app-picker-${app.slug}`}
        >
          <div className="flex items-start gap-3">
            <Radio value={app.slug} className="mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-sm font-semibold text-zinc-950 dark:text-white">
                {app.name}
              </span>
              {app.description && (
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {app.description}
                </p>
              )}
            </div>
          </div>
        </label>
      ))}
    </RadioGroup>
  )
}

export { SUPPORTED_APPS }

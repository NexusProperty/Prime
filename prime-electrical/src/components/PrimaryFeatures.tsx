'use client'

// Redesign: Mitsubishi-inspired split layout — text left, visual card right
// Alternating bg colours keep sections visually distinct without extra components
import { Button } from '@/components/Button'

const services = [
  {
    id: 'electrical',
    eyebrow: 'Core services',
    heading: 'Electrical that powers everyday life',
    body: 'From switchboard upgrades to same-day emergency callouts — our registered electricians are Auckland\'s go-to for reliable, certified electrical work. Every job backed by a 12-month workmanship guarantee.',
    bullets: [
      'Switchboard upgrades & replacements',
      'Internal & external lighting',
      'Safety inspections & fault finding',
      'Emergency after-hours callouts',
      'Healthy Homes assessments',
    ],
    cta: { label: 'Get an electrical quote', href: '#contact' },
    bgSection: 'bg-white',
    accentColor: 'text-blue-600',
    bulletColor: 'text-blue-600',
    cardBg: 'bg-gradient-to-br from-slate-800 to-slate-900',
    cardIcon: (
      <svg aria-hidden="true" className="h-16 w-16 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C13.21 17.89 11 21 11 21z" />
      </svg>
    ),
    cardLabel: 'Registered Electricians',
    cardStat: '12-month guarantee on all work',
  },
  {
    id: 'solar',
    eyebrow: 'Solar & energy',
    heading: 'Cut your power bill. For good.',
    body: 'SEANZ-certified solar installations, battery storage, and EV charger setup. We design the right system for your home, handle council compliance, and offer flexible financing so you can start saving sooner.',
    bullets: [
      'Solar panel design & installation',
      'Battery storage — Tesla Powerwall, Enphase',
      'EV charger installation (all brands)',
      'Finance from $0 upfront available',
    ],
    cta: { label: 'Get a free solar quote', href: '#contact' },
    bgSection: 'bg-slate-50',
    accentColor: 'text-amber-500',
    bulletColor: 'text-amber-500',
    cardBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
    cardIcon: (
      <svg aria-hidden="true" className="h-16 w-16 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm0 17a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1zm9-9a1 1 0 0 1 0 2h-1a1 1 0 0 1 0-2h1zM4 12a1 1 0 0 1-1 1H2a1 1 0 0 1 0-2h1a1 1 0 0 1 1 1zm12.95-6.36a1 1 0 0 1 1.41 1.41l-.7.71a1 1 0 0 1-1.42-1.42l.71-.7zM6.34 17.66a1 1 0 0 1 1.42 1.41l-.71.71a1 1 0 0 1-1.41-1.42l.7-.7zm12.02.7a1 1 0 0 1-1.41 1.42l-.71-.71a1 1 0 0 1 1.42-1.41l.7.7zM6.34 6.34a1 1 0 0 1-.7.7L4.93 6.34a1 1 0 0 1 1.41-1.41l.71.7a1 1 0 0 1-.71 1.71zM17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0z" />
      </svg>
    ),
    cardLabel: 'SEANZ Certified',
    cardStat: '500+ solar installs in Auckland',
  },
  {
    id: 'smart-home',
    eyebrow: 'Smart home',
    heading: 'Your home, intelligently automated',
    body: 'Apple HomeKit, Google Home, and Alexa-compatible smart lighting, security cameras, alarm systems, and whole-home automation. We design, install, and configure everything — so it just works.',
    bullets: [
      'Smart lighting & scene control',
      'Security cameras & alarm systems',
      'Whole-home automation setup',
      'Network & AV system wiring',
      'Apple HomeKit · Google Home · Alexa',
    ],
    cta: { label: 'Talk to a smart home expert', href: '#contact' },
    bgSection: 'bg-white',
    accentColor: 'text-violet-600',
    bulletColor: 'text-violet-500',
    cardBg: 'bg-gradient-to-br from-violet-500 to-purple-700',
    cardIcon: (
      <svg aria-hidden="true" className="h-16 w-16 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
    cardLabel: 'Smart Home Automation',
    cardStat: 'Works with HomeKit, Google & Alexa',
  },
]

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export function PrimaryFeatures() {
  return (
    <div id="services">
      {services.map((service, idx) => {
        const isEven = idx % 2 === 0
        return (
          <section
            key={service.id}
            id={service.id}
            aria-labelledby={`${service.id}-heading`}
            className={`${service.bgSection} py-20 sm:py-28`}
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div
                className={`flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16 ${
                  !isEven ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Text column */}
                <div className="flex-1">
                  <p
                    className={`text-sm font-semibold uppercase tracking-widest ${service.accentColor}`}
                  >
                    {service.eyebrow}
                  </p>
                  <h2
                    id={`${service.id}-heading`}
                    className="mt-3 font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
                  >
                    {service.heading}
                  </h2>
                  <p className="mt-4 text-lg leading-relaxed text-slate-600">
                    {service.body}
                  </p>
                  <ul className="mt-8 space-y-3">
                    {service.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <CheckIcon
                          className={`mt-0.5 h-5 w-5 flex-none ${service.bulletColor}`}
                        />
                        <span className="text-sm text-slate-700">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10">
                    <Button href={service.cta.href} color="blue">
                      {service.cta.label}
                    </Button>
                  </div>
                </div>

                {/* Visual card column */}
                <div className="flex-1">
                  <div
                    className={`relative overflow-hidden rounded-3xl ${service.cardBg} p-10 shadow-2xl`}
                  >
                    {/* Decorative circles */}
                    <div className="absolute -right-12 -bottom-12 h-48 w-48 rounded-full bg-white/10" />
                    <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-white/10" />

                    <div className="relative flex flex-col gap-6">
                      {service.cardIcon}
                      <div>
                        <p className="font-display text-2xl font-medium text-white">
                          {service.cardLabel}
                        </p>
                        <p className="mt-2 text-sm text-white/70">
                          {service.cardStat}
                        </p>
                      </div>

                      {/* Mini stat badges */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {service.bullets.slice(0, 3).map((b) => (
                          <span
                            key={b}
                            className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}

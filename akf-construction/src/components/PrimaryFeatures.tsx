import { Button } from '@/components/Button'

const services = [
  {
    id: 'renovations',
    eyebrow: 'Home renovations',
    heading: 'Transform your home. Raise its value.',
    body: 'Full interior and exterior home renovations from concept to completion. We handle design, council consents, and build — with a dedicated project manager keeping you informed every step of the way.',
    bullets: [
      'Kitchen & bathroom renovations',
      'Open-plan layout conversions',
      'Structural alterations & additions',
      'Council consent management',
      'End-to-end project management',
    ],
    cta: { label: 'Get a renovation quote', href: '#contact' },
    guarantee: '10-year structural guarantee',
    bgSection: 'bg-white',
    accentColor: 'text-amber-600',
    bulletColor: 'text-amber-500',
    cardBg: 'bg-linear-to-br from-stone-700 to-stone-900',
    cardIcon: (
      <svg aria-hidden="true" className="h-16 w-16 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
    cardLabel: 'Full Home Renovations',
    cardDetail: 'Kitchen · Bathroom · Open-plan',
  },
  {
    id: 'decks',
    eyebrow: 'Decks & outdoor living',
    heading: 'Outdoor spaces Auckland loves.',
    body: 'Custom-designed and built decks, pergolas, and outdoor living areas that complement your home and NZ climate. Composite, hardwood, or treated pine — backed by a 10-year structural guarantee.',
    bullets: [
      'Custom deck design & build',
      'Pergolas and shade structures',
      'Composite & hardwood decking',
      'Balustrades & privacy screens',
      '10-year structural guarantee',
    ],
    cta: { label: 'Get a deck quote', href: '#contact' },
    guarantee: '10-year structural guarantee',
    bgSection: 'bg-slate-50',
    accentColor: 'text-amber-600',
    bulletColor: 'text-amber-500',
    cardBg: 'bg-linear-to-br from-amber-700 to-stone-900',
    cardIcon: (
      <svg aria-hidden="true" className="h-16 w-16 text-amber-300" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
      </svg>
    ),
    cardLabel: 'Decks & Outdoor Living',
    cardDetail: 'Designed for NZ conditions',
  },
  {
    id: 'fencing',
    eyebrow: 'Fencing & boundaries',
    heading: 'Privacy, security, and style.',
    body: 'From sleek horizontal slat privacy fencing to pool compliance, retaining walls, and automated gates — our fencing solutions are built to last and designed to enhance your property value.',
    bullets: [
      'Horizontal slat privacy fencing',
      'Pool fencing (NZ compliance certified)',
      'Retaining walls & boundary fencing',
      'Automated gate installation',
      'Colorsteel, timber & composite options',
    ],
    cta: { label: 'Get a fencing quote', href: '#contact' },
    guarantee: 'Compliance certified',
    bgSection: 'bg-white',
    accentColor: 'text-slate-700',
    bulletColor: 'text-slate-600',
    cardBg: 'bg-linear-to-br from-slate-600 to-slate-900',
    cardIcon: (
      <svg aria-hidden="true" className="h-16 w-16 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 10h-1V3l-4 3V3l-4 3V3L7 6V3H6C4.9 3 4 3.9 4 5v15c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zM9 18H7v-2h2v2zm0-4H7v-2h2v2zm0-4H7v-2h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2v-2h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2z" />
      </svg>
    ),
    cardLabel: 'Fencing & Security',
    cardDetail: 'Pool · Privacy · Boundary',
  },
  {
    id: 'new-builds',
    eyebrow: 'New builds & extensions',
    heading: 'Your vision, built from the ground up.',
    body: 'From home extensions to full new builds — AKF manages every stage of the build, keeping you on budget and ahead of schedule. We handle all council consents and engineering requirements.',
    bullets: [
      'Home extensions & add-ons',
      'Full new build construction',
      'Garage conversions',
      'Architectural build management',
      'Engineering & consent handled',
    ],
    cta: { label: 'Discuss your build', href: '#contact' },
    guarantee: 'Licensed Building Practitioners',
    bgSection: 'bg-slate-50',
    accentColor: 'text-amber-600',
    bulletColor: 'text-amber-500',
    cardBg: 'bg-linear-to-br from-slate-800 to-slate-950',
    cardIcon: (
      <svg aria-hidden="true" className="h-16 w-16 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L1 9l4 2.18V17h2v-4.82L9 13.4V17H7v2h10v-2h-2v-3.6l2-1.22V17h2v-5.82L23 9 12 3zm6.5 6L12 12.72 5.5 9 12 5.28 18.5 9z" />
      </svg>
    ),
    cardLabel: 'New Builds & Extensions',
    cardDetail: 'Managed end-to-end',
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
                  {/* Guarantee badge */}
                  <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 ring-1 ring-amber-200">
                    <svg aria-hidden="true" className="h-4 w-4 text-amber-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                    </svg>
                    <span className="text-sm font-semibold text-amber-800">
                      {service.guarantee}
                    </span>
                  </div>
                  <div className="mt-6">
                    <Button href={service.cta.href} color="slate">
                      {service.cta.label}
                    </Button>
                  </div>
                </div>

                {/* Visual card column */}
                <div className="flex-1">
                  <div
                    className={`relative overflow-hidden rounded-3xl ${service.cardBg} p-10 shadow-2xl`}
                    style={{ minHeight: '340px' }}
                  >
                    {/* Decorative pattern */}
                    <div
                      className="absolute inset-0 opacity-5"
                      aria-hidden="true"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.5) 20px, rgba(255,255,255,0.5) 21px)',
                      }}
                    />
                    {/* Decorative circles */}
                    <div className="absolute -right-12 -bottom-12 h-48 w-48 rounded-full bg-white/5" />
                    <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-white/5" />

                    <div className="relative flex flex-col gap-6">
                      {service.cardIcon}
                      <div>
                        <p className="font-display text-2xl font-medium text-white">
                          {service.cardLabel}
                        </p>
                        <p className="mt-1 text-sm text-white/60">
                          {service.cardDetail}
                        </p>
                      </div>

                      {/* Mini bullet pills */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {service.bullets.slice(0, 3).map((b) => (
                          <span
                            key={b}
                            className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80"
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

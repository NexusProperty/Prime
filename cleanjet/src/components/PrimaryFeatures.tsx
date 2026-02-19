import { Button } from '@/components/Button'

// Service cards — CleanBoss "What's in our toolbox" grid pattern
const services = [
  {
    id: 'regular',
    title: 'Regular Clean',
    tagline: 'Our go-to clean',
    description:
      'A routine clean designed to keep your home consistently fresh. All living areas, bathrooms, kitchen, and bedrooms — done right every visit.',
    checklistCount: '45-point checklist',
    gradient: 'from-sky-500 to-cyan-600',
    icon: (
      <svg aria-hidden="true" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M19 5h-6v6h6V5zm-6 8h1.5v1.5H13V13zm1.5 1.5H16V16h-1.5v-1.5zM16 13h1.5v1.5H16V13zm-3 3h1.5v1.5H13V16zm1.5 1.5H16V19h-1.5v-1.5zM16 16h1.5v1.5H16V16zm1.5-1.5H19V16h-1.5v-1.5zm0 3H19V19h-1.5v-1.5zM22 7h-2V4h-3V2h-2v2h-3v3H10V5H7V2H5v3H2v3h3v2H2v2h3v3h3v2H5v3h3v-3h3v3h2v-3h3v3h3v-3h3v-3h-3v-2h3v-2h-3v-3h3V7zm-5 12h-1.5v-1.5H17V19zm0-3h-1.5v-1.5H17V16zm0-3h-1.5V11.5H17V13zM14 10h-1.5V8.5H14V10zM11 7H9.5V5.5H11V7z" />
      </svg>
    ),
    bullets: [
      'All rooms vacuumed & mopped',
      'Bathrooms scrubbed & sanitised',
      'Kitchen surfaces & appliance exteriors',
      'Beds made on request',
    ],
    from: '$79',
    recurring: true,
  },
  {
    id: 'deep',
    title: 'Deep Clean',
    tagline: 'Enhanced essentials',
    description:
      'A top-to-bottom clean for homes that need extra attention — spring cleans, post-renovation, or before new tenants move in.',
    checklistCount: '75-point checklist',
    gradient: 'from-violet-500 to-purple-600',
    icon: (
      <svg aria-hidden="true" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
      </svg>
    ),
    bullets: [
      'Everything in Regular Clean',
      'Inside oven & fridge clean',
      'Window sills & tracks',
      'Skirting boards & ceiling fans',
    ],
    from: '$149',
    recurring: true,
  },
  {
    id: 'tenancy',
    title: 'End of Tenancy',
    tagline: 'Bond-back guarantee',
    description:
      'Our most thorough clean — designed to meet property manager and landlord requirements. Documented with a photo report.',
    checklistCount: '75-point checklist + photos',
    gradient: 'from-emerald-500 to-teal-600',
    icon: (
      <svg aria-hidden="true" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
    bullets: [
      'Full deep clean of entire property',
      'Oven, fridge & dishwasher interior',
      'Carpet steam clean (add-on available)',
      'Detailed photo report provided',
    ],
    from: '$249',
    recurring: false,
  },
  {
    id: 'post-build',
    title: 'Post-Build Clean',
    tagline: 'After renovation',
    description:
      'Specialised cleaning after building or renovation work — heavy dust removal, paint splashes, and thorough scrub-down. AKF Construction clients get a bundle discount.',
    checklistCount: 'Custom scope',
    gradient: 'from-amber-500 to-orange-600',
    icon: (
      <svg aria-hidden="true" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.5 2.1L11.44 6.17l2.47 2.47-.97.97-2.47-2.47-1.44 1.44 2.47 2.47-.97.97-2.47-2.47-1.44 1.44 2.47 2.47-.97.97-2.47-2.47L2 16.5 7.5 22l13-13.01-5-6.89zM4.04 16.5l6.26-6.26 4.24 4.24-6.26 6.26L4.04 16.5zM21.25 4.65L19.8 3.2a.996.996 0 0 0-1.41 0l-1.34 1.34 2.81 2.81 1.39-1.39c.39-.39.39-1.02 0-1.31z" />
      </svg>
    ),
    bullets: [
      'Heavy construction dust removal',
      'Paint splash & adhesive clean-up',
      'Full window & frame clean',
      'AKF Construction bundle discount',
    ],
    from: 'Custom',
    recurring: false,
  },
]

// How it works steps — MyClean 5-step pattern
const steps = [
  {
    num: '01',
    title: 'Get an instant price',
    desc: 'Use our calculator above — choose your home size and frequency. No forms, no waiting.',
    icon: (
      <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Confirm your booking',
    desc: 'Pick your date and time. We\'re available 7 days a week, with cleans from 8am.',
    icon: (
      <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Let us in',
    desc: 'You don\'t need to be home. Leave entry instructions and we\'ll take care of everything.',
    icon: (
      <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'We clean thoroughly',
    desc: 'Our vetted cleaners follow a detailed checklist every visit. Same high standard, every time.',
    icon: (
      <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    ),
  },
  {
    num: '05',
    title: 'Rate & repeat',
    desc: 'Tell us how we did. Set up a recurring schedule and come home to a sparkling clean house, always.',
    icon: (
      <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ),
  },
]

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 flex-none text-sky-600"
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
    <>
      {/* Service cards section */}
      <section
        id="services"
        aria-labelledby="services-title"
        className="bg-slate-50 py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">
              What we offer
            </p>
            <h2
              id="services-title"
              className="mt-3 font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
            >
              A clean for every type of mess.
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Whether it&apos;s a quick weekly refresh or a full post-renovation
              clean — we&apos;ve got you covered.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-900/5 transition hover:shadow-lg hover:-translate-y-1"
              >
                {/* Coloured header */}
                <div
                  className={`bg-linear-to-br ${service.gradient} flex items-start justify-between p-6`}
                >
                  <div>
                    <span className="inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white">
                      {service.tagline}
                    </span>
                    <p className="mt-3 font-display text-xl font-semibold text-white">
                      {service.title}
                    </p>
                    <p className="mt-0.5 text-sm text-white/70">
                      {service.checklistCount}
                    </p>
                  </div>
                  <div className="shrink-0">{service.icon}</div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-sm leading-relaxed text-slate-600">
                    {service.description}
                  </p>

                  <ul className="mt-5 space-y-2.5">
                    {service.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <CheckIcon />
                        <span className="text-xs text-slate-700">{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-500">From</span>
                        <p className="font-display text-2xl font-semibold text-slate-900">
                          {service.from}
                          {service.from !== 'Custom' && (
                            <span className="ml-1 text-sm font-normal text-slate-500">
                              NZD
                            </span>
                          )}
                        </p>
                      </div>
                      {service.recurring && (
                        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-200">
                          Recurring
                        </span>
                      )}
                    </div>
                    <Button
                      href="#booking"
                      color="blue"
                      className="mt-4 w-full justify-center"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — MyClean 5-step strip */}
      <section
        id="how-it-works"
        aria-labelledby="how-it-works-title"
        className="bg-white py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">
              Simple process
            </p>
            <h2
              id="how-it-works-title"
              className="mt-3 font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
            >
              How CleanJet works.
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              From first booking to a sparkling clean home — easy, seamless, and
              hassle-free.
            </p>
          </div>

          <div className="relative mt-16">
            {/* Connecting line — desktop only */}
            <div
              aria-hidden="true"
              className="absolute top-10 left-0 right-0 hidden h-px bg-slate-200 lg:block"
              style={{ left: '10%', right: '10%' }}
            />

            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
              {steps.map((step) => (
                <div key={step.num} className="relative flex flex-col items-center text-center">
                  {/* Step circle */}
                  <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-sky-600 shadow-lg shadow-sky-600/30 text-white">
                    {step.icon}
                  </div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
                    <span className="font-display text-xs font-bold text-sky-400">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-base font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 text-center">
            <Button href="#booking" color="blue">
              Book My First Clean
            </Button>
            <p className="mt-3 text-sm text-slate-500">
              First clean 20% off · No lock-in · Cancel any time
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

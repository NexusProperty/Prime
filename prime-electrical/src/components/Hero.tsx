import { Button } from '@/components/Button'

// Placeholder gradient cards represent real job-site photos
// Replace div placeholders with next/image when photos are available
const serviceCards = [
  {
    label: 'Solar Panels',
    gradient: 'from-amber-400 to-orange-500',
    icon: (
      <svg aria-hidden="true" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm0 17a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1zm9-9a1 1 0 0 1 0 2h-1a1 1 0 0 1 0-2h1zM4 12a1 1 0 0 1-1 1H2a1 1 0 0 1 0-2h1a1 1 0 0 1 1 1zm12.95-6.36a1 1 0 0 1 1.41 1.41l-.7.71a1 1 0 0 1-1.42-1.42l.71-.7zM6.34 17.66a1 1 0 0 1 1.42 1.41l-.71.71a1 1 0 0 1-1.41-1.42l.7-.7zm12.02.7a1 1 0 0 1-1.41 1.42l-.71-.71a1 1 0 0 1 1.42-1.41l.7.7zM6.34 6.34a1 1 0 0 1-.7.7L4.93 6.34a1 1 0 0 1 1.41-1.41l.71.7a1 1 0 0 1-.71 1.71zM17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0z" />
      </svg>
    ),
  },
  {
    label: 'Heat Pumps',
    gradient: 'from-blue-500 to-indigo-600',
    icon: (
      <svg aria-hidden="true" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1a11 11 0 1 0 11 11A11.013 11.013 0 0 0 12 1zm0 2a9 9 0 1 1-9 9 9.01 9.01 0 0 1 9-9zm0 2a7 7 0 1 0 7 7 7.008 7.008 0 0 0-7-7zm0 2a5 5 0 1 1-5 5 5.006 5.006 0 0 1 5-5zm0 2a3 3 0 1 0 3 3 3 3 0 0 0-3-3z" />
      </svg>
    ),
  },
  {
    label: 'Smart Home',
    gradient: 'from-violet-500 to-purple-600',
    icon: (
      <svg aria-hidden="true" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    label: 'EV Charging',
    gradient: 'from-emerald-400 to-teal-600',
    icon: (
      <svg aria-hidden="true" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C13.21 17.89 11 21 11 21z" />
      </svg>
    ),
  },
]

export function Hero() {
  return (
    <>
      {/* Hero — full-bleed dark blue with diagonal gradient, inspired by Mitsubishi */}
      <section className="relative overflow-hidden bg-slate-900 pb-0">
        {/* Decorative gradient blob */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-indigo-500/15 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-0 sm:px-6 lg:px-8 lg:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-4 py-1.5 ring-1 ring-blue-400/30">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              <span className="text-sm font-medium text-blue-300">
                Auckland&apos;s trusted electricians since 2014
              </span>
            </div>

            <h1 className="mt-6 font-display text-5xl font-medium tracking-tight text-white sm:text-6xl lg:text-7xl">
              Better energy,{' '}
              <span className="bg-linear-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                inside and out
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
              Solar panels, heat pumps, EV charging, and smart home automation.
              Auckland&apos;s one-stop electrical team — certified, trusted, and
              ready for your next project.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-x-5">
              <Button href="#contact" color="blue" className="px-8">
                Get a Free Solar Quote
              </Button>
              <a
                href="tel:0993903620"
                className="flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/10 transition"
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                09-390-3620
              </a>
            </div>

            {/* Stats row */}
            <div className="mt-14 grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-8">
              {[
                { value: '10+', label: 'Years experience' },
                { value: '500+', label: 'Solar installs' },
                { value: '5★', label: 'Google rating' },
              ].map((stat) => (
                <div key={stat.label} className="px-4">
                  <p className="font-display text-3xl font-semibold text-blue-400 sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Service cards grid — placeholder images, Mitsubishi-inspired card strip */}
          <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {serviceCards.map((card) => (
              <div
                key={card.label}
                className={`group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br ${card.gradient} aspect-square cursor-pointer transition hover:scale-[1.02] hover:shadow-2xl sm:aspect-4/3`}
              >
                {/* Decorative circle */}
                <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-white/10" />
                <div className="absolute -right-2 -bottom-2 h-12 w-12 rounded-full bg-white/10" />
                <div className="relative z-10 flex flex-col items-center gap-3">
                  {card.icon}
                  <span className="font-display text-sm font-semibold text-white sm:text-base">
                    {card.label}
                  </span>
                </div>
                {/* Hover arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <svg aria-hidden="true" className="h-5 w-5 text-white/70" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certification strip — white band below hero */}
      <div className="border-b border-slate-200 bg-white py-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Certified &amp; accredited
            </p>
            {[
              'Master Electricians NZ',
              'SEANZ Member',
              'Registered Electrical Inspector',
            ].map((cert) => (
              <div
                key={cert}
                className="flex h-8 items-center rounded-full bg-slate-100 px-4"
              >
                <span className="text-xs font-semibold text-slate-600">
                  {cert}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

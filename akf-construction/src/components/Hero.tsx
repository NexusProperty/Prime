import { Button } from '@/components/Button'

// Placeholder project cards — replace gradient divs with next/image when photos available
// Solid Build pattern: feature projects directly in the hero section
const heroProjects = [
  {
    label: 'East Tāmaki Extension',
    type: 'Home Extension',
    gradient: 'from-slate-700 to-slate-900',
    accent: 'bg-amber-400',
  },
  {
    label: 'Flat Bush Renovation',
    type: 'Full Renovation',
    gradient: 'from-stone-600 to-stone-900',
    accent: 'bg-amber-400',
  },
  {
    label: 'Beachlands Deck',
    type: 'Deck & Landscaping',
    gradient: 'from-slate-600 to-slate-800',
    accent: 'bg-amber-400',
  },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-20 sm:py-28">
      {/* Subtle texture overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(251,191,36,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(100,116,139,0.15) 0%, transparent 50%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-16 lg:flex-row lg:items-center lg:gap-12">

          {/* Left — headline + CTAs */}
          <div className="flex-1 lg:max-w-xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-amber-400" />
              <span className="text-sm font-semibold uppercase tracking-widest text-amber-400">
                Auckland — Established 2010
              </span>
            </div>

            <h1 className="mt-5 font-display text-5xl font-medium tracking-tight text-white sm:text-6xl lg:text-7xl">
              Built to last.
              <br />
              <span className="text-amber-400">Designed to impress.</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-slate-400">
              Renovations, decks, and fencing that Auckland homeowners are proud
              of. Premium materials, exceptional craftsmanship, and on-time
              delivery — every project, every time.
            </p>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                '✓ 10-year structural guarantee',
                '✓ Licensed building practitioners',
                '✓ Council consent managed',
              ].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center rounded-full bg-white/5 px-4 py-1.5 text-sm font-medium text-slate-300 ring-1 ring-white/10"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
              <Button href="#contact" color="white">
                Get a Free Quote
              </Button>
              <a
                href="#projects"
                className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                View our projects
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z" clipRule="evenodd" />
                </svg>
              </a>
            </div>

            {/* Stats */}
            <div className="mt-14 grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-8">
              {[
                { value: '15+', label: 'Years in Auckland' },
                { value: '200+', label: 'Projects completed' },
                { value: '5★', label: 'Google rating' },
              ].map((stat) => (
                <div key={stat.label} className="px-4 first:pl-0 last:pr-0">
                  <p className="font-display text-3xl font-semibold text-amber-400">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — featured project cards (Solid Build pattern) */}
          <div className="flex-1 lg:max-w-md">
            <div className="flex flex-col gap-4">
              {heroProjects.map((project, idx) => (
                <div
                  key={project.label}
                  className={`group relative overflow-hidden rounded-2xl bg-linear-to-br ${project.gradient} transition hover:scale-[1.01] hover:shadow-2xl cursor-pointer`}
                  style={{ height: idx === 0 ? '200px' : '140px' }}
                >
                  {/* Decorative pattern */}
                  <div className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)',
                    }}
                    aria-hidden="true"
                  />
                  {/* Bottom label */}
                  <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5">
                    <div>
                      <span className={`inline-block rounded-full ${project.accent} px-2.5 py-0.5 text-xs font-bold text-slate-900 mb-2`}>
                        {project.type}
                      </span>
                      <p className="font-display text-lg font-semibold text-white">
                        {project.label}
                      </p>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 opacity-0 transition group-hover:opacity-100">
                      <svg aria-hidden="true" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  {/* Gradient overlay at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/60 to-transparent" aria-hidden="true" />
                </div>
              ))}

              <p className="text-center text-xs text-slate-600">
                Project photos coming soon — see{' '}
                <a href="#testimonials" className="text-amber-500 hover:text-amber-400 underline">
                  client testimonials
                </a>{' '}
                in the meantime
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

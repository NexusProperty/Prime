import { Container } from '@/components/Container'

const capabilities = [
  {
    num: '01',
    title: 'Renovations & Alterations',
    description:
      'Complete architectural overhauls. We strip back the old and build the extraordinary. Precision-engineered kitchens, bathrooms, and structural additions.',
  },
  {
    num: '02',
    title: 'Architectural Decks',
    description:
      'Engineered hardwood and composite decking. Built for the harsh New Zealand climate, structurally sound and backed by a 10-year guarantee.',
  },
  {
    num: '03',
    title: 'New Builds & Extensions',
    description:
      'From vacant lot to dream home. We handle the consent, the engineering, and the execution with zero compromises on quality.',
  },
  {
    num: '04',
    title: 'Fencing & Boundaries',
    description:
      'Horizontal slat privacy fencing, pool compliance, retaining walls, and automated gates. Built to last and designed to enhance property value.',
  },
]

export function PrimaryFeatures() {
  return (
    <section id="services" className="relative bg-white py-20 sm:py-32">
      {/* Section label */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-center gap-4">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
            // Capabilities
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-slate-900 sm:text-5xl">
          Engineered Solutions.
        </h2>
      </div>

      <Container>
        <div className="mt-16 grid grid-cols-1 gap-px bg-slate-200 sm:grid-cols-2">
          {capabilities.map((cap) => (
            <div
              key={cap.num}
              className="group relative bg-white px-10 py-10 transition-colors hover:bg-slate-50"
            >
              {/* Large faded index number */}
              <div
                aria-hidden="true"
                className="absolute right-6 top-6 font-mono text-7xl font-bold leading-none text-slate-100 transition-colors group-hover:text-slate-200 select-none"
              >
                {cap.num}
              </div>

              <p className="relative font-display text-xl font-bold uppercase tracking-tight text-slate-900">
                {cap.title}
              </p>
              <p className="relative mt-3 text-sm leading-relaxed text-slate-500">
                {cap.description}
              </p>

              {/* Hairline CTA */}
              <a
                href="#contact"
                className="relative mt-6 inline-flex items-center gap-2 border-b border-slate-900 pb-0.5 font-mono text-xs font-bold uppercase tracking-widest text-slate-900 transition-all hover:gap-3"
              >
                Request Quote
                <svg
                  aria-hidden="true"
                  className="h-3 w-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

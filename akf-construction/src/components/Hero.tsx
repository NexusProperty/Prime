export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-white pt-20 pb-16">
      {/* Coordinate stamps — top left */}
      <div className="absolute top-8 left-8 z-10 hidden sm:block">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
          Auckland, NZ // EST 2010
        </p>
      </div>

      {/* Right-aligned grayscale architectural photo */}
      <div
        className="absolute right-0 top-0 h-full w-1/2 grayscale opacity-20 md:opacity-30 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop")',
        }}
        aria-hidden="true"
      />
      {/* Fade left edge of photo into white */}
      <div
        className="absolute right-0 top-0 h-full w-1/2 bg-linear-to-r from-white to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Brutalist eyebrow line */}
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px w-12 bg-slate-900" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
              General Contractor
            </span>
          </div>

          {/* Massive brutalist headline */}
          <h1 className="font-display text-6xl font-bold uppercase leading-none tracking-tight text-slate-900 sm:text-7xl lg:text-8xl">
            A TEAM THAT BUILDS
          </h1>

          {/* Subheadline */}
          <p className="mt-6 max-w-lg text-xl font-medium leading-relaxed text-slate-600">
            Auckland&apos;s Expert Builders for Residential & Commercial Projects
          </p>
          <p className="mt-2 font-mono text-sm font-bold uppercase tracking-[0.2em] text-amber-600">
            Built on Trust. Driven by Quality.
          </p>

          {/* Hairline underline CTA */}
          <div className="mt-10">
            <a
              href="/contact-us"
              className="group inline-flex items-center gap-3 border-b-2 border-slate-900 pb-1 font-sans text-sm font-bold uppercase tracking-widest text-slate-900 transition-all hover:gap-5"
            >
              Get a Free Quote
              <svg
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
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

          {/* Recent work label */}
          <div className="mt-20 flex items-center gap-4">
            <div className="h-px w-8 bg-slate-300" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
              // Recent Work
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

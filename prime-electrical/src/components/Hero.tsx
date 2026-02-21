'use client'

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-white pt-20 pb-16">
      {/* Subtle technical grid overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Status stamps — top left */}
      <div className="absolute top-8 left-8 z-10 hidden sm:flex items-center gap-3">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
          System Online
        </p>
        <span className="font-mono text-[10px] text-slate-300">|</span>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
          Auckland // NZ
        </p>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Eyebrow rule */}
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px w-12 bg-blue-600" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
              Master Electricians NZ
            </span>
          </div>

          {/* Massive technical headline */}
          <h1 className="font-display text-6xl font-bold leading-none tracking-tight text-slate-900 sm:text-7xl lg:text-8xl">
            Engineered
            <br />
            <span className="text-slate-900">Currents.</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-slate-600">
            High-voltage systems, intelligent automation, and solar arrays.
            Executed with clinical precision.
          </p>

          {/* Terminal-style CTA */}
          <div className="mt-10">
            <a
              href="#services"
              className="group inline-flex items-center gap-3 border border-slate-900 bg-transparent px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest text-slate-900 transition-all hover:bg-slate-900 hover:text-white"
            >
              <span className="text-blue-600 group-hover:text-blue-400">{'>'}</span>
              Initiate Diagnostic
            </a>
          </div>

          {/* Credential stamps */}
          <div className="mt-12 flex flex-wrap gap-6">
            <div className="border border-slate-200 px-4 py-2">
              <p className="font-mono text-[9px] uppercase tracking-widest text-slate-400">
                Credential
              </p>
              <p className="font-mono text-xs font-bold uppercase text-slate-900">
                Master Electricians
              </p>
            </div>
            <div className="border border-slate-200 px-4 py-2">
              <p className="font-mono text-[9px] uppercase tracking-widest text-slate-400">
                Authorization
              </p>
              <p className="font-mono text-xs font-bold uppercase text-slate-900">
                Certified Level 4
              </p>
            </div>
          </div>

          {/* Engineering capabilities label */}
          <div className="mt-20 flex items-center gap-4">
            <div className="h-px w-8 bg-slate-300" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
              // Engineering Capabilities
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

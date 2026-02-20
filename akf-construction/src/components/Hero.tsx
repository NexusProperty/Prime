// Minimalist "Drafting Table" UI Concept - AKF Construction Hero
export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center bg-white overflow-hidden">
      
      {/* 
        Agent 1: Extreme Minimalism 
        Agent 2: Subtraction of all non-essential elements
        The background is pure white. The layout uses massive typographic scale to guide the eye.
      */}

      {/* The perfectly composed architectural photograph (Right 60% of screen) */}
      <div 
        className="absolute inset-y-0 right-0 z-0 w-full lg:w-[60%] bg-cover bg-center bg-no-repeat grayscale-[20%]"
        style={{
          // High-end, stark architectural photography
          backgroundImage: 'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop")',
        }}
        aria-hidden="true"
      />

      {/* 
        To ensure text readability on smaller screens, we add a subtle white fade from the left. 
        On large screens where the text sits entirely in the white space, this is invisible.
      */}
      <div 
        className="absolute inset-0 z-0 bg-linear-to-r from-white via-white/90 to-transparent lg:w-[50%]" 
        aria-hidden="true" 
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          
          {/* Stark Coordinate / Date Stamp */}
          <div className="mb-12 flex items-center gap-4">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-slate-900">
                EST. 2010
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                AUCKLAND, NZ
              </span>
            </div>
            {/* The structural crosshair */}
            <svg aria-hidden="true" className="h-4 w-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M12 2v20m10-10H2" />
            </svg>
          </div>

          {/* Massive Brutalist Headline */}
          <h1 className="font-display text-6xl font-bold uppercase tracking-tighter text-slate-950 sm:text-7xl lg:text-[5.5rem] leading-[0.9]">
            We Build <br />
            Auckland.
          </h1>

          {/* Minimalist Subtext */}
          <p className="mt-8 text-sm font-medium leading-relaxed text-slate-500 max-w-sm">
            Architectural renovations and structural engineering. Executed with absolute precision.
          </p>

          {/* The Action: Hairline Underline instead of a standard button */}
          <div className="mt-16 inline-block">
            <a 
              href="#contact" 
              className="group flex items-center gap-4 focus:outline-hidden"
            >
              <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-slate-900 transition-colors group-hover:text-amber-500">
                [ Initiate Project ]
              </span>
              <div className="h-px w-12 bg-slate-900 transition-all duration-500 group-hover:w-24 group-hover:bg-amber-500" />
            </a>
          </div>
          
        </div>
      </div>

      {/* Drafting Table Axis Lines (Subtle UI details) */}
      <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-100 hidden lg:block" aria-hidden="true" />
      <div className="absolute left-0 right-0 bottom-8 h-px bg-slate-100 hidden lg:block" aria-hidden="true" />
      
    </section>
  )
}

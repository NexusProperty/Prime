// Minimalist "Minimal Schematic" UI Concept - Prime Electrical Hero
export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center bg-slate-50 overflow-hidden pt-20 pb-0 lg:pt-0">
      
      {/* 
        Agent 1: Extreme Minimalism 
        Agent 2: Subtraction of all non-essential elements
        The background is pure clinical white/slate-50.
      */}

      {/* The perfectly composed technical photograph (Right 50% of screen) */}
      <div 
        className="absolute inset-y-0 right-0 z-0 w-full lg:w-[50%] bg-cover bg-center bg-no-repeat grayscale-[20%]"
        style={{
          // High-end, stark technical macro photography (e.g., precise wiring, switchboard)
          backgroundImage: 'url("https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop")',
        }}
        aria-hidden="true"
      />

      {/* 
        To ensure text readability on smaller screens, we add a subtle white fade from the left. 
        On large screens where the text sits entirely in the white space, this is invisible.
      */}
      <div 
        className="absolute inset-0 z-0 bg-linear-to-r from-slate-50 via-slate-50/95 to-transparent lg:w-[60%]" 
        aria-hidden="true" 
      />

      {/* Technical Blueprint Grid Texture (Subtle over the white space) */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none lg:w-[50%]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #94a3b8 1px, transparent 1px),
            linear-gradient(to bottom, #94a3b8 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg lg:pr-8">
          
          {/* Clinical Telemetry Bar */}
          <div className="mb-12 flex items-center gap-4 border-b border-slate-200 pb-4">
            <div className="flex h-2 w-2 items-center justify-center">
              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-slate-900">
                SYSTEM ONLINE
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                AUCKLAND // NZ
              </span>
            </div>
            {/* The technical crosshair */}
            <svg aria-hidden="true" className="ml-auto h-4 w-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M12 2v20m10-10H2" />
            </svg>
          </div>

          {/* Stark Precision Headline */}
          <h1 className="font-display text-5xl font-bold uppercase tracking-tighter text-slate-900 sm:text-6xl lg:text-[4.5rem] leading-[0.9]">
            Engineered <br />
            Currents.
          </h1>

          {/* Clinical Subtext */}
          <p className="mt-8 text-sm font-medium leading-relaxed text-slate-500 max-w-sm">
            High-voltage systems, intelligent automation, and solar arrays. Executed with clinical precision.
          </p>

          {/* The Action: Terminal Input instead of a standard button */}
          <div className="mt-16">
            <a 
              href="#contact" 
              className="group flex flex-col focus:outline-hidden"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-blue-600 animate-pulse">
                  &gt;
                </span>
                <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-slate-900 group-hover:text-blue-600 transition-colors">
                  INITIATE DIAGNOSTIC
                </span>
              </div>
              <div className="h-px w-full bg-slate-200 mt-2 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-1/4 bg-blue-600 -translate-x-full group-hover:translate-x-0 group-hover:w-full transition-all duration-700 ease-in-out" />
              </div>
            </a>
          </div>

          {/* Clinical Trust Badges */}
          <div className="mt-16 grid grid-cols-2 gap-8 border-t border-slate-200 pt-8">
             <div className="flex flex-col gap-1">
               <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">CREDENTIAL</span>
               <span className="font-mono text-xs font-bold text-slate-900">MASTER ELECTRICIANS</span>
             </div>
             <div className="flex flex-col gap-1">
               <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">AUTHORIZATION</span>
               <span className="font-mono text-xs font-bold text-slate-900">CERTIFIED LEVEL 4</span>
             </div>
          </div>
          
        </div>
      </div>

      {/* Schematic Traces (Subtle UI details) */}
      <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-200 hidden lg:block" aria-hidden="true" />
      <div className="absolute left-0 right-0 bottom-8 h-px bg-slate-200 hidden lg:block" aria-hidden="true" />

      {/* Crosshair corner markers on the photo side */}
      <div className="absolute top-8 right-8 w-4 h-4 border-t border-r border-white/50 hidden lg:block" aria-hidden="true" />
      <div className="absolute bottom-8 right-8 w-4 h-4 border-b border-r border-white/50 hidden lg:block" aria-hidden="true" />
      
    </section>
  )
}

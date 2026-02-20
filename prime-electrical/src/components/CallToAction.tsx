import { Container } from '@/components/Container'

const lenders = [
  { name: 'ANZ', detail: 'Interest-free heat pump & insulation loans' },
  { name: 'Westpac', detail: 'Warm Up Loan' },
  { name: 'GEM Visa', detail: '6 months interest-free on $250+' },
  { name: 'Q Mastercard', detail: '3+ months zero interest & zero payments' },
]

export function CallToAction() {
  return (
    <>
      {/* Financing section - Technical Grid */}
      <section
        id="financing"
        aria-labelledby="financing-title"
        className="bg-slate-950 py-20 sm:py-28 border-t border-slate-800 relative overflow-hidden"
      >
        {/* Subtle circuit lines */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 0 40 L 40 0 M 20 40 L 40 20 M 0 20 L 20 0" stroke="white" strokeWidth="0.5" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)" />
          </svg>
        </div>

        <Container className="relative z-10">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-blue-500" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-blue-400">
                Capital Allocation
              </span>
              <div className="h-px w-8 bg-blue-500" />
            </div>
            <h2
              id="financing-title"
              className="font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl"
            >
              System Upgrades from{' '}
              <span className="text-blue-500">$0 Upfront</span>
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              We interface directly with Auckland&apos;s leading financial institutions to make energy upgrades accessible. Seamless processing, zero friction.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
            {lenders.map((lender) => (
              <div
                key={lender.name}
                className="flex items-start gap-4 bg-slate-900 border border-slate-800 px-6 py-5 hover:border-blue-500/50 transition-colors group"
              >
                <div className="flex h-10 w-10 flex-none items-center justify-center bg-slate-950 border border-slate-800 group-hover:border-blue-500/50 transition-colors">
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 text-blue-500"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-display text-base font-bold uppercase tracking-widest text-white">
                    {lender.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 font-mono">
                    {lender.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <a 
              href="#contact" 
              className="inline-flex h-12 items-center justify-center border border-slate-700 bg-transparent px-8 font-mono text-xs font-bold uppercase tracking-widest text-slate-300 transition-colors hover:border-blue-500 hover:text-white"
            >
              Initialize Finance Request
            </a>
          </div>
        </Container>
      </section>

      {/* Final CTA section - Clinical Action */}
      <section
        id="contact"
        className="relative overflow-hidden bg-blue-950 py-24 sm:py-32 border-t-2 border-blue-500"
      >
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '10vw 100%'
          }}
        />

        <Container className="relative z-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">
              Commence Operations.
            </h2>
            <p className="mt-6 text-lg text-blue-200">
              Engage our technical team for a site assessment. We deliver precise, fixed-price proposals within 24 hours of inspection.
            </p>
            <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-x-6">
              <a 
                href="tel:0993903620"
                className="inline-flex h-14 w-full sm:w-auto items-center justify-center bg-blue-600 px-10 font-sans text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-blue-500"
              >
                CALL [09] 390-3620
              </a>
              <a
                href="mailto:info@theprimeelectrical.co.nz"
                className="inline-flex h-14 w-full sm:w-auto items-center justify-center border border-blue-400 bg-transparent px-10 font-sans text-sm font-bold uppercase tracking-widest text-blue-100 transition-colors hover:bg-blue-900"
              >
                SUBMIT SCHEMATICS
              </a>
            </div>
            
            <div className="mt-12 border-t border-blue-800/50 pt-8 flex justify-center">
              <div className="inline-flex items-center gap-3 bg-slate-900/50 px-4 py-2 border border-slate-800">
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <p className="font-mono text-xs uppercase tracking-widest text-slate-300">
                  Dispatch Ready: Mon–Fri 8:30am–5:00pm
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

import { Container } from '@/components/Container'

const financingOptions = [
  { provider: 'ANZ', detail: 'Interest-free heat pump & insulation loans' },
  { provider: 'Westpac', detail: 'Warm Up Loan' },
  { provider: 'GEM Visa', detail: '6 months interest-free on $250+' },
  { provider: 'Q Mastercard', detail: '3+ months zero interest & zero payments' },
]

export function CallToAction() {
  return (
    <>
      {/* Capital Allocation / Financing section */}
      <section
        id="financing"
        aria-labelledby="financing-title"
        className="relative bg-slate-950 py-20 sm:py-28 border-t border-slate-900"
      >
        {/* Subtle circuit grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <Container className="relative">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-0.5 w-12 bg-blue-600" />
            <span className="font-mono text-sm font-bold uppercase tracking-widest text-blue-600">
              Capital Allocation
            </span>
          </div>

          <h2
            id="financing-title"
            className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl"
          >
            System Upgrades from{' '}
            <span className="text-blue-400">$0 Upfront</span>
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-slate-400">
            We interface directly with Auckland&apos;s leading financial institutions to
            make energy upgrades accessible. Seamless processing, zero friction.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-px bg-slate-800 sm:grid-cols-2 lg:grid-cols-4">
            {financingOptions.map((opt) => (
              <div key={opt.provider} className="bg-slate-950 px-8 py-6">
                <p className="font-display text-xl font-bold text-white">
                  {opt.provider}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {opt.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 border border-blue-600 px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest text-blue-400 transition-colors hover:bg-blue-600 hover:text-white"
            >
              {'>'} Initialize Finance Request
            </a>
          </div>
        </Container>
      </section>

      {/* Commence Operations CTA */}
      <section
        id="contact-cta"
        className="relative bg-slate-100 py-24 sm:py-32"
      >
        {/* Blueprint circuit SVG overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='40' fill='none' stroke='%230f172a' stroke-width='0.5'/%3E%3Ccircle cx='50' cy='50' r='2' fill='%230f172a'/%3E%3Cline x1='10' y1='50' x2='90' y2='50' stroke='%230f172a' stroke-width='0.3'/%3E%3Cline x1='50' y1='10' x2='50' y2='90' stroke='%230f172a' stroke-width='0.3'/%3E%3C/svg%3E")`,
            backgroundSize: '120px 120px',
          }}
        />

        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-8 flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-slate-400" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-500">
                Dispatch Ready
              </span>
              <div className="h-px w-16 bg-slate-400" />
            </div>

            <h2 className="font-display text-5xl font-bold uppercase tracking-tight text-slate-900 sm:text-6xl">
              Commence Operations.
            </h2>
            <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
              Engage our technical team for a site assessment. We deliver precise,
              fixed-price proposals within 24 hours of inspection.
            </p>

            <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-x-6">
              <a
                href="tel:0993903620"
                className="inline-flex h-16 w-full sm:w-auto items-center justify-center bg-slate-900 px-10 font-sans text-base font-bold uppercase tracking-widest text-blue-400 transition-colors hover:bg-slate-800"
              >
                CALL [09] 390-3620
              </a>
              <a
                href="mailto:info@theprimeelectrical.co.nz"
                className="inline-flex h-16 w-full sm:w-auto items-center justify-center border-2 border-slate-900 bg-transparent px-10 font-sans text-base font-bold uppercase tracking-widest text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
              >
                SUBMIT SCHEMATICS
              </a>
            </div>

            <div className="mt-12 inline-block border border-slate-300 bg-white px-6 py-3 shadow-xs">
              <p className="text-sm font-mono font-bold uppercase tracking-widest text-slate-500">
                Dispatch Ready: Mon–Fri 8:30am–5:00pm
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

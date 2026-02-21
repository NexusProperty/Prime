import { Container } from '@/components/Container'

const guarantees = [
  {
    title: 'Absolute Quality Guarantee',
    desc: 'If our clinical standard is not met, notify us within 48 hours. A team will be dispatched immediately to rectify at zero cost.',
  },
  {
    title: 'Zero Friction Flexibility',
    desc: 'Modify, suspend, or cancel your service schedule with 24 hours notice. No cancellation fees, no contracts.',
  },
  {
    title: 'Dedicated Personnel',
    desc: 'We assign a dedicated professional to your property to ensure absolute consistency and trust across every visit.',
  },
]

export function CallToAction() {
  return (
    <>
      {/* AKF cross-sell banner */}
      <section
        id="akf-cross-sell"
        aria-labelledby="akf-cross-sell-title"
        className="bg-sky-50 border-y border-sky-100 py-12 sm:py-16"
      >
        <Container>
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div>
              <h2
                id="akf-cross-sell-title"
                className="font-display text-xl font-bold text-slate-900 sm:text-2xl"
              >
                Had renovation work done recently?
              </h2>
              <p className="mt-2 text-slate-600">
                We specialise in post-build cleans. Ask about our AKF
                Construction bundle — CleanJet + AKF together saves you time and
                money.
              </p>
            </div>
            <a
              href="https://akfconstruction.co.nz/"
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-sky-700 shadow-sm ring-1 ring-sky-200 transition-colors hover:bg-sky-50"
            >
              Learn about our AKF bundle
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </Container>
      </section>

      {/* Immaculate. By Design. — final CTA */}
      <section
        id="initiate-service"
        aria-labelledby="initiate-service-title"
        className="relative overflow-hidden bg-slate-900 py-24 sm:py-32"
      >
        {/* Clinical grid overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #0ea5e9 1px, transparent 1px), linear-gradient(to bottom, #0ea5e9 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-sky-500/50" />
              <span className="text-xs font-bold uppercase tracking-widest text-sky-500">
                Service Protocol
              </span>
              <div className="h-px w-12 bg-sky-500/50" />
            </div>

            <h2
              id="initiate-service-title"
              className="font-display text-5xl font-bold tracking-tight text-white sm:text-6xl"
            >
              Immaculate.
              <br />
              <span className="text-sky-400">By Design.</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-400">
              CleanJet was engineered to replace the friction of traditional
              residential cleaning. We deploy rigorously vetted professionals
              armed with hospital-grade, eco-sterile solutions to ensure your
              environment is flawless.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="#booking"
                className="inline-flex h-14 w-full sm:w-auto items-center justify-center bg-sky-600 px-10 font-sans text-base font-semibold text-white transition-colors hover:bg-sky-500 rounded-full"
              >
                Schedule Service
              </a>
              <a
                href="tel:0800000000"
                className="inline-flex h-14 w-full sm:w-auto items-center justify-center border border-white/20 bg-transparent px-10 font-sans text-base font-semibold text-slate-300 transition-colors hover:bg-white/10 rounded-full"
              >
                Call: 0800 000 000
              </a>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              No long-term contracts. Auckland metropolitan area only.
            </p>

            {/* Guarantee cards */}
            <div className="mt-14 grid grid-cols-1 gap-px bg-white/5 sm:grid-cols-3">
              {guarantees.map((g) => (
                <div key={g.title} className="bg-slate-900 px-6 py-8 text-left">
                  <p className="font-display text-sm font-bold text-white">
                    {g.title}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    {g.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

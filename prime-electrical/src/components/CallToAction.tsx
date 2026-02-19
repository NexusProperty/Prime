import { Button } from '@/components/Button'
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
      {/* Financing section */}
      <section
        id="financing"
        aria-labelledby="financing-title"
        className="bg-slate-900 py-20 sm:py-28"
      >
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">
              Finance options
            </p>
            <h2
              id="financing-title"
              className="mt-3 font-display text-3xl tracking-tight text-white sm:text-4xl"
            >
              Solar & heat pumps from{' '}
              <span className="text-amber-400">$0 upfront</span>
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              We work with Auckland&apos;s leading lenders to make energy
              upgrades affordable. No complicated paperwork — we&apos;ll walk
              you through every option.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
            {lenders.map((lender) => (
              <div
                key={lender.name}
                className="flex items-start gap-4 rounded-2xl bg-white/5 px-6 py-5 ring-1 ring-white/10"
              >
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-amber-400/20 ring-1 ring-amber-400/30">
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 text-amber-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-display text-base font-semibold text-white">
                    {lender.name}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-400">
                    {lender.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button href="#contact" color="blue">
              Talk to us about finance
            </Button>
          </div>
        </Container>
      </section>

      {/* Final CTA section */}
      <section
        id="contact"
        className="relative overflow-hidden bg-blue-600 py-24 sm:py-32"
      >
        {/* Decorative blur */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-blue-500/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-indigo-600/40 blur-3xl" />
        </div>

        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
              Ready to power up your home?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Get a free, no-obligation quote. We come to you, assess your home,
              and give you a written proposal — usually within 24 hours.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-x-6">
              <Button href="tel:0993903620" color="white">
                📞 Call 09-390-3620
              </Button>
              <a
                href="mailto:info@theprimeelectrical.co.nz"
                className="flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white ring-1 ring-white/30 hover:bg-white/10 transition"
              >
                Email us instead
              </a>
            </div>
            <p className="mt-6 text-sm text-blue-200">
              Mon–Fri 8:30am–5:00pm &nbsp;·&nbsp; Unit 2, 41 Smales Road, East Tāmaki, Auckland 2013
            </p>
          </div>
        </Container>
      </section>
    </>
  )
}

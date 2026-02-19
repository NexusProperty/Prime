import { Button } from '@/components/Button'
import { Container } from '@/components/Container'

const commitments = [
  {
    title: 'Free site consultation',
    desc: 'We visit your property at no cost, assess the scope, and deliver a detailed written quote within 48 hours.',
    icon: (
      <svg aria-hidden="true" className="h-6 w-6 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
      </svg>
    ),
  },
  {
    title: 'On time, on budget',
    desc: 'We provide a fixed-price quote and stick to it. Weekly progress updates keep you informed throughout the build.',
    icon: (
      <svg aria-hidden="true" className="h-6 w-6 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
      </svg>
    ),
  },
  {
    title: '10-year structural guarantee',
    desc: 'All structural work is backed by a 10-year guarantee and completed by Licensed Building Practitioners.',
    icon: (
      <svg aria-hidden="true" className="h-6 w-6 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
      </svg>
    ),
  },
]

export function CallToAction() {
  return (
    <>
      {/* Trust commitments band */}
      <section
        id="why-akf"
        aria-labelledby="why-akf-title"
        className="bg-slate-900 py-20 sm:py-28"
      >
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">
                Built on trust
              </p>
              <h2
                id="why-akf-title"
                className="mt-3 font-display text-3xl tracking-tight text-white sm:text-4xl"
              >
                Why Auckland homeowners choose AKF.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-400">
                We started AKF Construction because Auckland homeowners deserved
                a building company that actually keeps its word. No surprise
                costs. No missed deadlines. No cutting corners.
              </p>
              <p className="mt-4 text-base text-slate-400">
                Every project is managed by a dedicated project lead, built by
                our own crews (not subcontractors), and finished with a professional
                CleanJet post-build clean — so you can move straight back in.
              </p>
              <div className="mt-10">
                <Button href="#contact" color="white">
                  Get a Free Quote
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {commitments.map((c) => (
                <div
                  key={c.title}
                  className="flex items-start gap-5 rounded-2xl bg-white/5 px-6 py-5 ring-1 ring-white/10"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 ring-1 ring-amber-500/30">
                    {c.icon}
                  </div>
                  <div>
                    <p className="font-display text-base font-semibold text-white">
                      {c.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">
                      {c.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section
        id="contact"
        className="relative overflow-hidden bg-slate-800 py-24 sm:py-32"
      >
        {/* Amber glow */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
        </div>

        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            {/* Eyebrow */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-amber-400" />
              <span className="text-sm font-semibold uppercase tracking-widest text-amber-400">
                Free consultation
              </span>
              <div className="h-px w-8 bg-amber-400" />
            </div>

            <h2 className="font-display text-4xl tracking-tight text-white sm:text-5xl">
              Ready to transform
              <br />
              your home?
            </h2>
            <p className="mt-5 text-lg text-slate-400">
              Free site visit. Written quote within 48 hours. No obligation.
              We come to you, anywhere in Auckland.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-x-5">
              <Button href="tel:0995198763" color="white">
                📞 Call 09-951-8763
              </Button>
              <a
                href="mailto:info@akfconstruction.co.nz"
                className="flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-slate-300 ring-1 ring-white/20 hover:bg-white/10 transition"
              >
                Email us instead
              </a>
            </div>

            <p className="mt-6 text-sm text-slate-600">
              09-951-8763 &nbsp;·&nbsp; info@akfconstruction.co.nz &nbsp;·&nbsp;
              Mon–Fri 8:00am–5:00pm
            </p>
          </div>
        </Container>
      </section>
    </>
  )
}

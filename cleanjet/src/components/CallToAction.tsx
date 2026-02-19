import { Button } from '@/components/Button'
import { Container } from '@/components/Container'

const guarantees = [
  {
    title: 'Great Clean Guarantee',
    desc: 'Not happy? We\'ll reclean for free within 48 hours — no questions asked, every single time.',
    icon: (
      <svg aria-hidden="true" className="h-6 w-6 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
      </svg>
    ),
  },
  {
    title: 'No Lock-In Contract',
    desc: 'Skip, reschedule, or cancel any clean with 24 hours\' notice. No fees, no hassle.',
    icon: (
      <svg aria-hidden="true" className="h-6 w-6 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    ),
  },
  {
    title: 'Same Cleaner Every Time',
    desc: 'We match you with a cleaner you love and stick with them — consistency you can count on.',
    icon: (
      <svg aria-hidden="true" className="h-6 w-6 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    ),
  },
]

export function CallToAction() {
  return (
    <>
      {/* Why CleanJet — trust section (before final CTA) */}
      <section
        id="why-cleanjet"
        aria-labelledby="why-cleanjet-title"
        className="bg-slate-900 py-20 sm:py-28"
      >
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-sky-400">
                Why CleanJet
              </p>
              <h2
                id="why-cleanjet-title"
                className="mt-3 font-display text-3xl tracking-tight text-white sm:text-4xl"
              >
                We clean. You relax.
                <br />
                <span className="text-sky-400">That simple.</span>
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-400">
                We started CleanJet because Auckland deserved a cleaning service
                that actually respects both the cleaner and the client. Happy,
                trained cleaners deliver better results — every time.
              </p>
              <p className="mt-4 text-base text-slate-400">
                We hire, train, and background-check every cleaner. We use
                eco-friendly products that are safe for your family and pets.
                And we back every clean with our Great Clean Guarantee.
              </p>
              <div className="mt-10">
                <Button href="#booking" color="blue">
                  Book Your First Clean
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {guarantees.map((g) => (
                <div
                  key={g.title}
                  className="flex items-start gap-5 rounded-2xl bg-white/5 px-6 py-5 ring-1 ring-white/10"
                >
                  <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-sky-500/20 ring-1 ring-sky-500/30">
                    {g.icon}
                  </div>
                  <div>
                    <p className="font-display text-base font-semibold text-white">
                      {g.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">
                      {g.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Final booking CTA */}
      <section
        id="booking"
        className="relative overflow-hidden bg-sky-600 py-24 sm:py-32"
      >
        {/* Decorative blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-sky-500/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-cyan-600/40 blur-3xl" />
        </div>

        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 ring-1 ring-white/30">
              <span className="text-sm font-semibold text-white">
                🎉 Limited offer — book before Friday
              </span>
            </div>
            <h2 className="mt-6 font-display text-4xl tracking-tight text-white sm:text-5xl">
              First clean <span className="text-sky-200">20% off.</span>
            </h2>
            <p className="mt-4 text-lg text-sky-100">
              Try CleanJet risk-free. Not happy with your first clean? We&apos;ll
              come back and reclean for free — no questions asked.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-x-5">
              <Button href="#pricing" color="white">
                Book My First Clean →
              </Button>
              <a
                href="tel:0800000000"
                className="flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white ring-1 ring-white/30 hover:bg-white/10 transition"
              >
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                0800 000 000
              </a>
            </div>

            <p className="mt-6 text-sm text-sky-200">
              No lock-in contract · Cancel or reschedule any time · Auckland-wide service
            </p>
          </div>
        </Container>
      </section>
    </>
  )
}

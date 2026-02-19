// Implements @salient SecondaryFeatures.tsx pattern — repurposed as 4-step process timeline
// Mobile: stacked cards. Desktop: horizontal step progression
import { Container } from '@/components/Container'

const steps = [
  {
    number: '01',
    name: 'Consultation',
    summary: 'We come to you — no charge.',
    description:
      'We visit your site, listen to your vision, assess the scope, and provide a detailed written quote within 48 hours. No obligation.',
  },
  {
    number: '02',
    name: 'Design & Consent',
    summary: 'Plans done right the first time.',
    description:
      'Our designers create plans that meet Auckland Council requirements. We handle all consent applications so you don\'t have to.',
  },
  {
    number: '03',
    name: 'Build',
    summary: 'On time. On budget. No surprises.',
    description:
      'Our experienced crew builds to the spec — with weekly progress updates and a site kept clean and safe throughout.',
  },
  {
    number: '04',
    name: 'Handover & Clean',
    summary: 'Move straight back in.',
    description:
      'Every AKF project finishes with a professional post-build clean by our partner CleanJet, so your home is ready to enjoy from day one.',
  },
]

export function SecondaryFeatures() {
  return (
    <section
      id="process"
      aria-label="Our build process"
      className="pt-20 pb-14 sm:pt-32 sm:pb-20 lg:pb-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            A clear, professional process from first call to final handover —
            so you always know what&apos;s happening.
          </p>
        </div>

        {/* Mobile — stacked cards */}
        <div className="mt-16 flex flex-col gap-y-10 lg:hidden">
          {steps.map((step) => (
            <div key={step.name} className="flex gap-x-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 font-display text-lg font-semibold text-amber-700">
                {step.number}
              </div>
              <div>
                <h3 className="font-display text-lg text-slate-900">{step.name}</h3>
                <p className="mt-1 text-sm font-medium text-slate-600">{step.summary}</p>
                <p className="mt-2 text-sm text-slate-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop — horizontal steps */}
        <div className="mt-20 hidden lg:block">
          <div className="grid grid-cols-4 gap-x-8">
            {steps.map((step, index) => (
              <div key={step.name} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div
                    className="absolute top-6 left-1/2 h-0.5 w-full bg-slate-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 font-display text-lg font-semibold text-amber-700 ring-4 ring-white">
                    {step.number}
                  </div>
                  <h3 className="mt-4 font-display text-lg text-slate-900">{step.name}</h3>
                  <p className="mt-1 text-sm font-medium text-slate-600">{step.summary}</p>
                  <p className="mt-2 text-sm text-slate-500">{step.description}</p>
                  {/* CleanJet cross-sell on step 4 */}
                  {step.number === '04' && (
                    <a
                      href="https://cleanjet.co.nz"
                      className="mt-3 text-xs font-semibold text-sky-600 hover:text-sky-700"
                    >
                      Powered by CleanJet →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

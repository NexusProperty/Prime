import clsx from 'clsx'

const STEPS = [
  {
    n: 1,
    title: 'Consultation',
    desc: 'We visit your site, listen to your vision, quote within 48 hours.',
    partner: null,
  },
  {
    n: 2,
    title: 'Design & Consent',
    desc: 'Plans that meet Auckland Council requirements. We handle consent.',
    partner: null,
  },
  {
    n: 3,
    title: 'Build',
    desc: 'On time. On budget. Weekly progress updates. Site kept clean.',
    partner: null,
  },
  {
    n: 4,
    title: 'Handover & Clean',
    desc: 'Post-build CleanJet clean included. Move back in from day one.',
    partner: 'cleanjet',
  },
] as const

export function ProjectTimeline() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            A clear, professional process from first call to final handover.
          </p>
        </div>
        <div className="flex flex-col gap-10 sm:flex-row sm:gap-4">
          {STEPS.map((step, i) => (
            <div key={step.n} className="relative flex flex-1 gap-4 sm:flex-col sm:items-center sm:text-center sm:gap-0">
              {i < STEPS.length - 1 && (
                <div
                  className="absolute left-[18px] top-10 h-[calc(100%+2.5rem)] w-0.5 bg-slate-200 sm:left-auto sm:right-[-50%] sm:top-[18px] sm:h-0.5 sm:w-full"
                  aria-hidden="true"
                />
              )}
              <div
                className={clsx(
                  'relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold text-sm text-white sm:mx-auto',
                  'bg-slate-900',
                )}
              >
                {step.n}
              </div>
              <div className="sm:mt-4">
                <h3 className="font-bold text-slate-900">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{step.desc}</p>
                {step.partner === 'cleanjet' && (
                  <a
                    href="https://cleanjet.co.nz"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-amber-600 hover:text-amber-700"
                  >
                    Powered by CleanJet →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { Container } from '@/components/Container'

const standards = [
  {
    num: '01',
    title: 'Clinical Verification',
    tagline: 'Background-checked professionals.',
    description:
      'Every CleanJet technician undergoes rigorous background screening and maintains full public liability insurance. We deploy absolute professionals into your living space.',
  },
  {
    num: '02',
    title: 'Eco-Sterile Solutions',
    tagline: 'Non-toxic, maximum efficacy.',
    description:
      'We utilize hospital-grade, eco-certified products. Zero harsh chemicals. Zero toxic residue. Safe for children, pets, and the environment while delivering a flawless clean.',
  },
  {
    num: '03',
    title: '100% Quality Assurance',
    tagline: 'Guaranteed pristine results.',
    description:
      'Our standard is perfection. If an area falls short of our clinical baseline, report it within 24 hours. A team will be dispatched to reclean the area at zero cost.',
  },
]

export function SecondaryFeatures() {
  return (
    <section
      id="why-cleanjet"
      aria-label="Operating Standard"
      className="bg-slate-50 py-20 sm:py-32 border-t border-slate-100"
    >
      <Container>
        {/* Section label */}
        <div className="mb-6 flex items-center gap-4">
          <div className="h-0.5 w-8 bg-sky-600" />
          <span className="text-xs font-bold uppercase tracking-widest text-sky-600">
            Operating Standard
          </span>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start lg:gap-20">
          <div>
            <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Uncompromising
              <br />
              Cleanliness.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              We operate at the highest standard of residential hygiene. Vetted
              staff, eco-sterile products, and a zero-tolerance policy for dirt.
            </p>
          </div>

          <div className="space-y-0 divide-y divide-slate-200">
            {standards.map((s) => (
              <div key={s.num} className="py-8 first:pt-0 last:pb-0">
                <div className="flex items-start gap-6">
                  <span className="shrink-0 font-mono text-2xl font-bold text-slate-200">
                    {s.num}
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold text-slate-900">
                      {s.title}
                    </p>
                    <p className="text-sm font-semibold text-sky-600">{s.tagline}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      {s.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

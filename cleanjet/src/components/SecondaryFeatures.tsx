import { Container } from '@/components/Container'

const features = [
  {
    name: 'Clinical Verification',
    summary: 'Background-checked professionals.',
    description:
      'Every CleanJet technician undergoes rigorous background screening and maintains full public liability insurance. We deploy absolute professionals into your living space.',
    icon: (
      <svg aria-hidden="true" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    name: 'Eco-Sterile Solutions',
    summary: 'Non-toxic, maximum efficacy.',
    description:
      'We utilize hospital-grade, eco-certified products. Zero harsh chemicals. Zero toxic residue. Safe for children, pets, and the environment while delivering a flawless clean.',
    icon: (
      <svg aria-hidden="true" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    name: '100% Quality Assurance',
    summary: 'Guaranteed pristine results.',
    description:
      'Our standard is perfection. If an area falls short of our clinical baseline, report it within 24 hours. A team will be dispatched to reclean the area at zero cost.',
    icon: (
      <svg aria-hidden="true" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export function SecondaryFeatures() {
  return (
    <section
      id="secondary-features"
      aria-label="Why choose CleanJet"
      className="relative overflow-hidden py-24 sm:py-32 bg-white border-b border-slate-200"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-none border border-sky-200 bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-widest mb-6">
            <svg aria-hidden="true" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Operating Standard
          </div>
          
          <h2 className="font-display text-4xl tracking-tight text-slate-900 sm:text-5xl uppercase font-bold">
            Uncompromising <br/> Cleanliness.
          </h2>
          <p className="mt-6 text-lg font-medium text-slate-500 max-w-xl mx-auto">
            We operate at the highest standard of residential hygiene. Vetted staff, eco-sterile products, and a zero-tolerance policy for dirt.
          </p>
        </div>
        
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {features.map((feature, idx) => (
            <div 
              key={feature.name}
              className="flex flex-col border border-slate-200 bg-slate-50 p-8 hover:border-sky-500 transition-colors"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex h-12 w-12 items-center justify-center bg-white border border-slate-200 shadow-sm">
                  {feature.icon}
                </div>
                <div className="font-mono text-sm font-bold text-slate-300">
                  0{idx + 1}
                </div>
              </div>
              
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                {feature.name}
              </h3>
              
              <p className="font-display text-xl font-bold text-slate-900 mb-4">
                {feature.summary}
              </p>
              
              <p className="text-sm font-medium text-slate-500 leading-relaxed mt-auto">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

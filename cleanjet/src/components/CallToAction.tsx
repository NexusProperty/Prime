import { Container } from '@/components/Container'

const guarantees = [
  {
    title: 'Absolute Quality Guarantee',
    desc: 'If our clinical standard is not met, notify us within 48 hours. A team will be dispatched immediately to rectify at zero cost.',
    icon: (
      <svg aria-hidden="true" className="h-6 w-6 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Zero Friction Flexibility',
    desc: 'Modify, suspend, or cancel your service schedule with 24 hours notice. No cancellation fees, no contracts.',
    icon: (
      <svg aria-hidden="true" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Dedicated Personnel',
    desc: 'We assign a dedicated professional to your property to ensure absolute consistency and trust across every visit.',
    icon: (
      <svg aria-hidden="true" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

export function CallToAction() {
  return (
    <>
      {/* Why CleanJet — Clinical Standard Section */}
      <section
        id="why-cleanjet"
        aria-labelledby="why-cleanjet-title"
        className="bg-white py-24 sm:py-32 border-b border-slate-200"
      >
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1 border border-slate-200 bg-white text-slate-600 text-xs font-bold uppercase tracking-widest mb-6">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Service Protocol
              </div>
              <h2
                id="why-cleanjet-title"
                className="font-display text-4xl font-bold uppercase tracking-tight text-slate-900 sm:text-5xl"
              >
                Immaculate.
                <br />
                <span className="text-slate-400">By Design.</span>
              </h2>
              <p className="mt-6 text-lg font-medium text-slate-600 border-l-2 border-sky-500 pl-6">
                CleanJet was engineered to replace the friction of traditional residential cleaning. We deploy rigorously vetted professionals armed with hospital-grade, eco-sterile solutions to ensure your environment is flawless.
              </p>
              <div className="mt-10">
                <a 
                  href="#booking" 
                  className="inline-flex h-14 items-center justify-center bg-slate-900 px-8 font-sans text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-slate-800 focus:outline-hidden"
                >
                  Schedule Service
                </a>
              </div>
            </div>

            <div className="space-y-4">
              {guarantees.map((g) => (
                <div
                  key={g.title}
                  className="flex items-start gap-6 bg-slate-50 border border-slate-200 px-6 py-6 transition-colors hover:border-sky-500"
                >
                  <div className="flex h-12 w-12 flex-none items-center justify-center bg-white border border-slate-200 shadow-sm">
                    {g.icon}
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold uppercase tracking-tight text-slate-900">
                      {g.title}
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-600 leading-relaxed">
                      {g.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Final booking CTA - Sterile Brand Execution */}
      <section
        id="booking"
        className="relative overflow-hidden bg-sky-50 py-24 sm:py-32 border-b border-sky-100"
      >
        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center bg-white p-12 sm:p-16 border border-slate-200 shadow-xl relative">
            {/* Promo Banner Corner */}
            <div className="absolute top-0 right-0 bg-sky-500 text-white text-[10px] font-bold uppercase tracking-widest py-1 px-8 rotate-45 translate-x-6 translate-y-4 shadow-sm">
              20% Off Promotion
            </div>

            <div className="flex justify-center mb-6">
              <svg aria-hidden="true" className="h-10 w-10 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-slate-900 sm:text-5xl">
              Initiate <span className="text-sky-500">Service.</span>
            </h2>
            <p className="mt-6 text-lg font-medium text-slate-600 max-w-xl mx-auto">
              Secure your first CleanJet visit today. Satisfaction guaranteed. If it's not perfect, we'll return to make it right.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a 
                href="#pricing" 
                className="inline-flex w-full sm:w-auto h-14 items-center justify-center bg-sky-500 px-10 font-sans text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-sky-600 shadow-sm"
              >
                Confirm Appointment
              </a>
              <a
                href="tel:0800000000"
                className="inline-flex w-full sm:w-auto h-14 items-center justify-center bg-white border-2 border-slate-200 px-10 font-sans text-xs font-bold uppercase tracking-widest text-slate-700 transition-colors hover:border-slate-300"
              >
                Call: 0800 000 000
              </a>
            </div>

            <p className="mt-8 text-xs font-bold uppercase tracking-widest text-slate-400">
              No long-term contracts. Auckland metropolitan area only.
            </p>
          </div>
        </Container>
      </section>
    </>
  )
}

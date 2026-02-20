import { Container } from '@/components/Container'

const commitments = [
  {
    title: 'Free Site Audit',
    desc: 'No-charge property assessment, exact scope definition, and fixed-price written quote within 48 hours.',
    icon: (
      <svg aria-hidden="true" className="h-6 w-6 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
      </svg>
    ),
  },
  {
    title: 'Fixed Pricing, Zero Surprises',
    desc: 'Our quotes are comprehensive. Weekly site reports keep you informed throughout the entire build lifecycle.',
    icon: (
      <svg aria-hidden="true" className="h-6 w-6 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
      </svg>
    ),
  },
  {
    title: '10-Year Structural Guarantee',
    desc: 'Engineered for durability. Built by Licensed Building Practitioners and backed by a 10-year warranty.',
    icon: (
      <svg aria-hidden="true" className="h-6 w-6 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
      </svg>
    ),
  },
]

export function CallToAction() {
  return (
    <>
      {/* Structural Commitments Band */}
      <section
        id="why-akf"
        aria-labelledby="why-akf-title"
        className="bg-slate-950 py-20 sm:py-28 border-t border-slate-900"
      >
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start lg:gap-20">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-0.5 w-12 bg-amber-500" />
                <span className="font-mono text-sm font-bold uppercase tracking-widest text-amber-500">
                  Industrial Grade Trust
                </span>
              </div>
              <h2
                id="why-akf-title"
                className="font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl"
              >
                Why Auckland Builders <br/>
                <span className="text-slate-500">Choose AKF.</span>
              </h2>
              <p className="mt-8 text-lg leading-relaxed text-slate-400 border-l-2 border-slate-800 pl-6">
                We engineered AKF Construction because the industry demanded reliability. No budget blowouts. No abandoned sites. We deliver absolute structural integrity on every project.
              </p>
              <div className="mt-12">
                <a 
                  href="#contact" 
                  className="inline-flex h-14 items-center justify-center border-2 border-amber-500 bg-transparent px-8 font-sans text-sm font-bold uppercase tracking-widest text-amber-500 transition-colors hover:bg-amber-500 hover:text-slate-950 focus:outline-hidden"
                >
                  Initiate Audit
                </a>
              </div>
            </div>

            <div className="space-y-6">
              {commitments.map((c, index) => (
                <div
                  key={c.title}
                  className="group relative flex items-start gap-6 bg-slate-900 px-8 py-6 transition-all hover:bg-slate-800"
                >
                  {/* Heavy Index Number */}
                  <div className="absolute top-6 right-6 opacity-10 font-mono text-6xl font-bold text-white pointer-events-none group-hover:text-amber-500 transition-colors">
                    0{index + 1}
                  </div>
                  
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-slate-950 border border-slate-800 group-hover:border-amber-500 transition-colors">
                    {c.icon}
                  </div>
                  <div className="relative z-10">
                    <p className="font-display text-xl font-bold uppercase tracking-tight text-white">
                      {c.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {c.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Final Concrete CTA */}
      <section
        id="contact"
        className="relative overflow-hidden bg-slate-100 py-24 sm:py-32"
      >
        {/* Concrete Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.15%22/%3E%3C/svg%3E")',
          }}
          aria-hidden="true"
        />

        {/* Structural Diagonal Slash */}
        <div className="absolute top-0 right-0 h-full w-1/3 bg-amber-500 transform skew-x-[-20deg] origin-bottom opacity-10 pointer-events-none" />

        <Container className="relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            {/* Caution Striping Element */}
            <div className="mx-auto mb-10 h-3 w-32" 
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 10px, #0f172a 10px, #0f172a 20px)'
              }}
            />

            <h2 className="font-display text-5xl font-bold uppercase tracking-tight text-slate-900 sm:text-6xl">
              Break ground on <br />
              your next build.
            </h2>
            <p className="mt-6 text-xl text-slate-600 font-medium max-w-2xl mx-auto">
              Our site managers are ready. We provide fixed-price quotes within 48 hours for any Auckland residential project.
            </p>

            <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-x-6">
              <a 
                href="tel:0995198763"
                className="inline-flex h-16 w-full sm:w-auto items-center justify-center bg-slate-900 px-10 font-sans text-base font-bold uppercase tracking-widest text-amber-500 transition-colors hover:bg-slate-800"
              >
                CALL 09-951-8763
              </a>
              <a
                href="mailto:info@akfconstruction.co.nz"
                className="inline-flex h-16 w-full sm:w-auto items-center justify-center border-2 border-slate-900 bg-transparent px-10 font-sans text-base font-bold uppercase tracking-widest text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
              >
                EMAIL PLANS
              </a>
            </div>

            <div className="mt-12 inline-block border border-slate-300 bg-white px-6 py-3 shadow-xs">
              <p className="text-sm font-mono font-bold uppercase tracking-widest text-slate-500">
                Operating Hours: Mon–Fri 8:00am–5:00pm
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

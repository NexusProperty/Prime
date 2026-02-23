import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Fencing & Landscaping Auckland | AKF Construction',
  description:
    'Professional fencing and landscaping in Auckland. Timber fences, retaining walls, garden design, and outdoor transformations by AKF Construction.',
}

export default function FencingLandscapingPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-slate-900 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-l-4 border-amber-500 pl-8">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-amber-500 mb-4">
              AKF Construction — Auckland
            </p>
            <h1 className="font-display text-5xl font-bold text-white uppercase tracking-tight leading-none mb-6">
              Fencing &amp; Landscaping
            </h1>
            <p className="max-w-2xl text-lg text-slate-400 leading-relaxed">
              Create the outdoor space you&apos;ve always wanted. AKF Construction builds boundary
              fences, retaining walls, and complete landscaping solutions across Auckland.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/contact-us"
                className="inline-flex h-12 items-center justify-center bg-amber-500 px-8 font-mono text-xs font-bold uppercase tracking-widest text-slate-900 transition-colors hover:bg-amber-400"
              >
                Get a Free Quote
              </Link>
              <Link
                href="/our-services"
                className="inline-flex h-12 items-center justify-center border border-slate-700 px-8 font-mono text-xs font-bold uppercase tracking-widest text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
              >
                All Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-slate-900 uppercase tracking-tight mb-12">
            What We Do
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Timber Fencing',
                desc: 'Lapped, framed, and paling timber fences built to boundary specifications.',
              },
              {
                title: 'Retaining Walls',
                desc: 'Timber, concrete block, and boulder retaining walls engineered for Auckland slopes.',
              },
              {
                title: 'Concrete Paths & Driveways',
                desc: 'Formed and poured concrete paths, patios, and driveways with neat finishes.',
              },
              {
                title: 'Garden Beds & Planting',
                desc: 'Raised garden beds, topsoil preparation, and planting plans.',
              },
              {
                title: 'Irrigation Systems',
                desc: 'Automated drip and pop-up irrigation systems installed and tested.',
              },
              {
                title: 'Outdoor Lighting',
                desc: 'Low-voltage garden and path lighting to complement your landscape.',
              },
            ].map((item) => (
              <div key={item.title} className="border border-slate-200 p-6">
                <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-slate-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold text-white uppercase tracking-tight mb-4">
            Transform Your Outdoor Space
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Get in touch with AKF Construction for a free on-site assessment and detailed landscaping quote.
          </p>
          <Link
            href="/contact-us"
            className="inline-flex h-12 items-center justify-center bg-amber-500 px-10 font-mono text-xs font-bold uppercase tracking-widest text-slate-900 transition-colors hover:bg-amber-400"
          >
            Get a Free Quote →
          </Link>
        </div>
      </section>
    </main>
  )
}

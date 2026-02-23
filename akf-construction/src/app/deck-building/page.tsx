import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Deck Building Auckland | AKF Construction',
  description:
    'Expert deck building services in Auckland. Timber and composite decks designed and built to last. Get a free quote from AKF Construction.',
}

export default function DeckBuildingPage() {
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
              Deck Building
            </h1>
            <p className="max-w-2xl text-lg text-slate-400 leading-relaxed">
              Custom timber and composite decks designed for Auckland&apos;s climate and your lifestyle.
              From concept to completion, AKF Construction delivers quality outdoor living spaces.
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
            What We Build
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Timber Decks',
                desc: 'Classic hardwood and treated pine decks built to withstand Auckland weather.',
              },
              {
                title: 'Composite Decking',
                desc: 'Low-maintenance composite boards — the look of timber without the upkeep.',
              },
              {
                title: 'Multi-Level Decks',
                desc: 'Complex multi-level designs that maximise your outdoor space.',
              },
              {
                title: 'Pergolas & Shade',
                desc: 'Integrated pergolas and shade structures to complete your outdoor room.',
              },
              {
                title: 'Balustrades & Rails',
                desc: 'Glass, stainless, or timber balustrades installed to code.',
              },
              {
                title: 'Deck Restoration',
                desc: 'Sand, re-oil, and restore your existing deck to like-new condition.',
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
            Ready to Build Your Deck?
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Contact AKF Construction for a free on-site consultation and detailed quote.
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

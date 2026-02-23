import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Home Renovations Auckland | AKF Construction',
  description:
    'Full home renovation services in Auckland. Kitchens, bathrooms, extensions, and whole-home transformations. Licensed builders — AKF Construction.',
}

export default function RenovationsPage() {
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
              Renovations
            </h1>
            <p className="max-w-2xl text-lg text-slate-400 leading-relaxed">
              Transform your home with Auckland&apos;s trusted renovation specialists. From kitchen and
              bathroom upgrades to full-home transformations, AKF Construction delivers on time and
              on budget.
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
            Renovation Services
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Kitchen Renovations',
                desc: 'Full kitchen redesigns including cabinetry, benchtops, tiling, and appliance fit-out.',
              },
              {
                title: 'Bathroom Upgrades',
                desc: 'Modern bathroom renovations from wet-area waterproofing to full tile and fixture installation.',
              },
              {
                title: 'Home Extensions',
                desc: 'Single and double-storey extensions that add living space and home value.',
              },
              {
                title: 'Open-Plan Conversions',
                desc: 'Remove load-bearing walls safely and open up your living areas.',
              },
              {
                title: 'Interior Linings',
                desc: 'GIB stopping, skimming, and painting to a premium finish.',
              },
              {
                title: 'Whole-Home Transformations',
                desc: 'Complete home makeovers coordinated by a single team from start to finish.',
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
            Start Your Renovation
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Call or message AKF Construction for a no-obligation site visit and detailed scope of works.
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

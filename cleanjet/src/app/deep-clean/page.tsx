import { type Metadata } from 'next'
import Link from 'next/link'
import { ContentPageShell } from '@/components/ContentPageShell'

export const metadata: Metadata = {
  title: 'Deep Cleaning Auckland | Full Home Deep Clean',
  description:
    "CleanJet deep cleans Auckland homes from $357 — oven, fridge, skirting boards, ceiling fans, mould treatment. Vetted, insured cleaners. 100% satisfaction guarantee.",
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Deep Cleaning Auckland',
  description:
    "CleanJet's deep cleaning service for Auckland homes. 75-point checklist including oven interior, fridge, skirting boards, ceiling fans, window sills and tracks, and inside cupboards.",
  provider: {
    '@type': 'LocalBusiness',
    name: 'CleanJet',
    url: 'https://cleanjet.co.nz/',
    telephone: '+64-9-215-2900',
    email: 'hello@cleanjet.co.nz',
    legalName: 'Cleanjet NZ Limited',
    taxID: '144-124-286',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '2/41 Smales Road',
      addressLocality: 'East Tamaki',
      addressRegion: 'Auckland',
      postalCode: '2013',
      addressCountry: 'NZ',
    },
  },
  areaServed: { '@type': 'City', name: 'Auckland' },
  offers: [
    {
      '@type': 'Offer',
      name: 'Deep Clean — 2–3 Bedrooms',
      price: '391.00',
      priceCurrency: 'NZD',
      priceSpecification: { '@type': 'PriceSpecification', description: '$391 inc-GST (verified from CleanJet Quote No. 13063)' },
    },
    {
      '@type': 'Offer',
      name: 'Deep Clean — 4 Bedrooms',
      price: '357.00',
      priceCurrency: 'NZD',
      priceSpecification: { '@type': 'PriceSpecification', description: '$357 inc-GST (verified from CleanJet Invoice No. 15)' },
    },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the difference between a regular clean and a deep clean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A regular clean maintains a home in good condition. A deep clean adds inside-appliance cleaning (oven, fridge), skirting boards, ceiling fans, window tracks, inside cupboards, and grout scrubbing — a 75-point vs 45-point checklist.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does a deep clean take in Auckland?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A deep clean of a 1–2 bedroom Auckland home takes 3–5 hours. Larger homes (3–4 beds) may require 5–8 hours. CleanJet allocates full time to complete the 75-point checklist thoroughly.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does a deep clean cost in Auckland?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "CleanJet's deep clean starts at $149 for a 1–2 bedroom property in Auckland. Larger properties are quoted on request. All prices include GST.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can I book a deep clean before starting a regular CleanJet service?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes — and CleanJet recommends it. A deep clean brings your home to a high baseline; regular weekly cleans from $79 maintain the standard from there.",
      },
    },
  ],
}

export default function DeepCleanPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ContentPageShell>
        <article className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Deep Home Cleaning Auckland — Full Property, Top to Bottom
          </h1>
          <p className="mt-6 text-xl text-slate-600">
            CleanJet&apos;s deep clean is a top-to-bottom, 75-point clean for Auckland homes that need extra attention — whether it&apos;s a spring clean, a pre-sale tidy-up, a post-renovation refresh, or a first professional clean of a home that hasn&apos;t been done in a while.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/#booking"
              className="inline-flex h-12 items-center justify-center bg-sky-600 px-6 font-sans text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-sky-500 rounded-full"
            >
              Book a Deep Clean
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-12 items-center justify-center border border-slate-300 bg-white px-6 font-sans text-sm font-bold uppercase tracking-widest text-slate-700 transition-colors hover:bg-slate-50 rounded-full"
            >
              See What&apos;s Included
            </Link>
          </div>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            What Is Included in CleanJet&apos;s Deep Clean?
          </h2>
          <p className="mt-4 text-slate-600">
            CleanJet&apos;s deep clean goes significantly further than a regular maintenance clean. Our trained cleaners work through a 75-point checklist that covers everything in a standard clean, plus all the areas that typically get skipped — inside appliances, window sills, skirting boards, light fittings, and more — leaving your home genuinely clean from top to bottom.
          </p>
          <ul className="mt-6 space-y-2 text-slate-600">
            <li>Everything in a regular clean (vacuuming, mopping, bathrooms, kitchen surfaces)</li>
            <li>Inside oven and fridge cleaned thoroughly</li>
            <li>Window sills and window tracks cleared and wiped</li>
            <li>Skirting boards dusted and wiped along all walls</li>
            <li>Ceiling fans and light fittings dusted</li>
            <li>Inside kitchen and bathroom cupboards wiped down</li>
            <li>All light switches, door handles, and touch points sanitised</li>
            <li>Shower grout and tile scrubbing</li>
          </ul>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            When Should You Book a Deep Clean in Auckland?
          </h2>
          <p className="mt-4 text-slate-600">
            A deep clean is recommended when a home needs more than regular maintenance can provide — or when you&apos;re starting fresh with professional cleaning services.
          </p>
          <ul className="mt-6 space-y-2 text-slate-600">
            <li><strong>First-time professional clean</strong> — getting your home to a high baseline before switching to regular maintenance cleans</li>
            <li><strong>Spring cleaning</strong> — a thorough seasonal refresh covering all the areas that accumulate grime over months</li>
            <li><strong>Pre-sale or pre-rental preparation</strong> — presenting a home at its best before listing or showing to prospective tenants</li>
            <li><strong>Post-renovation or building work</strong> — removing fine dust, paint traces, and debris after construction (see also our Post-Build Clean service)</li>
            <li><strong>After a period of illness</strong> — a thorough sanitisation of surfaces, touch points, and all high-contact areas</li>
            <li><strong>Post-event or pre-event</strong> — preparing your home before guests arrive or cleaning up thoroughly after a gathering</li>
          </ul>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            How Much Does a Deep Clean Cost in Auckland?
          </h2>
          <p className="mt-4 text-slate-600">
            Pricing below is verified from CleanJet&apos;s actual tax invoices (Nov–Dec 2025, GST No. 144-124-286):
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Property Size</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Price inc-GST</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-3 text-sm text-slate-600">2–3 Bedrooms — Full Deep Clean</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">$391</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-slate-600">4 Bedrooms — Full Deep Clean</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">$357</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-slate-600">Single room (incl. wall/ceiling/window treatment)</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">$230</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-slate-600">5+ Bedrooms</td>
                  <td className="px-4 py-3 text-sm text-slate-600">Contact for custom quote</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Optional add-ons: Carpet shampoo $9/m² (min ~$92) | Upholstery $70/sofa | Oven clean standalone $90 | Wall/ceiling spot clean $184 | Wall/ceiling + mould removal $150/room. All prices include GST.
          </p>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="mt-8 space-y-8">
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">What is the difference between a regular clean and a deep clean?</h3>
              <p className="mt-2 text-slate-600">
                A regular clean maintains a home that is already in a good state — covering all rooms, bathrooms, floors, and kitchen surfaces on each visit. A deep clean goes further, adding inside-appliance cleaning (oven, fridge), skirting boards, ceiling fans, window tracks, inside cupboards, and grout scrubbing. CleanJet recommends a deep clean before starting a regular cleaning schedule.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">How long does a deep clean take?</h3>
              <p className="mt-2 text-slate-600">
                A deep clean of a 1–2 bedroom Auckland home typically takes 3–5 hours. Larger homes (3–4 bedrooms) may require 5–8 hours, and 5+ bedroom properties can take a full day. CleanJet allocates the time required to complete the 75-point checklist thoroughly — we don&apos;t rush or cut corners.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">Is a deep clean the same as a spring clean?</h3>
              <p className="mt-2 text-slate-600">
                Yes — CleanJet&apos;s deep clean is the same as what most people call a spring clean. It covers the entire property thoroughly, reaching the areas that accumulate grime between regular cleans. Many Auckland homeowners book a deep clean once or twice a year in addition to a regular cleaning schedule.
              </p>
            </div>
          </div>
        </article>
      </ContentPageShell>
    </>
  )
}

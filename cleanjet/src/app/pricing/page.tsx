import { type Metadata } from 'next'
import Link from 'next/link'
import { ContentPageShell } from '@/components/ContentPageShell'

export const metadata: Metadata = {
  title: 'Home Cleaning Prices Auckland | CleanJet Pricing',
  description:
    'CleanJet Auckland home cleaning prices — from $90 for an oven clean to $391 for a full move-out deep clean. Transparent, GST-inclusive pricing. No hidden fees.',
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'CleanJet',
  legalName: 'Cleanjet NZ Limited',
  description: 'Auckland residential cleaning company offering regular home cleaning, deep cleaning, end of tenancy cleaning, and post-build cleaning.',
  url: 'https://cleanjet.co.nz/',
  telephone: '+64-9-215-2900',
  email: 'hello@cleanjet.co.nz',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2/41 Smales Road',
    addressLocality: 'East Tamaki',
    addressRegion: 'Auckland',
    postalCode: '2013',
    addressCountry: 'NZ',
  },
  areaServed: { '@type': 'City', name: 'Auckland' },
  priceRange: '$79–$391+',
  paymentAccepted: 'Bank transfer, EFTPOS, Credit Card',
  currenciesAccepted: 'NZD',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'CleanJet Cleaning Service Prices',
    itemListElement: [
      { '@type': 'Offer', name: 'Regular Clean — 1–2 Bedrooms (One-off)', price: '99.00', priceCurrency: 'NZD' },
      { '@type': 'Offer', name: 'Regular Clean — 1–2 Bedrooms (Weekly)', price: '79.00', priceCurrency: 'NZD' },
      { '@type': 'Offer', name: 'Regular Clean — 3–4 Bedrooms', price: '149.00', priceCurrency: 'NZD' },
      { '@type': 'Offer', name: 'Regular Clean — 5+ Bedrooms', price: '199.00', priceCurrency: 'NZD' },
      { '@type': 'Offer', name: 'Deep Clean / Move-Out — 2–3 Bedrooms', price: '391.00', priceCurrency: 'NZD' },
      { '@type': 'Offer', name: 'Deep Clean / Move-Out — 4 Bedrooms', price: '357.00', priceCurrency: 'NZD' },
      { '@type': 'Offer', name: 'Oven Clean (standalone)', price: '90.00', priceCurrency: 'NZD' },
      { '@type': 'Offer', name: 'Carpet Shampoo', price: '9.00', priceCurrency: 'NZD', priceSpecification: { '@type': 'PriceSpecification', description: '$9 per m², minimum ~$92' } },
      { '@type': 'Offer', name: 'Upholstery Cleaning (per sofa)', price: '70.00', priceCurrency: 'NZD' },
      { '@type': 'Offer', name: 'Deck or Patio Cleaning (12–15m)', price: '269.00', priceCurrency: 'NZD' },
    ],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does home cleaning cost in Auckland?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "CleanJet's regular maintenance cleans start at $79 per visit (weekly) or $99 one-off for a 1–2 bedroom Auckland home. Deep cleans and move-out cleans range from $357 (4 bed) to $391 (2–3 bed) inc-GST based on actual invoiced jobs. All prices are GST-inclusive.",
      },
    },
    {
      '@type': 'Question',
      name: 'How much does carpet cleaning cost in Auckland?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CleanJet charges $9 per square metre inc-GST for carpet shampoo, with a minimum charge of approximately $92. An average bedroom (15–20 m²) costs approximately $135–$180. Whole-house carpet cleans are quoted on request.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does an oven clean cost in Auckland?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CleanJet charges $90 inc-GST for a standalone oven clean (flat fee). When added to a regular maintenance clean via the website booking, the oven clean add-on is $30.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does end of tenancy cleaning cost in Auckland?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "CleanJet's end of tenancy / move-out cleans cost from $357 (4-bedroom) to $391 (2–3 bedroom) inc-GST, based on actual invoiced jobs. Prices include a 75-point checklist and photo report. Carpet cleaning and other add-ons are extra.",
      },
    },
    {
      '@type': 'Question',
      name: 'What payment methods does CleanJet accept?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CleanJet accepts bank transfer (direct credit to ANZ Bank, Cleanjet NZ Limited, 01-0190-0825213-00), EFTPOS, and credit card.',
      },
    },
  ],
}

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ContentPageShell>
        <article className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Auckland Home Cleaning Prices — Verified, All-Inclusive
          </h1>
          <p className="mt-6 text-xl text-slate-600">
            CleanJet publishes real prices based on actual invoiced jobs — no quote forms, no waiting, no surprise fees. The figures below are taken directly from CleanJet&apos;s own tax invoices and quotes (GST reg. 144-124-286). What you see is what you pay.
          </p>
          <p className="mt-4 text-slate-600">
            <em>Unlike most Auckland cleaning companies, CleanJet does not require you to request a quote for standard services.</em>
          </p>
          <Link
            href="/#booking"
            className="mt-8 inline-flex h-12 items-center justify-center bg-sky-600 px-6 font-sans text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-sky-500 rounded-full"
          >
            Book Now at This Price
          </Link>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            How Much Does a Regular Home Clean Cost in Auckland?
          </h2>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Home Size</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">One-off Price</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Weekly Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-3 text-sm text-slate-600">1–2 Bedrooms</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">$99 NZD inc-GST</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">$79 NZD inc-GST per visit</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-slate-600">3–4 Bedrooms</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">$149 NZD inc-GST</td>
                  <td className="px-4 py-3 text-sm text-slate-600">Contact for weekly rate</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-slate-600">5+ Bedrooms</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">$199 NZD inc-GST</td>
                  <td className="px-4 py-3 text-sm text-slate-600">Contact for weekly rate</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Add-ons: Extra Bathrooms +$20 | Oven Clean (add-on) +$30 | Window Cleaning +$25. Weekly plans billed fortnightly. ~20% saving on weekly vs one-off.
          </p>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            How Much Does a Deep Clean or Move-Out Clean Cost in Auckland?
          </h2>
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
                  <td className="px-4 py-3 text-sm text-slate-600">2–3 Bedrooms — Deep Clean / Move-In / Move-Out</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">$391</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-slate-600">4 Bedrooms — Deep Clean / Move-In / Move-Out</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">$357</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            Additional Services Pricing
          </h2>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Service</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Price inc-GST</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-3 text-sm text-slate-600">Carpet shampoo (per m²)</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">$9 (min ~$92)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-slate-600">Upholstery cleaning (per sofa)</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">$70</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-slate-600">Oven clean (standalone)</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">$90</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-slate-600">Spot clean — walls and ceilings</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">$184 per session</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-slate-600">Wall/ceiling clean + mould removal</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">$150 per room</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-slate-600">Deck or patio cleaning (12–15m)</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">$269</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            How Do I Pay for CleanJet Cleaning Services?
          </h2>
          <p className="mt-4 text-slate-600">
            CleanJet accepts: <strong>Bank transfer</strong> (ANZ Bank, Account: 01-0190-0825213-00, Cleanjet NZ Limited), <strong>EFTPOS</strong>, and <strong>Credit card</strong>. Payment due on completion. Jobs over $1,000 inc-GST require 50% deposit. Cancellations with less than 24 hours&apos; notice may incur 50% service fee.
          </p>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            Pricing Questions Answered
          </h2>
          <div className="mt-8 space-y-8">
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">Are CleanJet&apos;s prices GST-inclusive?</h3>
              <p className="mt-2 text-slate-600">
                Yes. All CleanJet prices on this page are GST-inclusive (GST 144-124-286). No hidden fees, callout charges, or travel costs.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">Why is the oven clean $90 standalone but $30 as a website add-on?</h3>
              <p className="mt-2 text-slate-600">
                The $30 oven clean is an add-on to a regular maintenance clean. The $90 flat fee is the standalone oven clean service — scoped and invoiced separately. When added to a regular clean, the oven is cleaned as part of the overall visit at a lower incremental cost.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">Do prices vary by Auckland suburb?</h3>
              <p className="mt-2 text-slate-600">
                No. CleanJet charges the same prices across all Auckland suburbs — no travel or distance surcharges within the Auckland metropolitan area.
              </p>
            </div>
          </div>
        </article>
      </ContentPageShell>
    </>
  )
}

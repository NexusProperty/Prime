import { type Metadata } from 'next'
import Link from 'next/link'
import { ContentPageShell } from '@/components/ContentPageShell'

export const metadata: Metadata = {
  title: 'Regular Home Cleaning Auckland | From $79',
  description:
    "CleanJet's regular home cleaning service covers all rooms, bathrooms, and kitchen from $79 per visit. Vetted, insured cleaners. No contracts. Book in 60 seconds.",
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Regular Home Cleaning Auckland',
  description:
    "CleanJet's regular home cleaning service in Auckland. 45-point checklist covering all rooms, bathrooms, and kitchen. Background-checked, insured cleaners. Eco-friendly products. No lock-in contracts.",
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
      name: '1–2 Bedroom Regular Clean (Weekly)',
      price: '79.00',
      priceCurrency: 'NZD',
      priceSpecification: { '@type': 'PriceSpecification', description: '$79 per visit, billed fortnightly' },
    },
    {
      '@type': 'Offer',
      name: '1–2 Bedroom Regular Clean (One-off)',
      price: '99.00',
      priceCurrency: 'NZD',
    },
    {
      '@type': 'Offer',
      name: '3–4 Bedroom Regular Clean (One-off)',
      price: '149.00',
      priceCurrency: 'NZD',
    },
    {
      '@type': 'Offer',
      name: '5+ Bedroom Regular Clean (One-off)',
      price: '199.00',
      priceCurrency: 'NZD',
    },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does a regular home clean cost in Auckland?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "CleanJet's regular clean starts at $79 per visit (weekly) or $99 for a one-off for a 1–2 bedroom home. 3–4 bedrooms costs $149 and 5+ bedrooms costs $199 one-off. All prices include GST.",
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to be home when the cleaner arrives?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "No. Leave entry instructions when booking and CleanJet's cleaner will let themselves in, complete the clean, and secure your home on leaving.",
      },
    },
    {
      '@type': 'Question',
      name: 'Will I get the same cleaner every time?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. CleanJet assigns a dedicated professional to your property for regular cleans, ensuring consistency and familiarity with your home on every visit.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can I cancel or reschedule a regular clean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. No lock-in contracts. Cancel, reschedule, or skip any clean with at least 24 hours\' notice — no fees, no hassle.',
      },
    },
    {
      '@type': 'Question',
      name: "What happens if I'm not happy with the clean?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "CleanJet's 100% satisfaction guarantee means if any area doesn't meet our standard, notify us within 48 hours and we'll return to reclean at no cost.",
      },
    },
  ],
}

export default function RegularCleanPage() {
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
            Regular Home Cleaning Auckland — From $79 Per Visit
          </h1>
          <p className="lead mt-6 text-xl text-slate-600">
            A consistent, reliable weekly or fortnightly home clean from CleanJet. Vetted, insured cleaners. Eco-friendly products. A 45-point checklist on every visit. No lock-in contracts — book, skip, or cancel with 24 hours&apos; notice.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/#booking"
              className="inline-flex h-12 items-center justify-center bg-sky-600 px-6 font-sans text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-sky-500 rounded-full"
            >
              Book a Regular Clean
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-12 items-center justify-center border border-slate-300 bg-white px-6 font-sans text-sm font-bold uppercase tracking-widest text-slate-700 transition-colors hover:bg-slate-50 rounded-full"
            >
              See Pricing
            </Link>
          </div>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            What Is Included in CleanJet&apos;s Regular Home Clean?
          </h2>
          <p className="mt-4 text-slate-600">
            CleanJet&apos;s regular clean is a thorough routine service that keeps your Auckland home consistently fresh and hygienic. Our background-checked, fully insured cleaners follow a 45-point checklist on every visit — covering every room, every time, to the same high standard.
          </p>
          <ul className="mt-6 space-y-2 text-slate-600">
            <li>All bedrooms vacuumed and mopped</li>
            <li>Bathrooms scrubbed and sanitised — toilet, sink, shower, and bath</li>
            <li>Kitchen surfaces wiped down and appliance exteriors cleaned</li>
            <li>All floors vacuumed and mopped throughout the home</li>
            <li>Beds made on request</li>
            <li>Rubbish emptied from all rooms</li>
          </ul>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            How Much Does a Regular Clean Cost in Auckland?
          </h2>
          <p className="mt-4 text-slate-600">
            CleanJet is one of the few Auckland cleaning companies that publishes its prices upfront — no quote required, no waiting.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Home Size</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Weekly Price</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">One-off Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-3 text-sm text-slate-600">1–2 Bedrooms</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">$79 per visit</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">$99 per visit</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-slate-600">3–4 Bedrooms</td>
                  <td className="px-4 py-3 text-sm text-slate-600">Contact us</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">$149 per visit</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-slate-600">5+ Bedrooms</td>
                  <td className="px-4 py-3 text-sm text-slate-600">Contact us</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">$199 per visit</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Optional add-ons: Extra Bathrooms +$20 | Oven Clean +$30 | Window Cleaning +$25. All prices include GST. Weekly plans billed fortnightly. No lock-in contracts — cancel anytime with 24 hours&apos; notice.
          </p>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            Why Choose CleanJet for Regular Home Cleaning in Auckland?
          </h2>
          <p className="mt-4 text-slate-600">
            Most Auckland home cleaning companies require you to request a quote, wait 24–48 hours for a response, and commit to a contract. CleanJet is different — book in 60 seconds online, with transparent pricing, no lock-in, and a 100% satisfaction guarantee.
          </p>
          <ul className="mt-6 space-y-2 text-slate-600">
            <li><strong>Transparent pricing</strong> — prices published online. Know the cost before you book.</li>
            <li><strong>Background-checked cleaners</strong> — every cleaner is vetted and carries full public liability insurance</li>
            <li><strong>Eco-friendly products</strong> — hospital-grade, non-toxic, safe for children and pets</li>
            <li><strong>Dedicated cleaner</strong> — the same professional assigned to your home each visit for consistency</li>
            <li><strong>100% satisfaction guarantee</strong> — not happy? We reclean within 48 hours at no cost</li>
            <li><strong>No contracts</strong> — skip, reschedule, or cancel with 24 hours&apos; notice, any time</li>
          </ul>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            Frequently Asked Questions About CleanJet&apos;s Regular Clean
          </h2>
          <div className="mt-8 space-y-8">
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">How often should I get my home cleaned professionally?</h3>
              <p className="mt-2 text-slate-600">
                Most Auckland homeowners opt for a weekly or fortnightly regular clean — weekly if you have children or pets, or a busy household. A fortnightly clean suits smaller homes or those who do light maintenance between visits. CleanJet&apos;s weekly plan saves you ~20% compared to individual one-off bookings.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">Do I need to be home when the cleaner arrives?</h3>
              <p className="mt-2 text-slate-600">
                No. You don&apos;t need to be home. Simply leave entry instructions when you book — a key code, key location, or access code — and CleanJet&apos;s cleaner will let themselves in, complete the clean, and secure your home on leaving.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">Will I get the same cleaner every time?</h3>
              <p className="mt-2 text-slate-600">
                Yes. CleanJet assigns a dedicated professional to your property for regular cleans. This ensures consistency, familiarity with your home&apos;s layout and preferences, and a built-in level of trust across every visit.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">Can I add extra services to my regular clean?</h3>
              <p className="mt-2 text-slate-600">
                Yes. You can add an oven clean (+$30), window cleaning (+$25), or extra bathrooms (+$20) to any regular clean. Simply select add-ons when booking online or let us know when confirming your appointment.
              </p>
            </div>
          </div>
        </article>
      </ContentPageShell>
    </>
  )
}

import { type Metadata } from 'next'
import Link from 'next/link'
import { ContentPageShell } from '@/components/ContentPageShell'

export const metadata: Metadata = {
  title: 'End of Tenancy Cleaning Auckland | Bond Clean',
  description:
    "CleanJet's end of tenancy cleaning in Auckland starts at $249. Bond-back guarantee. Photo report included. Meets all property manager standards. Book now.",
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'End of Tenancy Cleaning Auckland',
  description:
    "CleanJet's end of tenancy cleaning service in Auckland. 75-point checklist, photo report, and bond-back guarantee. Designed to meet property manager and landlord requirements.",
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
      name: 'End of Tenancy Clean — 2–3 Bedrooms',
      price: '391.00',
      priceCurrency: 'NZD',
      priceSpecification: { '@type': 'PriceSpecification', description: '$391 inc-GST for 2–3 bedrooms (verified from CleanJet Quote No. 13063)' },
    },
    {
      '@type': 'Offer',
      name: 'End of Tenancy Clean — 4 Bedrooms',
      price: '357.00',
      priceCurrency: 'NZD',
      priceSpecification: { '@type': 'PriceSpecification', description: '$357 inc-GST for 4-bedroom property (verified from CleanJet Invoice No. 15)' },
    },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is end of tenancy cleaning in New Zealand?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'End of tenancy cleaning is a thorough professional clean of a rental property when a tenant vacates. In NZ, landlords can withhold bond if the property is not returned in the same condition. A professional clean helps tenants receive their full bond back.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does CleanJet offer a bond-back guarantee?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. If your bond is withheld due to any cleaning issue, CleanJet will return to reclean the affected areas at no additional cost — guaranteed.',
      },
    },
    {
      '@type': 'Question',
      name: "Does CleanJet's end of tenancy clean include carpet steam cleaning?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Carpet steam cleaning is available as an add-on. It is one of the most common reasons bonds are withheld in NZ. Contact CleanJet when booking to include it and get a combined price.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does end of tenancy cleaning cost in Auckland?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "CleanJet's end of tenancy / move-out clean costs from $357 (4-bedroom) to $391 (2–3 bedroom) inc-GST based on actual invoiced jobs. Includes a 75-point checklist and photo report. Carpet cleaning and other add-ons are extra. 5+ bedroom properties are quoted on request.",
      },
    },
    {
      '@type': 'Question',
      name: "What if my property manager isn't satisfied with the clean?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "CleanJet's bond-back guarantee means we return to reclean any unsatisfactory areas at no additional cost. Contact within 48 hours of the clean.",
      },
    },
  ],
}

export default function EndOfTenancyPage() {
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
            End of Tenancy Cleaning Auckland — Bond-Back Guarantee
          </h1>
          <p className="mt-6 text-xl text-slate-600">
            CleanJet&apos;s end of tenancy clean is Auckland&apos;s most thorough move-out cleaning service — designed to meet property manager and landlord requirements and get your full bond back. From $249. Photo report included. Book online in 60 seconds.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/#booking"
              className="inline-flex h-12 items-center justify-center bg-sky-600 px-6 font-sans text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-sky-500 rounded-full"
            >
              Book End of Tenancy Clean
            </Link>
            <Link
              href="/#booking"
              className="inline-flex h-12 items-center justify-center border border-slate-300 bg-white px-6 font-sans text-sm font-bold uppercase tracking-widest text-slate-700 transition-colors hover:bg-slate-50 rounded-full"
            >
              Get a Quote
            </Link>
          </div>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            What Is Included in CleanJet&apos;s End of Tenancy Clean?
          </h2>
          <p className="mt-4 text-slate-600">
            CleanJet&apos;s end of tenancy clean is our most comprehensive residential service — a full 75-point checklist covering every room, surface, appliance, and fixture to the standard required by Auckland property managers and landlords. Every clean is documented with a detailed photo report so you have proof of condition at move-out.
          </p>
          <ul className="mt-6 space-y-2 text-slate-600">
            <li>Full deep clean of every room in the property</li>
            <li>Oven, fridge, and dishwasher interior cleaned</li>
            <li>All bathrooms scrubbed and sanitised — including grout and tiles</li>
            <li>Kitchen surfaces, cabinets (inside and out), and sink deep-cleaned</li>
            <li>All windows cleaned inside and window sills and tracks cleared</li>
            <li>Skirting boards, light switches, and door handles wiped down</li>
            <li>Carpet steam clean (available as an add-on)</li>
            <li>Detailed photo report provided for your bond claim</li>
          </ul>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            Does CleanJet Offer a Bond-Back Guarantee?
          </h2>
          <p className="mt-4 text-slate-600">
            Yes. CleanJet&apos;s end of tenancy clean includes an explicit bond-back guarantee. If your landlord or property manager withholds your bond due to cleaning standards, CleanJet will return to reclean the affected areas at no additional cost — guaranteed.
          </p>
          <ul className="mt-6 space-y-2 text-slate-600">
            <li>If bond is withheld due to any cleaning issue, CleanJet returns and recleans at zero cost</li>
            <li>Applies to any area covered in the original 75-point checklist</li>
            <li>Photo report provided as documentation for your bond claim</li>
            <li>Works with property managers, landlords, and Airbnb property owners</li>
          </ul>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            How Much Does an End of Tenancy Clean Cost in Auckland?
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
                  <td className="px-4 py-3 text-sm text-slate-600">2–3 Bedrooms</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">$391</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-slate-600">4 Bedrooms</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">$357</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-slate-600">5+ Bedrooms</td>
                  <td className="px-4 py-3 text-sm text-slate-600">Contact for custom quote</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Optional add-ons: Carpet shampoo $9/m² (min ~$92) | Upholstery $70/sofa | Oven clean standalone $90 | Wall/ceiling spot clean $184 | Wall/ceiling + mould $150/room | Deck/patio $269. Photo report included in all end of tenancy cleans.
          </p>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="mt-8 space-y-8">
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">What is end of tenancy cleaning in New Zealand?</h3>
              <p className="mt-2 text-slate-600">
                End of tenancy cleaning (also called a bond clean or move-out clean) is a thorough, professional clean of a rental property when a tenant is vacating. In New Zealand, landlords can withhold part of a bond if the property is not returned in the same condition as at the start of the tenancy. A professional end of tenancy clean helps ensure tenants receive their full bond back.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">Do I need to be present during the end of tenancy clean?</h3>
              <p className="mt-2 text-slate-600">
                You don&apos;t need to be present during the clean. Many tenants have already vacated by the time the clean takes place. Simply arrange key access with CleanJet and we&apos;ll complete the clean and provide a photo report on the same day.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">Can CleanJet do a last-minute or same-day end of tenancy clean?</h3>
              <p className="mt-2 text-slate-600">
                CleanJet has availability Mon–Sat 8am–6pm. For urgent bookings, call <a href="tel:092152900" className="text-sky-600 hover:underline">(09) 215-2900</a> to check same-day or next-day availability. We recommend booking at least 48 hours in advance where possible to guarantee your preferred date.
              </p>
            </div>
          </div>
        </article>
      </ContentPageShell>
    </>
  )
}

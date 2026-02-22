import { type Metadata } from 'next'
import Link from 'next/link'
import { ContentPageShell } from '@/components/ContentPageShell'

export const metadata: Metadata = {
  title: 'About CleanJet | Auckland\'s Home Cleaning Service',
  description:
    "CleanJet is Auckland's home cleaning service — vetted cleaners, transparent pricing, and 100% satisfaction guarantee. Part of the Prime Group.",
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'CleanJet',
  description: 'CleanJet is an Auckland residential cleaning company offering regular home cleaning, deep cleaning, end of tenancy cleaning, and post-build cleaning with online booking, transparent pricing, and a 100% satisfaction guarantee.',
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
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '18:00',
    },
  ],
  areaServed: { '@type': 'City', name: 'Auckland' },
  parentOrganization: {
    '@type': 'Organization',
    name: 'Prime Group',
    member: [
      { '@type': 'Organization', name: 'Prime Electrical', url: 'https://theprimeelectrical.co.nz/' },
      { '@type': 'Organization', name: 'AKF Construction', url: 'https://www.akfconstruction.co.nz/' },
    ],
  },
}

export default function AboutUsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <ContentPageShell>
        <article className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            About CleanJet — Auckland&apos;s Professional Home Cleaning Service
          </h1>
          <p className="mt-6 text-xl text-slate-600">
            CleanJet is an Auckland residential cleaning company built around one simple idea: booking a quality home cleaner should be as easy as ordering a coffee. Online booking in 60 seconds. Transparent pricing. Background-checked professionals. Eco-friendly products. And a 100% satisfaction guarantee on every clean.
          </p>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            What Is CleanJet and Who Do We Clean For?
          </h2>
          <p className="mt-4 text-slate-600">
            CleanJet is Auckland&apos;s dedicated residential home cleaning service — built for busy Auckland homeowners and families who want a professionally cleaned home without the friction of traditional cleaning arrangements. We specialise exclusively in residential homes across the Auckland metropolitan area, from studio apartments to large family homes.
          </p>
          <ul className="mt-6 space-y-2 text-slate-600">
            <li>Busy Auckland families who want a consistently clean home without the effort</li>
            <li>Renters moving out who need a thorough end of tenancy clean to get their bond back</li>
            <li>Homeowners preparing a property for sale or new tenants</li>
            <li>AKF Construction clients who need a post-build clean after renovation or building work</li>
            <li>Anyone who wants a one-off deep clean, spring clean, or regular maintenance clean</li>
          </ul>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            What Makes CleanJet Different From Other Auckland Cleaning Companies?
          </h2>
          <p className="mt-4 text-slate-600">
            CleanJet was designed from the ground up to solve the three biggest frustrations with traditional home cleaning services in Auckland: unclear pricing, difficult booking processes, and inconsistent quality.
          </p>
          <ul className="mt-6 space-y-2 text-slate-600">
            <li><strong>Transparent pricing</strong> — every price published online. No quote required, no waiting.</li>
            <li><strong>60-second online booking</strong> — pick your home size, add-ons, date, and time. Done.</li>
            <li><strong>Consistent quality</strong> — a dedicated cleaner assigned to your home, a standardised checklist on every visit, and a 100% satisfaction guarantee.</li>
            <li>Background-checked, fully insured cleaners on every job</li>
            <li>Eco-friendly, hospital-grade products — non-toxic, safe for children and pets</li>
            <li>No lock-in contracts — cancel or skip with 24 hours&apos; notice at any time</li>
            <li>Bond-back guarantee on all end of tenancy cleans</li>
            <li>AKF Construction bundle for post-renovation cleaning</li>
          </ul>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            What Is the Prime Group?
          </h2>
          <p className="mt-4 text-slate-600">
            CleanJet is part of the Prime Group — an Auckland-based group of residential property services companies working together to make home ownership and property management easier for Auckland families and businesses.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Company</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">What They Do</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">CleanJet</td>
                  <td className="px-4 py-3 text-sm text-slate-600">Residential home cleaning — regular, deep, end of tenancy, post-build</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">Prime Electrical</td>
                  <td className="px-4 py-3 text-sm text-slate-600">Licensed electricians — electrical services, heat pumps, solar, smart home</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">AKF Construction</td>
                  <td className="px-4 py-3 text-sm text-slate-600">Licensed builders — new builds, renovations, decks, fences, painting</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            What Does CleanJet Guarantee?
          </h2>
          <p className="mt-4 text-slate-600">
            <strong>Great Clean Guarantee</strong> — Not happy with your clean? CleanJet will return and reclean any area that falls short of our standard within 48 hours — at absolutely zero cost. No questions asked. Every time. No exceptions.
          </p>
          <p className="mt-4 text-slate-600">
            The three things CleanJet promises on every visit: (1) A background-checked, insured professional, (2) Eco-friendly, non-toxic products, (3) The same high standard, every time.
          </p>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="mt-8 space-y-8">
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">Is CleanJet a locally owned Auckland business?</h3>
              <p className="mt-2 text-slate-600">
                Yes. CleanJet is an Auckland-based cleaning company and part of the Prime Group, which operates entirely in the Auckland residential property services market. We are not a franchise or a national chain — we are a local company focused exclusively on serving Auckland homeowners.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">Does CleanJet offer commercial cleaning?</h3>
              <p className="mt-2 text-slate-600">
                No. CleanJet specialises in residential home cleaning only. For commercial cleaning enquiries in Auckland, we can refer you to trusted commercial cleaning providers. For electrical or building work, Prime Electrical and AKF Construction are both part of the Prime Group and accept commercial clients.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">What is the Great Clean Guarantee?</h3>
              <p className="mt-2 text-slate-600">
                CleanJet&apos;s Great Clean Guarantee means if any area of your clean doesn&apos;t meet our standard, notify us within 48 hours and a team will return to reclean the affected areas at no cost. No forms, no disputes, no hassle — just a clean home.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">Who do I contact if I have a problem with a clean?</h3>
              <p className="mt-2 text-slate-600">
                Contact CleanJet directly at <a href="mailto:hello@cleanjet.co.nz" className="text-sky-600 hover:underline">hello@cleanjet.co.nz</a> or call <a href="tel:092152900" className="text-sky-600 hover:underline">(09) 215-2900</a>. For any quality concern, report it within 48 hours and CleanJet will resolve it under the Great Clean Guarantee.
              </p>
            </div>
          </div>
        </article>
      </ContentPageShell>
    </>
  )
}

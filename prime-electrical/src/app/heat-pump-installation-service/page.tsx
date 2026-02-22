import { type Metadata } from 'next'
import Link from 'next/link'
import { ContentPageShell } from '@/components/ContentPageShell'
import { Container } from '@/components/Container'
import { CallToAction } from '@/components/CallToAction'

export const metadata: Metadata = {
  title: 'Heat Pump Installation Auckland | Mitsubishi, Daikin | Prime',
  description:
    "Prime Electrical installs heat pumps across Auckland and Hamilton — Mitsubishi, Daikin, Panasonic, Carrier, and Toshiba. 10+ years' experience. Free quote.",
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Heat Pump Installation Auckland',
  description:
    'Prime Electrical installs residential and commercial heat pump systems across Auckland and Hamilton, including Mitsubishi, Daikin, Panasonic, Carrier, and Toshiba brands. Split systems and ducted installations available.',
  provider: {
    '@type': 'LocalBusiness',
    name: 'The Prime Electrical',
    telephone: '09-390-3620',
    url: 'https://theprimeelectrical.co.nz/',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Unit 2, 41 Smales Road',
      addressLocality: 'East Tāmaki',
      addressRegion: 'Auckland',
      postalCode: '2013',
      addressCountry: 'NZ',
    },
  },
  areaServed: [
    { '@type': 'City', name: 'Auckland' },
    { '@type': 'City', name: 'Hamilton' },
  ],
  offers: {
    '@type': 'Offer',
    description: 'Free heat pump consultation and no-obligation quote',
    price: '0',
    priceCurrency: 'NZD',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I choose the right heat pump for my Auckland home?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Key factors include room size, wall insulation, ceiling height, windows, and placement options. Prime Electrical's free consultation assesses all factors and recommends the right unit for your property.",
      },
    },
    {
      '@type': 'Question',
      name: 'How long does heat pump installation take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most residential heat pump installations take half a day to a full working day depending on system type. Prime Electrical provides a clear timeframe during the free consultation.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does a heat pump last?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Quality heat pumps from Mitsubishi, Daikin, or Panasonic typically last 15–20 years with annual servicing. Prime Electrical recommends yearly maintenance to maximise lifespan.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does a heat pump cost to run in Auckland?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A heat pump typically costs $0.20–$0.40 per hour to run in New Zealand. Heat pumps are 3–5x more energy-efficient than standard electric heaters — the most economical heating option available.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I apply for a heat pump subsidy in Auckland?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "EECA's Warmer Kiwi Homes programme offers eligible Auckland homeowners grants of up to 80% of heat pump installation costs. Call Prime Electrical on 09-390-3620 for guidance on eligibility and application.",
      },
    },
    {
      '@type': 'Question',
      name: 'How frequently should I service my heat pump?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Prime Electrical recommends annual heat pump servicing to maintain efficiency, extend lifespan, keep filters clean, and ensure warranty validity. Call 09-390-3620 to arrange a service.',
      },
    },
  ],
}

export default function HeatPumpInstallationServicePage() {
  return (
    <ContentPageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className="relative flex min-h-[50vh] items-center overflow-hidden bg-white pt-24 pb-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <Container className="relative">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Heat Pump Installation Services Auckland & Hamilton
            </h1>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center bg-blue-600 px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-blue-500"
              >
                Free Quote
              </Link>
              <a
                href="tel:0993903620"
                className="inline-flex items-center justify-center border-2 border-slate-900 px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
              >
                Call: 09-390-3620
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Why Choose Prime Electrical for Heat Pump Installation in Auckland?
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Prime Electrical is Auckland and Hamilton&apos;s trusted heat pump installer, with 10+
              years of experience and authorised installer status for Mitsubishi, Daikin, Panasonic,
              Carrier, and Toshiba. We provide free consultations, professional installation, and
              ongoing service support — prioritising your comfort and delivering high-quality
              results for every residential and commercial installation.
            </p>
            <ul className="mt-6 space-y-2 text-slate-600">
              <li>• Authorised installer for all major NZ heat pump brands — Mitsubishi, Daikin, Panasonic, Carrier, Toshiba</li>
              <li>• Free consultation and no-obligation quote for every installation</li>
              <li>• Both split system and ducted heat pump installations across Auckland and Hamilton</li>
              <li>• End-to-end service: consultation, installation, and ongoing servicing</li>
              <li>• 10+ years of heat pump installation experience in Auckland homes and businesses</li>
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              How Easy Is the Heat Pump Installation Process With Prime Electrical?
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Prime Electrical makes heat pump installation straightforward and stress-free — from
              your first enquiry through to installation and after-sales support.
            </p>
            <ol className="mt-6 space-y-4 text-slate-600 list-decimal list-inside">
              <li><strong className="text-slate-900">Contact Us</strong> — Call 09-390-3620 or request a free quote online. Tell us about your property and heating needs.</li>
              <li><strong className="text-slate-900">Site Inspection</strong> — A Prime Electrical technician visits your property to assess the space, recommend the right system, and confirm installation requirements.</li>
              <li><strong className="text-slate-900">Heat Pump Installation</strong> — Our licensed electricians complete a professional, clean installation that meets all New Zealand electrical and safety standards.</li>
              <li><strong className="text-slate-900">Ongoing Servicing</strong> — Prime Electrical offers continued servicing and maintenance to keep your heat pump running efficiently year-round.</li>
            </ol>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Which Heat Pump Brands Does Prime Electrical Install?
            </h2>
            <p className="mt-4 text-slate-600">
              Prime Electrical is an authorised installer for Mitsubishi, Daikin, Panasonic, Carrier, and Toshiba.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {['Mitsubishi', 'Daikin', 'Panasonic', 'Carrier', 'Toshiba'].map((brand) => (
                <div key={brand} className="rounded-lg border border-slate-200 bg-white p-4">
                  <h3 className="font-display font-semibold text-slate-900">{brand}</h3>
                  <p className="mt-1 text-sm text-slate-600">{brand} Heat Pump Installation Experts</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Frequently Asked Questions — Heat Pump Installation Auckland
            </h2>
            <ul className="mt-8 space-y-8">
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  How do I choose the right heat pump for my Auckland home?
                </h3>
                <p className="mt-2 text-slate-600">
                  When selecting a heat pump, key factors include room size, wall insulation, ceiling
                  height, number of windows, local weather conditions, and where the unit can be
                  placed. It is essential to size the equipment correctly for efficient heating and
                  cooling. Prime Electrical&apos;s free consultation assesses all of these factors and
                  recommends the right unit for your property.
                </p>
              </li>
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  How long does heat pump installation take with Prime Electrical?
                </h3>
                <p className="mt-2 text-slate-600">
                  Most residential heat pump installations take half a day to a full working day,
                  depending on the system type and installation complexity. Split system installs are
                  typically faster, while ducted systems require more time. Prime Electrical provides
                  a clear timeframe during your free consultation before any work begins.
                </p>
              </li>
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  How long does a heat pump last?
                </h3>
                <p className="mt-2 text-slate-600">
                  A quality heat pump from brands like Mitsubishi, Daikin, or Panasonic typically
                  lasts 15 to 20 years with regular servicing. Prime Electrical recommends annual
                  maintenance to maximise your heat pump&apos;s lifespan and maintain efficient
                  performance throughout Auckland&apos;s seasonal temperature changes.
                </p>
              </li>
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  How much does a heat pump cost to run in Auckland?
                </h3>
                <p className="mt-2 text-slate-600">
                  A heat pump typically costs $0.20–$0.40 per hour to operate in New Zealand,
                  depending on unit size and your electricity tariff. Heat pumps are 3–5 times more
                  energy-efficient than standard electric heaters, making them the most economical
                  heating and cooling option for Auckland homes and businesses.
                </p>
              </li>
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  How do I apply for a heat pump subsidy in Auckland?
                </h3>
                <p className="mt-2 text-slate-600">
                  EECA&apos;s Warmer Kiwi Homes programme offers eligible Auckland homeowners grants
                  of up to 80% of the cost of heat pump installation. Eligibility typically
                  depends on your home&apos;s insulation, income level, and location. Prime
                  Electrical can guide you through the eligibility criteria and application process
                  — call 09-390-3620 for details.
                </p>
              </li>
            </ul>
          </div>
        </Container>
      </section>

      <CallToAction />
    </ContentPageShell>
  )
}

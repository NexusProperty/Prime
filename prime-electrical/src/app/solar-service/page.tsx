import { type Metadata } from 'next'
import Link from 'next/link'
import { ContentPageShell } from '@/components/ContentPageShell'
import { Container } from '@/components/Container'
import { CallToAction } from '@/components/CallToAction'

export const metadata: Metadata = {
  title: 'Solar Panel Installation Auckland | Prime Electrical',
  description:
    'Prime Electrical installs solar panels across Auckland & Hamilton. 25-year warranties. Clean Energy Council-accredited. 10+ years experience. Free quote.',
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Solar Panel Installation Auckland',
  description:
    'Prime Electrical installs residential solar panel systems across Auckland and Hamilton with 25-year performance warranties. Clean Energy Council-accredited. Full-service including paperwork, installation, and grid connection.',
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
    description: 'Free solar consultation and no-obligation quote',
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
      name: 'Why should I opt for solar panel installation in Auckland?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Solar panels reduce your reliance on grid electricity, lower monthly power bills, allow you to sell excess energy back to the grid, increase your home\'s value, and reduce your household\'s carbon footprint.',
      },
    },
    {
      '@type': 'Question',
      name: 'How effective is solar panel installation in Auckland?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Solar panels in Auckland generate 3.5–5 kWh per panel per day. A standard 5kW system can offset 50–80% of an average NZ household\'s electricity consumption, delivering strong savings over a 25+ year lifespan.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are solar panels effective during Auckland winters?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Solar panels generate electricity from daylight, not direct sunlight, so they continue to produce power in Auckland\'s mild winters. Output is lower than summer but still meaningful, with any shortfall covered by your grid connection.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do solar panels work at night?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Solar panels do not generate electricity at night. Prime Electrical can install battery storage systems that store excess daytime energy for use at night or during overcast periods.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does solar panel installation take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A residential solar installation by Prime Electrical typically takes one to two days. Prime Electrical manages all paperwork, building consent, installation, and grid connection.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does solar panel installation affect my Auckland property value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Solar panels add capital value to your home, increase its energy efficiency rating, and make it more attractive to Auckland buyers. Solar-equipped homes typically command a higher resale price and sell faster.',
      },
    },
  ],
}

export default function SolarServicePage() {
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
              Solar Panel Installation Services Auckland & Hamilton
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
              Why Choose Prime Electrical for Solar Panel Installation in Auckland?
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Prime Electrical has been installing solar panel systems across Auckland and Hamilton
              for over 10 years. As a Clean Energy Council-accredited installer, we manage the
              entire process — from paperwork and site assessment through to professional
              installation and grid connection — so you can start saving on power bills without any
              hassle.
            </p>
            <ul className="mt-6 space-y-2 text-slate-600">
              <li>• Clean Energy Council-accredited solar panel installers</li>
              <li>• 25-year performance warranty on all solar panels installed</li>
              <li>• Full-service: paperwork, installation, grid connection, and after-sales support</li>
              <li>• 10+ years of solar installation experience across Auckland and Hamilton</li>
              <li>• Honest approach — no lock-in maintenance contracts or upsells</li>
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Why Are Solar Panels Worth Installing in Auckland?
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Auckland&apos;s abundance of sunshine hours makes it one of New Zealand&apos;s best
              locations for solar energy. A properly installed solar panel system can reduce or
              even eliminate your monthly power bill — and any excess energy your panels generate
              can be stored in batteries or fed back to the grid.
            </p>
            <ul className="mt-6 space-y-2 text-slate-600">
              <li>• Save significantly on monthly power bills with self-generated electricity</li>
              <li>• Excess solar power connects to the grid — you can earn credits for energy you don&apos;t use</li>
              <li>• Solar systems are durable, low-maintenance, and built to last 25+ years</li>
              <li>• Adds measurable capital value to your Auckland property</li>
              <li>• Reduces your household&apos;s carbon footprint and dependence on fossil-fuel-generated electricity</li>
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Frequently Asked Questions — Solar Panel Installation Auckland
            </h2>
            <ul className="mt-8 space-y-8">
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  Why should I opt for solar panel installation in Auckland?
                </h3>
                <p className="mt-2 text-slate-600">
                  By generating electricity through solar panels, you reduce your reliance on
                  purchased power from the grid. Any excess energy generated can be sold back to your
                  energy company or stored in a battery system. Solar panels significantly lower
                  household electricity bills, reduce greenhouse gas emissions, and increase your
                  Auckland home&apos;s energy efficiency and resale value.
                </p>
              </li>
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  How effective is solar panel installation in Auckland?
                </h3>
                <p className="mt-2 text-slate-600">
                  Solar panels in Auckland typically generate 3.5–5 kWh of electricity per panel per
                  day, depending on panel orientation and shading. A standard 5kW system can offset
                  50–80% of an average New Zealand household&apos;s electricity consumption,
                  delivering meaningful savings year-round and a strong return on investment over
                  the system&apos;s 25+ year lifespan.
                </p>
              </li>
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  Are solar panels effective during Auckland winters?
                </h3>
                <p className="mt-2 text-slate-600">
                  Yes. Solar panels generate electricity from daylight — not direct sunlight alone —
                  so they continue to produce power throughout Auckland&apos;s mild winters. While
                  winter output is lower than in summer due to shorter days and lower sun angles,
                  panels still generate meaningful electricity, and any shortfall is covered by your
                  grid connection.
                </p>
              </li>
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  Do solar panels work at night?
                </h3>
                <p className="mt-2 text-slate-600">
                  Solar panels do not generate electricity at night. However, Prime Electrical can
                  install battery storage systems alongside your solar panels that store excess
                  energy generated during the day. This stored power can then be used at night or
                  during overcast periods, reducing your reliance on grid electricity around the
                  clock.
                </p>
              </li>
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  How long does solar panel installation take?
                </h3>
                <p className="mt-2 text-slate-600">
                  A residential solar panel installation by Prime Electrical typically takes one to
                  two days, depending on the size of the system and the complexity of your roof.
                  Prime Electrical manages the entire process — including any required paperwork,
                  building consent, and grid connection — so you can start generating solar power as
                  quickly as possible.
                </p>
              </li>
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  How does solar panel installation affect my Auckland property?
                </h3>
                <p className="mt-2 text-slate-600">
                  Solar panels add measurable capital value to your home. A properly installed
                  system increases your property&apos;s energy efficiency rating, which is
                  increasingly valued by Auckland home buyers. Studies consistently show that
                  solar-equipped homes command a higher resale price and sell faster than
                  comparable properties without solar.
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

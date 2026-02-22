import { type Metadata } from 'next'
import Link from 'next/link'
import { ContentPageShell } from '@/components/ContentPageShell'
import { Container } from '@/components/Container'
import { CallToAction } from '@/components/CallToAction'

export const metadata: Metadata = {
  title: 'Electrician Auckland | Residential & Commercial | Prime',
  description:
    'Prime Electrical — licensed Auckland electricians for residential & commercial repairs, rewiring, and 24/7 emergency callouts. Free quote.',
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Electrical Services Auckland',
  description:
    'Prime Electrical provides residential and commercial electrical services across Auckland including repairs, rewiring, electrical installation, design, and 24/7 emergency response.',
  provider: {
    '@type': 'LocalBusiness',
    name: 'The Prime Electrical',
    telephone: '09-390-3620',
    email: 'sales@theprimeelectrical.co.nz',
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
  areaServed: { '@type': 'City', name: 'Auckland' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Electrical Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Residential Electrical Services' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Commercial Electrical Services' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Electrical Rewiring' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Electrical Installation' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '24/7 Emergency Electrical Response' } },
    ],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I find a reliable electrician near me in Auckland?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Prime Electrical serves all Auckland suburbs. Call 09-390-3620 or fill in the online quote form — a licensed electrician will respond within 12–72 hours.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Prime Electrical handle both residential and commercial electrical work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Prime Electrical provides electrical services for both residential homeowners and commercial businesses across Auckland, including repairs, full installations, rewiring, and electrical design.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I do if I have an electrical emergency in Auckland?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Call Prime Electrical immediately on 09-390-3620. We provide 24/7 emergency electrical response across Auckland. Turn off the affected circuit if safe, then call us.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Prime Electrical offer free electrical quotes in Auckland?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Prime Electrical offers free estimates for all electrical services with responses within 12–72 hours. Call 09-390-3620 or request a quote online.',
      },
    },
    {
      '@type': 'Question',
      name: 'What areas in Auckland does Prime Electrical service?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Prime Electrical services Manukau, Eastern Bays, North Shore, Franklin, Waikato, Auckland Central, Rodney, and West Auckland for electrical services.',
      },
    },
  ],
}

export default function ElectricalServicesPage() {
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
              Looking for the Best Electrician in Auckland?
            </h1>
            <h2 className="mt-4 text-xl font-semibold text-slate-700">
              Prime Electrical — Trusted Auckland Electricians Since 2011
            </h2>
            <ul className="mt-6 space-y-2 text-slate-600">
              <li>• More than 10 years of experience across Auckland and Hamilton</li>
              <li>• Highly qualified, licensed, and dependable electricians</li>
              <li>• 100% workmanship guaranteed on every job</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="tel:0993903620"
                className="inline-flex items-center justify-center bg-blue-600 px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-blue-500"
              >
                Call: 09-390-3620
              </a>
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center border-2 border-slate-900 px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
              >
                Free Quote
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              What Electrical Services Does Prime Electrical Offer in Auckland?
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Prime Electrical is Auckland&apos;s trusted local electrician, providing honest,
              fair-priced residential and commercial electrical services across East Auckland,
              South Auckland, and the wider region. We offer 24/7 emergency response, and our licensed
              team is available for everything from small electrical repairs to full rewiring and
              commercial fit-outs.
            </p>
            <ul className="mt-6 space-y-2 text-slate-600">
              <li>• Residential and commercial electrical services across all Auckland suburbs</li>
              <li>• Transparent, honest pricing — no hidden fees or unexpected extras</li>
              <li>• 24/7 emergency electrical response at a reasonable, fair price</li>
              <li>• Licensed, trained, and certified electricians on every job</li>
              <li>• 10+ years of experience, 5,000+ satisfied customers, 1,000+ projects completed</li>
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              What Types of Electrical Work Does Prime Electrical Handle?
            </h2>
            <ul className="mt-6 space-y-4 text-slate-600">
              <li>
                <strong className="text-slate-900">Residential Electrical Services</strong> —
                repairs, installations, and upgrades for Auckland homes
              </li>
              <li>
                <strong className="text-slate-900">Maintenance Services</strong> — scheduled
                electrical maintenance for residential and commercial properties
              </li>
              <li>
                <strong className="text-slate-900">Commercial Electrical Services</strong> — full
                commercial installations, design, and maintenance
              </li>
              <li>
                <strong className="text-slate-900">Electrical Rewiring</strong> — safe, licensed
                rewiring for older homes and commercial buildings
              </li>
              <li>
                <strong className="text-slate-900">Indoor and Outdoor Lighting</strong> — LED
                upgrades, security lighting, and feature lighting
              </li>
              <li>
                <strong className="text-slate-900">24x7 Emergency Response</strong> — rapid callout
                for urgent electrical faults across Auckland
              </li>
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Frequently Asked Questions — Electrical Services Auckland
            </h2>
            <ul className="mt-8 space-y-8">
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  How do I find a reliable electrician near me in Auckland?
                </h3>
                <p className="mt-2 text-slate-600">
                  Prime Electrical serves all Auckland suburbs including East Auckland, South
                  Auckland, Manukau, North Shore, West Auckland, Franklin, and Auckland Central. Call
                  09-390-3620 or fill in the online quote form, and a licensed Prime Electrical
                  electrician will be in touch within 12–72 hours to discuss your job.
                </p>
              </li>
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  Does Prime Electrical handle both residential and commercial electrical work?
                </h3>
                <p className="mt-2 text-slate-600">
                  Yes. Prime Electrical provides electrical services for both residential homeowners
                  and commercial businesses across Auckland. This includes general repairs, full
                  installations, rewiring, electrical design, and maintenance for properties of all
                  sizes — from a single home to a large commercial building.
                </p>
              </li>
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  What should I do if I have an electrical emergency in Auckland?
                </h3>
                <p className="mt-2 text-slate-600">
                  Call Prime Electrical immediately on 09-390-3620. We provide 24/7 emergency
                  electrical response across Auckland. Do not attempt to fix electrical faults
                  yourself — contact a licensed electrician. Turn off the affected circuit at your
                  switchboard if it is safe to do so, then call us.
                </p>
              </li>
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  Does Prime Electrical offer free electrical quotes in Auckland?
                </h3>
                <p className="mt-2 text-slate-600">
                  Yes. Prime Electrical offers free estimates for all electrical services, including
                  general electrical work, heat pump installation, solar panel systems, and smart
                  home automation. Estimates are provided within 12–72 hours of enquiry. Call
                  09-390-3620 or request a quote online.
                </p>
              </li>
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  What areas in Auckland does Prime Electrical service?
                </h3>
                <p className="mt-2 text-slate-600">
                  Prime Electrical services all Auckland regions including Manukau & Eastern Bays,
                  North Shore, Franklin, Auckland Central, Rodney, and West Auckland. We also service
                  Hamilton for heat pump, solar, and selected electrical projects.
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

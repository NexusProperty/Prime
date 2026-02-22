import { type Metadata } from 'next'
import Link from 'next/link'
import { ContentPageShell } from '@/components/ContentPageShell'
import { Container } from '@/components/Container'
import { LeadCaptureForm } from '@/components/ai'

export const metadata: Metadata = {
  title: 'Contact Prime Electrical | Free Quote — Auckland',
  description:
    'Contact Prime Electrical in East Tāmaki, Auckland. Call 09-390-3620 or request a free quote online for electrical, heat pump, solar, and smart home services.',
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'The Prime Electrical',
  legalName: 'Prime Electrical Limited',
  url: 'https://theprimeelectrical.co.nz/',
  telephone: '09-390-3620',
  email: 'sales@theprimeelectrical.co.nz',
  foundingDate: '2011',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Unit 2, 41 Smales Road',
    addressLocality: 'East Tāmaki',
    addressRegion: 'Auckland',
    postalCode: '2013',
    addressCountry: 'NZ',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:30',
      closes: '17:00',
    },
  ],
  sameAs: ['https://maps.app.goo.gl/bZcBYu3yVhhXWJb1A'],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I get a free quote from Prime Electrical?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Call 09-390-3620, email sales@theprimeelectrical.co.nz, or fill in the free estimate form on the website. Prime Electrical responds within 12–72 hours with a free, no-obligation quote.',
      },
    },
    {
      '@type': 'Question',
      name: "What are Prime Electrical's business hours in Auckland?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Prime Electrical operates Monday to Friday, 08:30 AM to 5:00 PM. For urgent electrical faults outside business hours, call 09-390-3620 — 24/7 emergency response is available.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is Prime Electrical located in Auckland?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Prime Electrical is based at Unit 2, 41 Smales Road, East Tāmaki, Auckland 2013, servicing all Auckland suburbs and Hamilton for selected services.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Prime Electrical offer 24/7 emergency electrical services?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Prime Electrical provides 24/7 emergency electrical response across Auckland. Call 09-390-3620 any time for urgent electrical faults including power outages, tripped circuits, and safety hazards.',
      },
    },
  ],
}

export default function ContactUsPage() {
  return (
    <ContentPageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className="relative flex min-h-[40vh] items-center overflow-hidden bg-white pt-24 pb-16">
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
              Contact Prime Electrical — Get a Free Electrical Quote in Auckland
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Prime Electrical is Auckland&apos;s trusted licensed electrician, based in East Tāmaki.
              Whether you need a residential electrical repair, heat pump installation, solar panel
              system, smart home setup, or have an urgent electrical fault — we make it simple to get
              in touch and get a clear, honest quote at no cost.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-16 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                Reach us directly
              </h2>
              <ul className="mt-6 space-y-4 text-slate-600">
                <li>
                  <strong className="text-slate-900">Address:</strong> Unit 2, 41 Smales Road, East
                  Tāmaki, Auckland 2013
                </li>
                <li>
                  <strong className="text-slate-900">Phone:</strong>{' '}
                  <a href="tel:0993903620" className="text-blue-600 hover:text-blue-500">
                    09-390-3620
                  </a>
                </li>
                <li>
                  <strong className="text-slate-900">Email:</strong>{' '}
                  <a
                    href="mailto:sales@theprimeelectrical.co.nz"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    sales@theprimeelectrical.co.nz
                  </a>
                </li>
                <li>
                  <strong className="text-slate-900">Hours:</strong> Mon–Fri 08:30 AM – 05:00 PM
                </li>
                <li>
                  <strong className="text-slate-900">Emergency:</strong> 24/7 — call 09-390-3620 for
                  urgent electrical faults
                </li>
              </ul>
              <div className="mt-8">
                <Link
                  href="https://maps.app.goo.gl/bZcBYu3yVhhXWJb1A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-500 font-medium"
                >
                  View on Google Maps →
                </Link>
              </div>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                Request a Free Electrical Quote
              </h2>
              <p className="mt-4 text-slate-600">
                Call or email us now — we&apos;d love to hear from you! Estimates are provided within
                12–72 hours.
              </p>
              <div className="mt-8">
                <LeadCaptureForm brand="prime" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Common Questions About Contacting Prime Electrical
            </h2>
            <ul className="mt-8 space-y-8">
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  How do I get a free quote from Prime Electrical?
                </h3>
                <p className="mt-2 text-slate-600">
                  Call 09-390-3620, email sales@theprimeelectrical.co.nz, or fill in the free estimate
                  form on this page. Prime Electrical provides free quotes for all services —
                  electrical work, heat pump installation, solar panels, and smart home automation —
                  with a response within 12–72 hours. No obligation and no hidden fees.
                </p>
              </li>
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  What are Prime Electrical&apos;s business hours in Auckland?
                </h3>
                <p className="mt-2 text-slate-600">
                  Prime Electrical operates Monday to Friday, 08:30 AM to 5:00 PM. We are closed on
                  weekends. For urgent electrical faults outside business hours, call 09-390-3620 —
                  Prime Electrical provides 24/7 emergency electrical response across Auckland.
                </p>
              </li>
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  Where is Prime Electrical located in Auckland?
                </h3>
                <p className="mt-2 text-slate-600">
                  Prime Electrical is based at Unit 2, 41 Smales Road, East Tāmaki, Auckland 2013. We
                  service all Auckland suburbs including East Auckland, South Auckland, Auckland
                  Central, North Shore, West Auckland, Franklin, and Rodney — as well as Hamilton for
                  selected services.
                </p>
              </li>
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  Does Prime Electrical offer 24/7 emergency electrical services?
                </h3>
                <p className="mt-2 text-slate-600">
                  Yes. Prime Electrical provides 24/7 emergency electrical response across Auckland.
                  If you have an urgent electrical fault — including power outages, tripped circuits,
                  or safety hazards — call 09-390-3620 at any time and our team will attend promptly.
                </p>
              </li>
            </ul>
          </div>
        </Container>
      </section>
    </ContentPageShell>
  )
}

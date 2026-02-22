import { type Metadata } from 'next'
import { ContentPageShell } from '@/components/ContentPageShell'
import { LeadCaptureForm } from '@/components/ai'

export const metadata: Metadata = {
  title: 'Contact AKF Construction | Get a Free Quote — Auckland',
  description:
    'Contact AKF Construction in East Tamaki, Auckland. Call 09-951-8763, email us, or fill in our online form to get a free quote for your residential or commercial build.',
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'AKF Construction',
  url: 'https://www.akfconstruction.co.nz/',
  telephone: '09-951-8763',
  email: 'info@akfconstruction.co.nz',
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
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '17:00',
    },
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '09-951-8763',
    contactType: 'customer service',
    email: 'info@akfconstruction.co.nz',
    availableLanguage: 'English',
    hoursAvailable: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '17:00',
    },
  },
}

const contactFaqs = [
  {
    question: 'How do I get a quote from AKF Construction?',
    answer:
      'Call us on 09-951-8763, email Info@akfconstruction.co.nz, or fill in the contact form on this page. We respond promptly, discuss your project requirements, and provide a clear, transparent quote — with no obligation and no hidden costs.',
  },
  {
    question: "What are AKF Construction's business hours?",
    answer:
      'AKF Construction operates Monday to Friday, 8:00am to 5:00pm. We are closed on Saturdays and Sundays. For urgent project enquiries outside of business hours, send an email to Info@akfconstruction.co.nz and we will follow up on the next business day.',
  },
  {
    question: 'Where is AKF Construction located?',
    answer:
      'AKF Construction is based at 2/41 Smales Road, East Tamaki, Auckland 2013. We service residential and commercial clients across the wider Auckland region, including Manukau, Flat Bush, Botany, Howick, Pakuranga, and Central Auckland.',
  },
  {
    question: 'How quickly does AKF Construction respond to quote requests?',
    answer:
      'AKF Construction aims to respond to all quote requests within one business day. For faster response, call us directly on 09-951-8763 during business hours (Monday–Friday, 8:00am–5:00pm).',
  },
]

export default function ContactUsPage() {
  return (
    <ContentPageShell jsonLd={localBusinessSchema}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 flex items-center gap-4">
          <div className="h-0.5 w-12 bg-amber-500" />
          <span className="font-mono text-sm font-bold uppercase tracking-widest text-slate-500">
            Get in Touch
          </span>
        </div>

        <h1 className="font-display text-4xl font-bold text-slate-900 sm:text-5xl">
          Contact AKF Construction — Get a Free Quote Today
        </h1>

        <p className="mt-8 text-lg leading-relaxed text-slate-600">
          AKF Construction is Auckland&apos;s trusted building team, based in East
          Tamaki. Whether you are planning a new home build, a deck, a
          renovation, or any other residential or commercial construction
          project, we make it easy to get in touch and get a clear, transparent
          quote with no hidden costs.
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              Reach us directly
            </h2>
            <div className="mt-6 space-y-4 text-slate-600">
              <p>
                <strong className="text-slate-900">Address:</strong>
                <br />
                2/41 Smales Road, East Tamaki, Auckland 2013
              </p>
              <p>
                <strong className="text-slate-900">Phone:</strong>{' '}
                <a
                  href="tel:0995198763"
                  className="font-semibold text-amber-600 hover:text-amber-700"
                >
                  09-951-8763
                </a>
              </p>
              <p>
                <strong className="text-slate-900">Email:</strong>{' '}
                <a
                  href="mailto:Info@akfconstruction.co.nz"
                  className="font-semibold text-amber-600 hover:text-amber-700"
                >
                  Info@akfconstruction.co.nz
                </a>
              </p>
              <p>
                <strong className="text-slate-900">Hours:</strong> Mon–Fri
                8:00am–5:00pm
              </p>
            </div>

            <a
              href="https://maps.google.com/?q=2/41+Smales+Road+East+Tamaki+Auckland+2013"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700"
            >
              View on Google Maps →
            </a>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              Request a Free Quote from AKF Construction
            </h2>
            <p className="mt-2 text-slate-600">
              Fill in the form below and we&apos;ll get back to you within one business
              day.
            </p>
            <div className="mt-6">
              <LeadCaptureForm brand="akf" />
            </div>
          </div>
        </div>

        <section className="mt-20">
          <h2 className="font-display text-2xl font-semibold text-slate-900">
            Common Questions About Contacting AKF Construction
          </h2>
          <ul className="mt-8 space-y-8">
            {contactFaqs.map((faq) => (
              <li key={faq.question}>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  {faq.question}
                </h3>
                <p className="mt-2 text-slate-600 leading-relaxed">{faq.answer}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ContentPageShell>
  )
}

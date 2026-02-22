import { type Metadata } from 'next'
import { ContentPageShell } from '@/components/ContentPageShell'
import { Container } from '@/components/Container'
import { CallToAction } from '@/components/CallToAction'

export const metadata: Metadata = {
  title: 'About Prime Electrical | Auckland Electricians Since 2011',
  description:
    "Prime Electrical is Auckland's trusted electrician since 2011 — 10+ years' experience, 5,000+ happy customers, and 1,000+ projects. Residential & commercial.",
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'The Prime Electrical',
  legalName: 'Prime Electrical Limited',
  url: 'https://theprimeelectrical.co.nz/',
  description:
    'Prime Electrical Limited is an Auckland-based licensed electrical company established in 2011, specialising in residential and commercial electrical services, heat pump installation, solar panel systems, and smart home automation.',
  foundingDate: '2011',
  telephone: '09-390-3620',
  email: 'sales@theprimeelectrical.co.nz',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Unit 2, 41 Smales Road',
    addressLocality: 'East Tāmaki',
    addressRegion: 'Auckland',
    postalCode: '2013',
    addressCountry: 'NZ',
  },
  sameAs: ['https://maps.app.goo.gl/bZcBYu3yVhhXWJb1A'],
}

export default function AboutUsPage() {
  return (
    <ContentPageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
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
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px w-12 bg-blue-600" />
              <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
                Since 2011
              </span>
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              About Prime Electrical — Auckland&apos;s Licensed Electricians Since 2011
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Registered Electricians — For all kinds of electrical, lighting & automation work.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              What Is Prime Electrical Limited?
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Prime Electrical Limited is a licensed Auckland electrical company, established in 2011,
              specialising in residential and commercial electrical services, heat pump installation,
              solar panel systems, and smart home automation. Based in East Tāmaki, we have
              completed 1,000+ projects and served 5,000+ happy customers across Auckland and
              Hamilton over more than a decade of operation.
            </p>
            <ul className="mt-6 space-y-2 text-slate-600">
              <li>• Licensed and registered electrical company operating since 2011</li>
              <li>• 10+ years of residential and commercial electrical experience</li>
              <li>• 5,000+ satisfied customers across Auckland and Hamilton</li>
              <li>• Specialisms: electrical services, heat pump installation, solar panels, and smart home automation</li>
              <li>• Free estimates available for all services — response within 12–72 hours</li>
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Why Should You Call Prime Electrical in Auckland?
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Prime Electrical Limited is your single source for a complete range of high-quality
              electrical services in Auckland, including design/build, engineering, installation,
              and maintenance — all delivered by licensed professionals at fair, honest prices.
            </p>
            <ul className="mt-6 space-y-4 text-slate-600">
              <li>
                <strong className="text-slate-900">Best Price Guarantee</strong> — we strive to
                offer competitive, honest pricing across all our services. If you have a competing
                quote, call us — we will do our best to match or beat it.
              </li>
              <li>
                <strong className="text-slate-900">Free Estimates</strong> — Prime Electrical
                offers free estimates for all services including electrical work, heat pump
                installation, solar panel systems, and smart home automation. No obligation, no
                surprise fees.
              </li>
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              What Values Does Prime Electrical Operate By?
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Customer satisfaction is the foundation of everything Prime Electrical does. Every job
              — from a small repair to a full electrical installation — is delivered with the same
              commitment to quality, reliability, and care.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <h3 className="font-display font-semibold text-slate-900">Reliability</h3>
                <p className="mt-2 text-sm text-slate-600">
                  We only hire trained, experienced, and skilled professionals who deliver what they promise.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <h3 className="font-display font-semibold text-slate-900">Customer Satisfaction</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Your satisfaction is our priority — we don&apos;t consider a job finished until you&apos;re happy with the result.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <h3 className="font-display font-semibold text-slate-900">Quick Service</h3>
                <p className="mt-2 text-sm text-slate-600">
                  We provide prompt, efficient service across all jobs — respecting your time and minimising disruption.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Frequently Asked Questions — About Prime Electrical
            </h2>
            <ul className="mt-8 space-y-8">
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  How long has Prime Electrical been operating in Auckland?
                </h3>
                <p className="mt-2 text-slate-600">
                  Prime Electrical has been operating as a licensed electrician in Auckland since
                  2011 — more than 10 years of residential and commercial electrical experience
                  across the Auckland region and Hamilton. We have completed 1,000+ projects and
                  served 5,000+ happy customers in that time.
                </p>
              </li>
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  Is Prime Electrical a certified and licensed electrical company?
                </h3>
                <p className="mt-2 text-slate-600">
                  Yes. Prime Electrical Limited is a licensed and registered electrical company in
                  New Zealand. All electricians are qualified, trained, and certified to carry out
                  residential and commercial electrical work to the highest safety and workmanship
                  standards. We are also Clean Energy Council-accredited for solar panel installations.
                </p>
              </li>
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  What services does Prime Electrical specialise in?
                </h3>
                <p className="mt-2 text-slate-600">
                  Prime Electrical specialises in four core services: electrical services (residential
                  and commercial), heat pump installation (Mitsubishi, Daikin, Panasonic, Carrier,
                  Toshiba), solar panel installation (25-year warranties, Clean Energy
                  Council-accredited), and smart home automation. We also offer 24/7 emergency
                  electrical response.
                </p>
              </li>
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  Does Prime Electrical offer free estimates?
                </h3>
                <p className="mt-2 text-slate-600">
                  Yes. Prime Electrical offers free estimates for all services — electrical work,
                  heat pump installation, solar panels, and smart home automation. Estimates are
                  provided within 12–72 hours of enquiry. Call 09-390-3620 or fill in the online
                  quote form to get started.
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

import { type Metadata } from 'next'
import Link from 'next/link'
import { ContentPageShell } from '@/components/ContentPageShell'

export const metadata: Metadata = {
  title: 'About AKF Construction | Auckland Licensed Builders',
  description:
    "AKF Construction is Auckland's trusted building company — a licensed team specialising in residential and commercial construction, renovations, decks, fences, and landscaping. Learn our story.",
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AKF Construction',
  url: 'https://www.akfconstruction.co.nz/',
  description:
    'AKF Construction is an Auckland-based construction company specialising in residential and commercial building services including new builds, renovations, deck and fence construction, painting, and landscaping.',
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
}

const servicesPreview = [
  { name: 'Deck Construction', tagline: "Auckland's trusted team for deck building", href: '/our-services#deck' },
  { name: 'Fence Construction', tagline: 'Professional fencing services across Auckland suburbs', href: '/our-services#fence' },
  { name: 'Painting Services', tagline: 'Professional painting services across Auckland homes', href: '/our-services#painting' },
  { name: 'New Build Construction', tagline: 'Expert new home builders in Auckland', href: '/our-services#new-build' },
  { name: 'Home Renovation', tagline: 'Transforming Auckland homes with expert renovations', href: '/our-services#renovation' },
  { name: 'Landscape Work', tagline: 'Transforming outdoor spaces with expert landscaping', href: '/our-services#landscape' },
]

export default function AboutUsPage() {
  return (
    <ContentPageShell jsonLd={organizationSchema}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 flex items-center gap-4">
          <div className="h-0.5 w-12 bg-amber-500" />
          <span className="font-mono text-sm font-bold uppercase tracking-widest text-slate-500">
            Our Story
          </span>
        </div>

        <h1 className="font-display text-4xl font-bold text-slate-900 sm:text-5xl">
          About AKF Construction — Auckland&apos;s Trusted Licensed Builders
        </h1>

        <p className="mt-8 text-lg leading-relaxed text-slate-600">
          AKF Construction is an Auckland-based construction company with years
          of industry experience delivering high-quality residential and
          commercial building projects. Based in East Tamaki, our licensed team
          specialises in new builds, renovations, deck and fence construction,
          painting, and landscaping — built on skilled craftsmanship and honest
          communication.
        </p>

        <div className="mt-10">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            What sets AKF Construction apart:
          </h2>
          <ul className="mt-4 space-y-3 text-slate-600">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              Licensed and experienced building professionals based in East Tamaki, Auckland
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              Full-service capability: new builds, renovations, decks, fences, painting, and landscaping
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              Every project managed end-to-end — one team from planning to final handover
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              Clear communication at every stage — you always know where your project stands
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              Genuine care for quality: we treat every job as if it were our own home
            </li>
          </ul>
        </div>

        <p className="mt-8 text-slate-600 italic">
          AKF Construction is a licensed building company operating under New
          Zealand building standards, with a track record of residential and
          commercial projects across the Auckland region.
        </p>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold text-slate-900">
            What Does AKF Construction Believe In?
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            From the beginning, AKF Construction&apos;s mission has been to combine
            skilled craftsmanship with genuine care — delivering construction
            solutions that stand the test of time. We take the time to understand
            each client&apos;s needs, aspirations, and the unique character of their
            project before a single nail is driven.
          </p>
          <ul className="mt-6 space-y-2 text-slate-600">
            <li className="flex items-start gap-3">
              <span className="text-amber-500 font-bold">•</span>
              We listen first — your vision drives every decision we make
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500 font-bold">•</span>
              We are transparent about costs, timelines, and any challenges along the way
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500 font-bold">•</span>
              We bring the same precision and professionalism to a backyard deck as to a full commercial build
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500 font-bold">•</span>
              We believe strong relationships are built the same way strong structures are — with trust, honesty, and attention to detail
            </li>
          </ul>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold text-slate-900">
            Who Is the AKF Construction Team?
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            AKF Construction&apos;s team is made up of highly trained, experienced
            building professionals who take pride in the quality of their work.
            Every team member understands that great construction requires more
            than technical skill — it requires communication, reliability, and a
            commitment to the client&apos;s outcome.
          </p>
          <ul className="mt-6 space-y-2 text-slate-600">
            <li className="flex items-start gap-3">
              <span className="text-amber-500 font-bold">•</span>
              Keep clients informed at every stage of the build
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500 font-bold">•</span>
              Complete all work on time and within the agreed budget
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500 font-bold">•</span>
              Uphold the highest standards of workmanship regardless of project size
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500 font-bold">•</span>
              Clean up thoroughly and leave every site in order at the end of each working day
            </li>
          </ul>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold text-slate-900">
            What Areas of Auckland Does AKF Construction Service?
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            AKF Construction is proudly based in East Tamaki, Auckland, and
            services the wider Auckland community across residential and
            commercial projects. Our team works throughout the Auckland region —
            from the city centre to suburban areas across South, East, and
            Central Auckland.
          </p>
          <ul className="mt-6 space-y-2 text-slate-600">
            <li className="flex items-start gap-3">
              <span className="text-amber-500 font-bold">•</span>
              East Tamaki, Flat Bush, Botany, and Howick
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500 font-bold">•</span>
              Manukau, Papakura, and surrounding South Auckland suburbs
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500 font-bold">•</span>
              Central and wider Auckland for commercial projects
            </li>
          </ul>
          <p className="mt-6 text-slate-600 leading-relaxed">
            No matter the size or complexity of your project, AKF Construction
            is ready to deliver a result you will be proud of.
          </p>
        </section>

        <section className="mt-20">
          <h2 className="font-display text-2xl font-semibold text-slate-900">
            What Services Does AKF Construction Offer?
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servicesPreview.map((service) => (
              <Link
                key={service.name}
                href={service.href}
                className="group rounded-xl border border-slate-200 bg-white p-6 transition-colors hover:border-amber-500/50 hover:bg-slate-50"
              >
                <h3 className="font-display font-semibold text-slate-900 group-hover:text-amber-700">
                  {service.name}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{service.tagline}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-amber-600 group-hover:text-amber-700">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-xl bg-slate-900 p-8 text-white">
          <h2 className="font-display text-2xl font-semibold">
            Get in Touch with AKF Construction
          </h2>
          <div className="mt-6 space-y-2 text-slate-300">
            <p>
              <strong className="text-white">Address:</strong> 2/41 Smales Road,
              East Tamaki, Auckland 2013
            </p>
            <p>
              <strong className="text-white">Phone:</strong>{' '}
              <a href="tel:0995198763" className="text-amber-400 hover:text-amber-300">
                09-951-8763
              </a>
            </p>
            <p>
              <strong className="text-white">Email:</strong>{' '}
              <a
                href="mailto:Info@akfconstruction.co.nz"
                className="text-amber-400 hover:text-amber-300"
              >
                Info@akfconstruction.co.nz
              </a>
            </p>
          </div>
          <Link
            href="/contact-us"
            className="mt-6 inline-flex h-12 items-center justify-center bg-amber-500 px-6 font-sans text-sm font-bold uppercase tracking-widest text-slate-900 transition-colors hover:bg-amber-400"
          >
            Request a Free Quote
          </Link>
        </section>
      </div>
    </ContentPageShell>
  )
}

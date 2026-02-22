import { type Metadata } from 'next'
import Link from 'next/link'
import { ContentPageShell } from '@/components/ContentPageShell'

export const metadata: Metadata = {
  title: 'Construction Services Auckland | AKF Construction',
  description:
    'AKF Construction offers deck building, fence construction, home renovations, new builds, painting, and landscaping in Auckland. Licensed team. Get a free quote today.',
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'AKF Construction Services',
  description:
    'Construction services offered by AKF Construction in Auckland, New Zealand',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'Service',
        name: 'Deck Construction',
        description:
          'Professional deck building services in Auckland for residential properties. Custom deck design and construction using quality materials.',
        provider: {
          '@type': 'LocalBusiness',
          name: 'AKF Construction',
          telephone: '09-951-8763',
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
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'Service',
        name: 'Fence Construction',
        description:
          'Professional fence building services across Auckland for residential and commercial properties.',
        provider: { '@type': 'LocalBusiness', name: 'AKF Construction' },
        areaServed: { '@type': 'City', name: 'Auckland' },
      },
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'Service',
        name: 'Painting Services',
        description:
          'Professional painting services for residential and commercial properties across Auckland.',
        provider: { '@type': 'LocalBusiness', name: 'AKF Construction' },
        areaServed: { '@type': 'City', name: 'Auckland' },
      },
    },
    {
      '@type': 'ListItem',
      position: 4,
      item: {
        '@type': 'Service',
        name: 'New Build Construction',
        description:
          'New home and commercial building construction across Auckland. End-to-end project management from planning to handover.',
        provider: { '@type': 'LocalBusiness', name: 'AKF Construction' },
        areaServed: { '@type': 'City', name: 'Auckland' },
      },
    },
    {
      '@type': 'ListItem',
      position: 5,
      item: {
        '@type': 'Service',
        name: 'Home Renovation',
        description:
          'Residential and commercial renovation services across Auckland including kitchen, bathroom, and full home renovations.',
        provider: { '@type': 'LocalBusiness', name: 'AKF Construction' },
        areaServed: { '@type': 'City', name: 'Auckland' },
      },
    },
    {
      '@type': 'ListItem',
      position: 6,
      item: {
        '@type': 'Service',
        name: 'Landscape Work',
        description:
          'Professional landscaping services across Auckland including garden design, hardscaping, decks, and outdoor area creation.',
        provider: { '@type': 'LocalBusiness', name: 'AKF Construction' },
        areaServed: { '@type': 'City', name: 'Auckland' },
      },
    },
  ],
}

const services = [
  {
    id: 'deck',
    title: 'Deck Construction',
    question: 'Need a Deck Builder in Auckland?',
    intro:
      'AKF Construction builds custom decks for Auckland homeowners — from simple backyard platforms to large outdoor entertaining areas. We use quality materials and proven construction techniques to design and build a deck that suits your lifestyle, budget, and property layout, with expert project management from concept to completion.',
    bullets: [
      'Custom deck design tailored to your home and outdoor space',
      'High-quality timber and composite material options',
      'Full project management from planning and consenting to final build',
      'Completion on time and to the highest standards of workmanship',
      'Residential decks of all sizes — from compact backyard platforms to large entertainment decks',
    ],
  },
  {
    id: 'fence',
    title: 'Fence Construction',
    question: 'Looking for a Fence Builder in Auckland?',
    intro:
      'AKF Construction specialises in professional fence construction across Auckland for residential and commercial properties. Whether you need a timber boundary fence for privacy and security or a custom-designed solution, our skilled team delivers strong, lasting results using quality materials and proven techniques — managed professionally from planning through to installation.',
    bullets: [
      'Timber fences, boundary fences, and custom-designed solutions',
      'Privacy fencing and security fencing for residential and commercial properties',
      'Expert project management covering planning, materials, and installation',
      'Fencing built to last using high-quality materials and proven techniques',
      'Residential and commercial fence projects across the Auckland region',
    ],
  },
  {
    id: 'painting',
    title: 'Painting Services',
    question: 'Need Professional Painters in Auckland?',
    intro:
      'AKF Construction provides professional painting services for residential and commercial properties across Auckland. Whether you are refreshing a single room, repainting your entire home, or upgrading a commercial space, our experienced painters deliver a flawless, high-quality finish using premium paints and professional techniques — on time and to the highest standard.',
    bullets: [
      'Interior and exterior painting for homes and commercial properties',
      'Premium paint products and professional finishing techniques',
      'Full project management ensuring minimal disruption to your property',
      'Residential repaints, new build painting, and commercial painting projects',
      'Thorough preparation, clean application, and tidy completion on every job',
    ],
  },
  {
    id: 'new-build',
    title: 'New Build Construction',
    question: 'Building a New Home in Auckland?',
    intro:
      'AKF Construction specialises in new home builds across Auckland — delivering high-quality residential and commercial new build projects tailored to your needs, style, and budget. Our experienced team guides you from initial planning and design through to project completion, combining expert craftsmanship, quality materials, and strong project management to keep every build on time and on budget.',
    bullets: [
      'Full new home builds for residential clients across Auckland',
      'Commercial new build projects for offices, retail, and other commercial spaces',
      'End-to-end project management from planning, consenting, and design through to handover',
      'Quality materials and expert craftsmanship throughout every stage of the build',
      'Clear communication and transparent pricing from start to finish',
    ],
  },
  {
    id: 'renovation',
    title: 'Home Renovation',
    question: 'Planning a Home Renovation in Auckland?',
    intro:
      'AKF Construction handles home and commercial renovation projects across Auckland — from full home makeovers to kitchen upgrades, bathroom renovations, and office fit-outs. Our team manages every detail with precision, from structural changes through to finishing touches, delivering renovation results that enhance your property\'s functionality, value, and appearance.',
    bullets: [
      'Full home renovations, kitchen upgrades, bathroom renovations, and room transformations',
      'Office and commercial fit-outs for businesses across Auckland',
      'Structural changes, layout modifications, and high-quality finishing work',
      'Complete project management from design and planning through to final completion',
      'Reliable timelines and transparent budgeting — no surprises mid-project',
    ],
  },
  {
    id: 'landscape',
    title: 'Landscape Work',
    question: 'Need Auckland Landscaping Services?',
    intro:
      'AKF Construction delivers professional landscaping services across Auckland, transforming outdoor spaces into areas that are both functional and beautiful. From garden design and planting to hardscaping features like decks, patios, and retaining walls, our experienced team works closely with you to create an outdoor space that suits your lifestyle, property, and budget.',
    bullets: [
      'Garden design, planting, and lawn establishment',
      'Hardscaping: decks, patios, pathways, retaining walls, and outdoor entertaining areas',
      'Full project management from design and planning through to completion',
      'New outdoor area creation or upgrades to existing landscapes',
      'Residential and commercial landscaping across Auckland',
    ],
  },
]

export default function OurServicesPage() {
  return (
    <ContentPageShell jsonLd={serviceSchema}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 flex items-center gap-4">
          <div className="h-0.5 w-12 bg-amber-500" />
          <span className="font-mono text-sm font-bold uppercase tracking-widest text-slate-500">
            Our Capabilities
          </span>
        </div>

        <h1 className="font-display text-4xl font-bold text-slate-900 sm:text-5xl">
          Construction Services in Auckland | AKF Construction
        </h1>

        <p className="mt-8 text-lg leading-relaxed text-slate-600">
          AKF Construction delivers a full range of residential and commercial
          construction services across Auckland. Our experienced, licensed team
          handles everything from new home builds and renovations to deck and
          fence construction, painting, and landscaping — all managed end-to-end
          with expert project management and a commitment to quality
          craftsmanship.
        </p>

        <div className="mt-10">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            Why Auckland clients choose AKF Construction:
          </h2>
          <ul className="mt-4 space-y-3 text-slate-600">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              Licensed and experienced builders covering residential and commercial projects
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              Full-service: new builds, decks, fences, painting, renovations, and landscaping
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              Complete project management — one team from planning through to final handover
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              Transparent pricing and reliable timelines on every job
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              Serving homeowners and businesses across Auckland from our East Tamaki base
            </li>
          </ul>
        </div>

        <div className="mt-20 space-y-20">
          {services.map((service) => (
            <section
              key={service.id}
              id={service.id}
              className="scroll-mt-24 border-b border-slate-200 pb-20 last:border-0 last:pb-0"
            >
              <h2 className="font-display text-2xl font-semibold text-slate-900">
                {service.title}
              </h2>
              <h3 className="mt-4 text-lg font-medium text-amber-700">
                {service.question}
              </h3>
              <p className="mt-4 text-slate-600 leading-relaxed">
                {service.intro}
              </p>
              <p className="mt-4 font-display text-sm font-semibold text-slate-900">
                What our {service.title.toLowerCase()} service includes:
              </p>
              <ul className="mt-3 space-y-2 text-slate-600">
                {service.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="mt-20 rounded-xl bg-slate-900 p-8 text-white">
          <h2 className="font-display text-2xl font-semibold">
            Why Choose AKF Construction for Your Auckland Build?
          </h2>
          <p className="mt-4 text-slate-300 leading-relaxed">
            AKF Construction is Auckland&apos;s trusted partner for construction done
            right — delivering quality results across residential and commercial
            projects of all sizes.
          </p>
          <ul className="mt-6 space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-amber-400 font-bold">•</span>
              <strong className="text-white">Customised Construction Solutions</strong> — every project designed and built to your specific needs, not a one-size-fits-all approach
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 font-bold">•</span>
              <strong className="text-white">Licensed & Experienced Builders</strong> — a professional team with years of industry experience across Auckland
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 font-bold">•</span>
              <strong className="text-white">Timely Project Completion</strong> — strong project management ensures your build stays on schedule and within budget
            </li>
          </ul>
          <Link
            href="/contact-us"
            className="mt-8 inline-flex h-12 items-center justify-center bg-amber-500 px-6 font-sans text-sm font-bold uppercase tracking-widest text-slate-900 transition-colors hover:bg-amber-400"
          >
            Get a Free Quote
          </Link>
        </section>
      </div>
    </ContentPageShell>
  )
}

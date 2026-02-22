import { type Metadata } from 'next'
import Link from 'next/link'
import { ContentPageShell } from '@/components/ContentPageShell'

export const metadata: Metadata = {
  title: 'Post-Build Cleaning Auckland | After Renovation',
  description:
    'CleanJet post-build cleaning Auckland — dust removal, paint clean-up, full scrub. Official AKF Construction cleaning partner. Bundle discount available.',
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Post-Build Cleaning Auckland',
  description:
    'CleanJet provides specialist post-build and post-renovation cleaning across Auckland — construction dust removal, paint splash clean-up, window cleaning, and full property scrub-down. Official cleaning partner of AKF Construction with bundle discount available.',
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
  offers: {
    '@type': 'Offer',
    description: 'Custom scope and pricing — contact CleanJet for a free quote',
    price: '0',
    priceCurrency: 'NZD',
    priceSpecification: {
      '@type': 'PriceSpecification',
      description: 'Custom quoted based on property size and renovation scope. Bundle discount for AKF Construction clients.',
    },
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is post-build cleaning and why do I need it?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Post-build cleaning removes construction dust, paint splashes, adhesive residue, and debris after renovation or building work is completed. It ensures your Auckland home is safe, hygienic, and ready to live in after the builders leave.',
      },
    },
    {
      '@type': 'Question',
      name: 'What types of renovation projects does CleanJet handle post-build cleaning for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CleanJet handles post-build cleans following deck construction, fence installation, kitchen and bathroom renovations, full home renovations, new builds, extensions, and cosmetic renovation work in Auckland.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I get the AKF Construction bundle discount?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mention your AKF Construction project when booking CleanJet online, or ask your AKF project manager to coordinate the clean directly. The bundle discount applies automatically for confirmed AKF projects.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does CleanJet work with builders and project managers directly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. CleanJet coordinates directly with builders, project managers, and developers. As the official cleaning partner of AKF Construction, we work within construction timelines and handover processes.',
      },
    },
  ],
}

export default function PostBuildCleanPage() {
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
            Post-Build Cleaning Auckland — After Renovation Specialists
          </h1>
          <p className="mt-6 text-xl text-slate-600">
            CleanJet removes the mess left by building and renovation work across Auckland — construction dust, paint splashes, adhesive residue, and debris — leaving your property clean, safe, and ready to live in. AKF Construction clients receive a bundle discount when booking CleanJet for post-build cleaning.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="mailto:hello@cleanjet.co.nz"
              className="inline-flex h-12 items-center justify-center bg-sky-600 px-6 font-sans text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-sky-500 rounded-full"
            >
              Get a Post-Build Quote
            </a>
            <Link
              href="https://www.akfconstruction.co.nz/"
              className="inline-flex h-12 items-center justify-center border border-slate-300 bg-white px-6 font-sans text-sm font-bold uppercase tracking-widest text-slate-700 transition-colors hover:bg-slate-50 rounded-full"
            >
              Learn About the AKF Bundle
            </Link>
          </div>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            What Does a Post-Build Clean Include?
          </h2>
          <p className="mt-4 text-slate-600">
            Post-build cleaning is a specialist service that goes far beyond standard residential cleaning. Construction and renovation work leaves behind fine dust that settles on every surface, paint splashes, adhesive residue, debris, and packaging waste. CleanJet&apos;s post-build team is equipped and experienced to handle all of it — leaving your newly renovated Auckland home ready for move-in.
          </p>
          <ul className="mt-6 space-y-2 text-slate-600">
            <li>Heavy construction dust removal from all surfaces, ceilings, and fixtures</li>
            <li>Paint splash and adhesive clean-up on floors, windows, and fittings</li>
            <li>Full interior window and frame clean — removing dust, silicone smears, and stickers</li>
            <li>Hard floor scrubbing and polish — removing plaster, grout, and building debris</li>
            <li>Kitchen and bathroom deep clean — including inside cupboards if newly installed</li>
            <li>Removal of packaging, wrapping, and leftover building materials</li>
            <li>Custom scope based on the size and type of renovation</li>
          </ul>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            What Is the AKF Construction + CleanJet Bundle?
          </h2>
          <p className="mt-4 text-slate-600">
            CleanJet is the official post-build cleaning partner of AKF Construction — Auckland&apos;s trusted builders for decks, fences, renovations, and new builds. When you hire AKF Construction for your building or renovation project, you can bundle in CleanJet&apos;s post-build cleaning service and save.
          </p>
          <ul className="mt-6 space-y-2 text-slate-600">
            <li><strong>Discounted post-build cleaning</strong> — AKF Construction clients receive a bundle price when booking CleanJet alongside their build</li>
            <li><strong>Seamlessly coordinated</strong> — CleanJet schedules the clean to begin as soon as AKF Construction completes the work</li>
            <li><strong>One point of contact</strong> — as part of the Prime Group, CleanJet and AKF Construction coordinate directly</li>
            <li><strong>End-to-end renovation experience</strong> — AKF builds it, CleanJet cleans it, you move in</li>
          </ul>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            How Much Does a Post-Build Clean Cost in Auckland?
          </h2>
          <p className="mt-4 text-slate-600">
            Post-build cleaning is custom-scoped and priced based on the size of the property, the type of renovation work completed, and the level of dust and debris involved. CleanJet provides free, no-obligation quotes for all post-build cleaning projects.
          </p>
          <ol className="mt-6 list-decimal list-inside space-y-2 text-slate-600">
            <li>Contact CleanJet at <a href="mailto:hello@cleanjet.co.nz" className="text-sky-600 hover:underline">hello@cleanjet.co.nz</a> or call <a href="tel:092152900" className="text-sky-600 hover:underline">(09) 215-2900</a></li>
            <li>Describe the renovation work completed and the property size</li>
            <li>Receive a custom quote within 24 hours</li>
          </ol>
          <p className="mt-4 text-slate-600">
            <em>AKF Construction clients: mention your project when contacting for a discounted bundle quote.</em>
          </p>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="mt-8 space-y-8">
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">What is post-build cleaning and why do I need it?</h3>
              <p className="mt-2 text-slate-600">
                Post-build cleaning is a specialist clean carried out after construction or renovation work is completed. Building work generates fine dust that spreads through an entire property, plus paint splashes, adhesive residue, and debris that standard cleaning products cannot easily remove. A professional post-build clean ensures your home is safe, hygienic, and ready to live in after the builders leave.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">How long does a post-build clean take?</h3>
              <p className="mt-2 text-slate-600">
                Post-build cleaning timescales vary significantly depending on the scope of the renovation, the size of the property, and the amount of dust and debris involved. A single-room renovation might take 2–4 hours; a full-property renovation could require a full day or more. CleanJet assesses each project individually and provides a time estimate with your quote.
              </p>
            </div>
          </div>
        </article>
      </ContentPageShell>
    </>
  )
}

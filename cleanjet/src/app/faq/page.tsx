import { type Metadata } from 'next'
import { ContentPageShell } from '@/components/ContentPageShell'

export const metadata: Metadata = {
  title: 'CleanJet FAQ | Home Cleaning Auckland Questions Answered',
  description:
    "Answers to the most common questions about CleanJet's Auckland home cleaning service — pricing, booking, products, guarantees, and more.",
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does home cleaning cost in Auckland?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "CleanJet's regular maintenance cleans start at $79 per visit (weekly) or $99 one-off for a 1–2 bedroom Auckland home. Deep cleans and move-out/end of tenancy cleans are from $357 (4-bed) to $391 (2–3 bed) inc-GST. All prices include GST (GST 144-124-286).",
      },
    },
    {
      '@type': 'Question',
      name: 'Are CleanJet cleaners police-checked and insured?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Every CleanJet cleaner undergoes rigorous background screening including criminal record checks. Cleanjet NZ Limited carries $5,000,000 public liability insurance on all cleans.',
      },
    },
    {
      '@type': 'Question',
      name: 'What cleaning products does CleanJet use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CleanJet uses hospital-grade, eco-certified cleaning products that are non-toxic and free from harsh chemicals. They are safe for children, pets, and the environment while delivering a thorough, hygienic clean.',
      },
    },
    {
      '@type': 'Question',
      name: "What is CleanJet's Great Clean Guarantee?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "If any area of your clean doesn't meet CleanJet's standard, notify us within 48 hours and a team will return to reclean the affected areas at zero cost. No questions asked. Every time.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can I cancel or reschedule a clean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Cancel, reschedule, or skip any clean with at least 24 hours\' notice — no fees, no hassle. CleanJet has no lock-in contracts and no cancellation fees.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does CleanJet do end of tenancy cleaning in Auckland?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. CleanJet\'s end of tenancy cleaning starts at $249 for a 1–2 bedroom property and includes a 75-point checklist, photo report, and bond-back guarantee.',
      },
    },
    {
      '@type': 'Question',
      name: 'What areas of Auckland does CleanJet service?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CleanJet services the Auckland metropolitan area including Central Auckland, East Auckland, South Auckland, West Auckland, and North Auckland / North Shore. The service does not extend outside Auckland.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer weekly home cleaning in Auckland?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. CleanJet's weekly plan saves approximately 20% compared to one-off pricing and includes a dedicated assigned cleaner. Plans are billed fortnightly with no lock-in contract.",
      },
    },
  ],
}

const faqSections = [
  {
    title: 'Booking and Pricing Questions',
    items: [
      { q: 'How much does home cleaning cost in Auckland?', a: "CleanJet's pricing is transparent and published online. Regular maintenance cleans start at $79 per visit (weekly) or $99 one-off for a 1–2 bedroom home; $149 for 3–4 beds; $199 for 5+. Deep cleans and end of tenancy/move-out cleans are priced from $357 (4 bed) to $391 (2–3 bed) inc-GST, based on actual invoiced jobs. Add-ons: extra bathrooms (+$20), oven clean add-on (+$30), windows (+$25). All prices include GST (GST 144-124-286)." },
      { q: 'How do I book a clean with CleanJet?', a: 'Book online at cleanjet.co.nz in under 60 seconds. Choose your home size, frequency (one-off or weekly), add any extras, pick your date and time, and confirm. No phone call required. CleanJet is available Mon–Sat from 8am across Auckland.' },
      { q: 'Do you offer weekly or fortnightly cleaning?', a: 'Yes. CleanJet offers weekly recurring cleans at a discounted rate (~20% cheaper than one-off). Fortnightly plans are available — contact CleanJet at hello@cleanjet.co.nz to arrange a fortnightly schedule. Weekly plans are billed fortnightly.' },
      { q: 'Are there any hidden fees?', a: 'No. CleanJet publishes all prices upfront. The price you see is the price you pay — GST included. There are no callout fees, travel charges, or surprise additions. Optional add-ons (oven, windows, extra bathrooms) are shown clearly before you confirm.' },
      { q: 'Can I get a one-off clean without committing to a regular service?', a: 'Absolutely. CleanJet has no lock-in contracts. Book a single one-off regular clean, deep clean, end of tenancy clean, or post-build clean with no obligation to book again. There are no cancellation fees and no minimum term.' },
    ],
  },
  {
    title: 'Products and Equipment Questions',
    items: [
      { q: 'Do you bring your own cleaning products?', a: "Yes — CleanJet brings everything needed for every clean, including all eco-friendly, non-toxic cleaning products, equipment, and supplies. You don't need to supply anything. If you have a preferred product or a specific requirement (e.g. fragrance-free for allergies), note it in your booking and CleanJet will accommodate where possible." },
      { q: 'What cleaning products does CleanJet use?', a: 'CleanJet uses hospital-grade, eco-certified cleaning products that are non-toxic and free from harsh chemicals. They are safe for children, pets, and people with sensitivities while delivering a thorough, hygienic clean.' },
      { q: "Are CleanJet's products safe for children and pets?", a: 'Yes. All CleanJet cleaning products are non-toxic and free from harsh chemicals. They are specifically chosen to be safe for use in homes with children, babies, and pets — while still meeting hospital-grade cleaning standards for efficacy and hygiene.' },
      { q: 'Do I need to provide any equipment (vacuum, mop, etc.)?', a: 'No. CleanJet brings all required equipment — vacuums, mops, cloths, and all cleaning products. Your only responsibility is to ensure CleanJet has access to the property at the agreed time.' },
    ],
  },
  {
    title: 'Service Area Questions',
    items: [
      { q: 'What areas of Auckland does CleanJet cover?', a: 'CleanJet services the full Auckland metropolitan area, including: Central Auckland (CBD, Parnell, Newmarket, Grey Lynn, Ponsonby), East Auckland (Howick, Botany, Pakuranga, Flat Bush, Manukau), South Auckland (Papakura, Takanini, Manurewa, Ōtara), West Auckland (Henderson, New Lynn, Te Atatu, Glen Eden), and North Auckland / North Shore (Albany, Takapuna, Glenfield, Silverdale).' },
      { q: 'Does CleanJet operate outside of Auckland?', a: 'No. CleanJet operates within the Auckland metropolitan area only. We do not currently service Waikato, Bay of Plenty, Wellington, or other regions.' },
      { q: 'What days and hours does CleanJet operate?', a: 'CleanJet operates Monday to Saturday, 8am–6pm. Sunday availability is not currently offered. For urgent bookings or enquiries outside business hours, email hello@cleanjet.co.nz or call (09) 215-2900.' },
    ],
  },
  {
    title: 'Cleaner Quality and Vetting Questions',
    items: [
      { q: 'Are your cleaners police-checked and vetted?', a: 'Every CleanJet cleaner undergoes rigorous background screening, including criminal record checks, before working in customer homes. CleanJet does not send any cleaner to a property who has not completed the full vetting process.' },
      { q: "Are CleanJet's cleaners insured?", a: 'Yes. CleanJet carries full public liability insurance on all cleans. If any damage is caused during a clean, CleanJet takes full responsibility and handles the claim. Your home and belongings are protected.' },
      { q: 'Will I always get the same cleaner?', a: 'For regular (weekly/fortnightly) cleans, CleanJet assigns a dedicated professional to your property. This ensures consistency, familiarity with your home\'s layout and your preferences, and trust built over repeated visits. For one-off cleans, a fully vetted CleanJet cleaner will be assigned.' },
      { q: 'What checklist does CleanJet follow?', a: 'Regular cleans follow a 45-point checklist covering all rooms, bathrooms, kitchen, and floors. Deep cleans and end of tenancy cleans follow a 75-point checklist that additionally covers inside appliances, skirting boards, ceiling fans, window tracks, inside cupboards, and grout scrubbing.' },
    ],
  },
  {
    title: 'Guarantee and Complaint Questions',
    items: [
      { q: "What is CleanJet's Great Clean Guarantee?", a: "CleanJet's Great Clean Guarantee means: if any area of your clean doesn't meet our standard, notify us within 48 hours and a team will return to reclean the affected areas at zero cost — no questions asked. Every time. No exceptions. CleanJet's standard is perfection; if we fall short, we fix it." },
      { q: 'Do you offer a bond-back guarantee for end of tenancy cleans?', a: "Yes. CleanJet's end of tenancy clean is specifically designed to meet New Zealand property manager and landlord standards. If your bond is withheld due to any cleaning issue, CleanJet will return to reclean the affected areas at no cost." },
      { q: 'How do I report a complaint or quality issue?', a: 'Contact CleanJet by email at hello@cleanjet.co.nz or call (09) 215-2900 within 48 hours of your clean. Describe the area or issue and CleanJet will arrange a reclean under the Great Clean Guarantee. Photo documentation is helpful but not required.' },
    ],
  },
  {
    title: 'Cancellation and Flexibility Questions',
    items: [
      { q: 'Can I cancel or reschedule a clean?', a: 'Yes. Cancel, reschedule, or skip any clean with at least 24 hours\' notice — no fees, no hassle. CleanJet has no lock-in contracts and no cancellation fees. Manage your bookings online or via email.' },
      { q: 'Can I pause my weekly cleaning schedule?', a: 'Yes. You can pause your weekly clean schedule at any time with 24 hours\' notice — for holidays, travel, or any other reason. Resume when ready with no penalties.' },
      { q: 'Is there a minimum booking period?', a: 'No. CleanJet has no minimum term. Book a single clean if that\'s all you need. There is no commitment to future bookings.' },
    ],
  },
  {
    title: 'Payment Questions',
    items: [
      { q: 'How do I pay for my CleanJet clean?', a: 'CleanJet accepts bank transfer (direct credit to ANZ Bank, account name: Cleanjet NZ Limited, account number: 01-0190-0825213-00 — use your invoice or quote number as the payment reference), EFTPOS, and credit card. Payment is due on completion of work unless otherwise agreed. For jobs over $1,000 inc-GST, a 50% deposit is required at booking.' },
      { q: 'Is CleanJet GST-registered?', a: 'Yes. Cleanjet NZ Limited is GST-registered (GST No. 144-124-286). All prices on the CleanJet website and invoices are GST-inclusive unless stated otherwise.' },
      { q: "What is CleanJet's cancellation fee?", a: 'Cancellations made with less than 24 hours\' notice may incur a fee of up to 50% of the quoted service cost to cover scheduling disruptions. Cancellations with more than 24 hours\' notice incur no fee. There are no lock-in contracts.' },
      { q: 'Is CleanJet insured?', a: 'Yes. CleanJet (Cleanjet NZ Limited) carries $5,000,000 public liability insurance. If any damage is caused directly by CleanJet\'s work, the claim is covered. CleanJet is not liable for pre-existing damage, normal wear and tear, or loss of unsecured valuables.' },
    ],
  },
]

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ContentPageShell>
        <article className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Frequently Asked Questions — CleanJet Auckland Home Cleaning
          </h1>
          <p className="mt-6 text-xl text-slate-600">
            Everything you need to know about booking, pricing, products, guarantees, and how CleanJet works. Can&apos;t find your answer? Call <a href="tel:092152900" className="text-sky-600 hover:underline">(09) 215-2900</a> or email <a href="mailto:hello@cleanjet.co.nz" className="text-sky-600 hover:underline">hello@cleanjet.co.nz</a>.
          </p>

          <div className="mt-16 space-y-16">
            {faqSections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-2xl font-bold text-slate-900">
                  {section.title}
                </h2>
                <div className="mt-8 space-y-8">
                  {section.items.map((item) => (
                    <div key={item.q}>
                      <h3 className="font-display text-lg font-semibold text-slate-900">
                        {item.q}
                      </h3>
                      <p className="mt-2 text-slate-600">{item.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </ContentPageShell>
    </>
  )
}

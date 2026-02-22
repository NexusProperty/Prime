import { type Metadata } from 'next'
import Link from 'next/link'
import { ContentPageShell } from '@/components/ContentPageShell'

export const metadata: Metadata = {
  title: 'How CleanJet Works | Book Auckland Home Cleaning Online',
  description:
    'Book CleanJet in 60 seconds — choose your home size, pick a date, and confirm. No forms, no waiting, no contracts. Auckland home cleaning made simple.',
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Book a CleanJet Home Clean in Auckland',
  description: "CleanJet's 5-step process to book professional home cleaning in Auckland in under 60 seconds.",
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Get an instant price',
      text: "Use CleanJet's online price calculator to choose your home size, frequency (one-off or weekly), and any add-ons. Your price is shown immediately — no forms required.",
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Choose your date and time',
      text: 'Select your preferred date and start time from the available calendar. CleanJet is available Mon–Sat 8am–6pm across Auckland.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Confirm your booking',
      text: 'Enter your address and access instructions. Review your price and confirm. Booking confirmation is sent instantly to your email.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'CleanJet cleans your home',
      text: 'A background-checked, insured CleanJet cleaner arrives at the agreed time, works through the full checklist, and notifies you when complete. You don\'t need to be home.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Rate and repeat',
      text: 'Rate your clean after the visit. Set up a weekly recurring schedule and have a consistently clean home without the effort.',
    },
  ],
}

export default function HowItWorksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <ContentPageShell>
        <article className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            How CleanJet Works — Book Auckland Home Cleaning in 60 Seconds
          </h1>
          <p className="mt-6 text-xl text-slate-600">
            CleanJet replaces the friction of traditional home cleaning services with a simple, fully online process. No phone calls, no quote forms, no waiting for callbacks. Just you, a price calculator, and a booking confirmed in under two minutes.
          </p>
          <Link
            href="/#booking"
            className="mt-8 inline-flex h-12 items-center justify-center bg-sky-600 px-6 font-sans text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-sky-500 rounded-full"
          >
            Try the Price Calculator
          </Link>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            How Do I Book a CleanJet Home Clean in Auckland?
          </h2>
          <p className="mt-4 text-slate-600">
            CleanJet&apos;s booking process is five steps from first click to confirmed clean.
          </p>

          <div className="mt-12 space-y-12">
            <div>
              <h3 className="font-display text-xl font-semibold text-slate-900">Step 1: Get an Instant Price</h3>
              <p className="mt-2 text-slate-600">
                Use CleanJet&apos;s online price calculator on the homepage. Choose your home size (1–2 | 3–4 | 5+ bedrooms), frequency (one-off or weekly, save ~20%), and add-ons (Extra bathrooms +$20 | Oven clean +$30 | Windows +$25). Your total price is shown instantly — no forms, no waiting, no salesperson.
              </p>
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold text-slate-900">Step 2: Choose Your Date and Time</h3>
              <p className="mt-2 text-slate-600">
                Pick your preferred date and start time from the available calendar. CleanJet operates Mon–Sat, 8am–6pm across Auckland. Same-week bookings are often available — check availability online or call <a href="tel:092152900" className="text-sky-600 hover:underline">(09) 215-2900</a>.
              </p>
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold text-slate-900">Step 3: Confirm Your Booking</h3>
              <p className="mt-2 text-slate-600">
                Enter your address and any access instructions (key safe code, lockbox, or contact for entry). Review your service, price, and date. Confirm — and you&apos;re done. CleanJet sends a booking confirmation to your email immediately.
              </p>
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold text-slate-900">Step 4: We Clean Thoroughly</h3>
              <p className="mt-2 text-slate-600">
                You don&apos;t need to be home. CleanJet&apos;s background-checked, fully insured cleaner arrives at the agreed time, follows the complete checklist for your service type, and leaves your home clean, secure, and exactly as they found it — minus the mess.
              </p>
              <ul className="mt-4 space-y-2 text-slate-600">
                <li>Works through the full 45-point (regular) or 75-point (deep/end of tenancy) checklist</li>
                <li>Uses eco-friendly, hospital-grade products throughout</li>
                <li>Leaves all entry points as they were found — locked and secure</li>
                <li>Sends you a notification when the clean is complete</li>
              </ul>
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold text-slate-900">Step 5: Rate and Repeat</h3>
              <p className="mt-2 text-slate-600">
                After your clean, CleanJet sends a simple rating request. Tell us how we did — any feedback is acted on immediately. For regular cleans, your dedicated cleaner will be assigned to every subsequent visit. Not satisfied? Report within 48 hours and CleanJet returns to reclean at zero cost. Happy? Set up a recurring weekly plan.
              </p>
            </div>
          </div>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            Do I Need to Be Home When CleanJet Arrives?
          </h2>
          <p className="mt-4 text-slate-600">
            No. The majority of CleanJet customers are not home during their clean. Simply provide entry instructions when booking: key safe / lockbox code, key location, or meet CleanJet to let them in. CleanJet cleaners are background-checked and insured. Your home is safe, and all entry points are secured when the cleaner leaves.
          </p>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            How It Works — FAQs
          </h2>
          <div className="mt-8 space-y-8">
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">How long does CleanJet take to clean my home?</h3>
              <p className="mt-2 text-slate-600">
                A regular clean of a 1–2 bedroom Auckland home typically takes 2–3 hours. A 3–4 bedroom home takes 3–4 hours. Deep cleans and end of tenancy cleans take longer — typically 4–8 hours depending on size and condition. CleanJet allocates the full time needed without rushing.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">Can I specify what I want CleanJet to focus on?</h3>
              <p className="mt-2 text-slate-600">
                Yes. Add cleaning notes or special instructions in the booking form when confirming your appointment. Your cleaner will receive and follow these notes. For recurring cleans, preferences are stored and applied on every visit.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">Is my CleanJet booking confirmed instantly?</h3>
              <p className="mt-2 text-slate-600">
                Yes. Once you complete the online booking process, you receive an immediate email confirmation with your booking details, date, time, and price.
              </p>
            </div>
          </div>
        </article>
      </ContentPageShell>
    </>
  )
}

import { type Metadata } from 'next'
import { ContentPageShell } from '@/components/ContentPageShell'

export const metadata: Metadata = {
  title: 'CleanJet Great Clean Guarantee | Auckland Home Cleaning',
  description:
    "CleanJet's Great Clean Guarantee — not happy with your clean? We return and reclean within 48 hours at zero cost. No questions asked. Every time. Auckland-wide.",
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: "What is CleanJet's Great Clean Guarantee?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "CleanJet's Great Clean Guarantee means if any area of your clean doesn't meet our standard, we return and reclean it within 48 hours at zero cost. No questions asked. Applies to all service types.",
      },
    },
    {
      '@type': 'Question',
      name: 'Does CleanJet offer a bond-back guarantee for end of tenancy cleaning?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. If your bond is withheld due to cleaning after a CleanJet end of tenancy clean, we return and reclean the cited areas at no cost. A photo report is included with every end of tenancy clean.',
      },
    },
    {
      '@type': 'Question',
      name: "How do I claim CleanJet's Great Clean Guarantee?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Contact CleanJet within 48 hours by email (hello@cleanjet.co.nz) or phone. Describe the issue. CleanJet will schedule a reclean within 48 hours at zero cost — no forms, no disputes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a limit to how many times I can use the guarantee?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "No. CleanJet's Great Clean Guarantee has no limit. If any clean falls short of our standard, we return and fix it — regardless of how many times.",
      },
    },
  ],
}

export default function GreatCleanGuaranteePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ContentPageShell>
        <article className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            The Great Clean Guarantee — CleanJet&apos;s Promise to Every Auckland Customer
          </h1>
          <p className="mt-6 text-xl text-slate-600">
            If your CleanJet clean doesn&apos;t meet our standard, we come back and reclean the affected areas within 48 hours, at zero cost. No questions asked. No forms. No disputes. Every time. No exceptions.
          </p>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            What Does CleanJet&apos;s Great Clean Guarantee Cover?
          </h2>
          <p className="mt-4 text-slate-600">
            CleanJet&apos;s Great Clean Guarantee is a simple, unconditional promise: every clean you book with CleanJet meets our professional cleaning standard. If it doesn&apos;t — for any reason — we fix it immediately at no cost to you.
          </p>
          <p className="mt-4 text-slate-600 font-semibold">The guarantee covers:</p>
          <ul className="mt-4 space-y-2 text-slate-600">
            <li><strong>Any area not cleaned to standard</strong> — if we miss a spot, surface, appliance, or room on your checklist, we return and complete it</li>
            <li><strong>Any area cleaned below our standard</strong> — if a bathroom, kitchen, or floor doesn&apos;t meet our quality bar, we reclean it to the correct standard</li>
            <li><strong>End of tenancy</strong> — if your bond is withheld due to cleaning, we return and reclean the specific area(s) cited by your property manager, at no cost</li>
            <li><strong>Any clean, any service type</strong> — the guarantee applies to regular cleans, deep cleans, end of tenancy cleans, and post-build cleans</li>
          </ul>
          <p className="mt-6 text-slate-600 font-semibold">What the guarantee does not cover:</p>
          <ul className="mt-2 space-y-2 text-slate-600">
            <li>Damage caused by factors outside CleanJet&apos;s control (e.g. pre-existing damage, structural issues)</li>
            <li>Areas not included in your booked service type (e.g. oven interior if the oven add-on was not selected)</li>
            <li>Claims made more than 48 hours after the clean was completed</li>
          </ul>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            How Do I Claim CleanJet&apos;s Great Clean Guarantee?
          </h2>
          <p className="mt-4 text-slate-600">
            The process is simple and hassle-free.
          </p>
          <ol className="mt-6 list-decimal list-inside space-y-3 text-slate-600">
            <li><strong>Contact CleanJet within 48 hours</strong> of your clean — by email (hello@cleanjet.co.nz) or phone <a href="tel:092152900" className="text-sky-600 hover:underline">(09) 215-2900</a></li>
            <li><strong>Describe the issue</strong> — tell us which area or areas didn&apos;t meet the standard. Photos are helpful but not required.</li>
            <li><strong>CleanJet schedules the reclean</strong> — we will arrange a return visit within 48 hours at a time that suits you</li>
            <li><strong>We come back and fix it</strong> — a CleanJet cleaner returns and recleans the affected areas to the correct standard, at zero cost</li>
          </ol>
          <p className="mt-6 text-slate-600">
            That&apos;s it. No forms to complete, no claims process, no disputes. Just a clean home.
          </p>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            Does CleanJet Guarantee Bond Return for End of Tenancy Cleans?
          </h2>
          <p className="mt-4 text-slate-600">
            Yes. CleanJet&apos;s end of tenancy clean includes a specific bond-back guarantee in addition to the standard Great Clean Guarantee.
          </p>
          <ul className="mt-6 space-y-2 text-slate-600">
            <li>CleanJet completes your end of tenancy clean and provides a photo report of the finished property</li>
            <li>If your landlord or property manager withholds any portion of your bond due to cleaning, you contact CleanJet with the specific areas cited</li>
            <li>CleanJet returns and recleans those areas at zero cost — immediately</li>
            <li>You use the reclean and updated photo evidence to support your bond return claim</li>
          </ul>
          <p className="mt-4 text-sm text-slate-500">
            The bond-back guarantee applies only to areas covered by the 75-point end of tenancy checklist. It does not cover damage, pre-existing condition issues, or non-cleaning disputes.
          </p>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            Why Is CleanJet Confident Enough to Guarantee Every Clean?
          </h2>
          <ul className="mt-6 space-y-2 text-slate-600">
            <li><strong>Standardised checklists</strong> — 45-point (regular) and 75-point (deep and end of tenancy) checklists leave no room for guesswork</li>
            <li><strong>Vetted, trained professionals</strong> — every cleaner is background-checked and trained in CleanJet&apos;s cleaning standards</li>
            <li><strong>$5,000,000 public liability insurance</strong> — Cleanjet NZ Limited carries $5M insurance on every job</li>
            <li><strong>Consistent assigned cleaners</strong> — regular customers receive the same dedicated cleaner</li>
            <li><strong>Eco-sterile products</strong> — hospital-grade, eco-certified products ensure effective cleaning on the first visit</li>
          </ul>

          <h2 className="mt-16 font-display text-2xl font-bold text-slate-900">
            Guarantee FAQs
          </h2>
          <div className="mt-8 space-y-8">
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">What counts as not meeting CleanJet&apos;s standard?</h3>
              <p className="mt-2 text-slate-600">
                Any area listed on your service checklist that was not cleaned, was cleaned below a hygienic standard, or was missed entirely is covered by the guarantee. Examples include: a bathroom not properly scrubbed, floors still showing visible grime after mopping, inside appliances not cleaned when the add-on was selected, or a room that appears not to have been cleaned.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">Do I need photos to claim the guarantee?</h3>
              <p className="mt-2 text-slate-600">
                No. Photos are helpful as supporting documentation (especially for end of tenancy bond disputes), but they are not required to claim the Great Clean Guarantee. Simply contact CleanJet and describe the issue.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">Is there a limit to how many times I can claim the guarantee?</h3>
              <p className="mt-2 text-slate-600">
                There is no limit. CleanJet&apos;s standard is perfection on every visit. If any visit falls short, the guarantee applies — regardless of how many times you may need to use it.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">Does the guarantee apply to post-build cleans?</h3>
              <p className="mt-2 text-slate-600">
                Yes. The Great Clean Guarantee applies to all CleanJet service types, including post-build cleans. If any area of a post-build clean doesn&apos;t meet our standard, CleanJet returns and completes it at zero cost.
              </p>
            </div>
          </div>
        </article>
      </ContentPageShell>
    </>
  )
}

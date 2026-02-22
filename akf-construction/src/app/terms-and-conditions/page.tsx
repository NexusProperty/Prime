import { type Metadata } from 'next'
import { ContentPageShell } from '@/components/ContentPageShell'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'AKF Construction terms and conditions. Read our terms for quotations, payments, and project agreements.',
}

export default function TermsAndConditionsPage() {
  return (
    <ContentPageShell>
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-bold text-slate-900 sm:text-5xl">
          Terms and Conditions
        </h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: 21st May 2025</p>

        <div className="mt-12 space-y-10 text-slate-700">
          <section>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              1. Definitions
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                &quot;We&quot;, &quot;Us&quot;, &quot;Our&quot; refers to AKF
                Construction.
              </li>
              <li>
                &quot;You&quot;, &quot;Client&quot;, &quot;Customer&quot; refers
                to the person or entity engaging our services.
              </li>
              <li>
                &quot;Services&quot; means the construction or related services
                provided by AKF Construction.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              2. Quotations & Pricing
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>All quotes are valid for 30 days unless stated otherwise.</li>
              <li>
                Prices may be subject to change based on material costs, site
                conditions, or scope adjustments. Any variation will be
                discussed and agreed upon in writing.
              </li>
              <li>
                Quotes exclude unforeseen ground conditions, council fees, or
                additional services not specified.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              3. Payments
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>A deposit may be required before work commences.</li>
              <li>
                Progress payments may be required based on milestones or stages
                of work.
              </li>
              <li>
                Final payment is due upon completion of the project or as stated
                in your contract.
              </li>
              <li>
                Late payments may incur a 2% monthly interest on the overdue
                amount and recovery costs if referred to a debt collection
                agency.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              4. Changes & Variations
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                Any requested changes to the original scope must be provided in
                writing.
              </li>
              <li>
                Changes may result in adjusted timeframes and costs, which will
                be confirmed before proceeding.
              </li>
              <li>
                AKF Construction will not be liable for delays caused by
                weather, supply shortages, council approvals, or other events
                beyond our control.
              </li>
              <li>We will communicate any changes to timelines promptly.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              5. Health & Safety
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                We comply with the Health and Safety at Work Act 2015 (NZ) and
                maintain a safe worksite at all times.
              </li>
              <li>
                Clients must ensure that work areas are accessible and safe for
                our team and subcontractors.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              6. Warranties & Liability
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                We offer workmanship warranty for a period of 12 months from
                project completion unless otherwise agreed in writing.
              </li>
              <li>
                Any manufacturer warranties on materials will be passed on to the
                client.
              </li>
              <li>
                We are not liable for damages caused by misuse, third-party
                work, or natural wear and tear.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              8. Ownership of Materials
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                All materials supplied by us remain our property until full
                payment is received.
              </li>
              <li>
                We reserve the right to remove unpaid materials or halt work if
                payment obligations are not met.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              9. Termination
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                Either party may terminate the agreement in writing with
                reasonable cause.
              </li>
              <li>
                Termination fees may apply based on work completed, materials
                purchased, and other associated costs.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              10. Governing Law
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>These terms are governed by the laws of New Zealand.</li>
              <li>
                Any disputes shall be resolved under New Zealand law and
                jurisdiction.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              11. Contact Us
            </h2>
            <p className="mt-4 leading-relaxed">
              <strong>Email:</strong>{' '}
              <a
                href="mailto:Info@akfconstruction.co.nz"
                className="font-semibold text-amber-600 hover:text-amber-700"
              >
                Info@akfconstruction.co.nz
              </a>
            </p>
            <p className="mt-2 leading-relaxed">
              <strong>Address:</strong> 2/41 Smales Road, East Tamaki, Auckland
              2013
            </p>
          </section>
        </div>
      </div>
    </ContentPageShell>
  )
}

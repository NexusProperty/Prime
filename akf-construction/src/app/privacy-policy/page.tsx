import { type Metadata } from 'next'
import { ContentPageShell } from '@/components/ContentPageShell'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'AKF Construction privacy policy. Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <ContentPageShell>
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-bold text-slate-900 sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: 21st May 2025</p>

        <div className="mt-12 space-y-10 text-slate-700">
          <section>
            <p className="text-lg leading-relaxed">
              At AKF Constructions, we are committed to respecting and protecting
              your privacy. We take your personal information seriously and aim
              to be transparent about how we collect, use, and safeguard it. This
              Privacy Policy outlines our practices regarding data collection
              through our website and other digital communications.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              1. Collection of Your Personal Information
            </h2>
            <p className="mt-4 leading-relaxed">
              You can browse most areas of our website without disclosing any
              personal details. However, certain features—such as contact forms
              or quote requests—may require you to provide identifiable
              personal information, including:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Property address</li>
              <li>Details about your construction project</li>
            </ul>
            <p className="mt-4 leading-relaxed">
              This information is collected voluntarily and with your consent. It
              is used solely by AKF Constructions to respond to enquiries,
              provide services, analyse site traffic, and send occasional
              marketing updates (only if you have opted in).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              2. Use of Personal Information
            </h2>
            <p className="mt-4 leading-relaxed">
              We use your personal information for the following purposes:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Responding to your enquiries or quote requests</li>
              <li>Providing services you have requested</li>
              <li>Analysing traffic and site usage for improvement</li>
              <li>
                Communicating important updates or promotional offers (if opted
                in)
              </li>
            </ul>
            <p className="mt-4 leading-relaxed">
              We will never sell or rent your personal information to third
              parties without your explicit permission.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              3. Data Access & Storage
            </h2>
            <p className="mt-4 leading-relaxed">
              Only authorised AKF Constructions staff may access your personal
              information. We store your data securely and take reasonable steps
              to protect it from loss, misuse, or unauthorised access.
            </p>
            <p className="mt-4 leading-relaxed">
              If you leave a comment or submit a form, the information and any
              associated metadata may be stored indefinitely unless you request
              its deletion.
            </p>
            <p className="mt-4 leading-relaxed">
              If you create an account on our site (if applicable), we also
              store the personal information in your user profile, which can be
              accessed and edited by website administrators.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              4. Your Rights
            </h2>
            <p className="mt-4 leading-relaxed">
              Under New Zealand privacy law, you have the right to:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Request access to the personal data we hold about you</li>
              <li>Ask for corrections to inaccurate information</li>
              <li>
                Request deletion of your data, unless required for legal or
                administrative purposes
              </li>
            </ul>
            <p className="mt-4 leading-relaxed">
              To make a request, please contact:{' '}
              <a
                href="mailto:Info@akfconstruction.co.nz"
                className="font-semibold text-amber-600 hover:text-amber-700"
              >
                Info@akfconstruction.co.nz
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              5. Analytics & Cookies
            </h2>
            <p className="mt-4 leading-relaxed">
              We may use analytics tools (e.g., Google Analytics) to gather
              anonymous traffic and usage data. This helps us understand how
              visitors use our website and improve the user experience.
            </p>
            <p className="mt-4 leading-relaxed">
              We may also use cookies and other tracking technologies to
              personalise your experience and deliver targeted ads.
            </p>
            <p className="mt-4 leading-relaxed">
              You can disable cookies in your browser settings at any time.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              6. Advertising
            </h2>
            <p className="mt-4 leading-relaxed">
              From time to time, we may use Google Display Network re-marketing
              to promote our services online. This means you may see ads for AKF
              Constructions across other websites after visiting ours.
            </p>
            <p className="mt-4 leading-relaxed">
              Google uses cookies to serve these ads based on your browsing
              history. If you prefer not to see re-marketing ads:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                Visit Google Ads Settings:{' '}
                <a
                  href="https://adssettings.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-amber-600 hover:text-amber-700"
                >
                  https://adssettings.google.com/
                </a>
              </li>
              <li>Or opt out via the Network Advertising Initiative</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              7. Changes to This Privacy Policy
            </h2>
            <p className="mt-4 leading-relaxed">
              AKF Constructions reserves the right to update this policy at any
              time. Changes will be posted on this page and/or other relevant
              areas of our website. We encourage you to review this policy
              periodically to stay informed about how we protect your
              information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              8. Contact Us
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

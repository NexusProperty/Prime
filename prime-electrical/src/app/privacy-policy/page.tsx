import { type Metadata } from 'next'
import { ContentPageShell } from '@/components/ContentPageShell'
import { Container } from '@/components/Container'

export const metadata: Metadata = {
  title: 'Privacy Policy | Prime Electrical',
  description:
    'Prime Electrical Limited is committed to respecting and protecting your right to privacy. Read our privacy policy.',
}

export default function PrivacyPolicyPage() {
  return (
    <ContentPageShell>
      <section className="relative flex min-h-[40vh] items-center overflow-hidden bg-white pt-24 pb-16">
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
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Privacy Policy
            </h1>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl prose prose-slate">
            <p className="text-slate-600">
              THE PRIME ELECTRICAL LIMITED is committed to respecting and protecting your right to
              privacy and we take your privacy seriously. We have a strictly enforced privacy
              policy and will keep your personal information secure. To communicate this, we have
              created this privacy policy to disclose and describe our information gathering and
              dissemination practices for our online communications.
            </p>

            <h2 className="font-display text-xl font-bold text-slate-900 mt-12">
              Collection of Your Personal Information
            </h2>
            <p className="text-slate-600 mt-4">
              Most pages on this site can be viewed without providing any information about
              yourself. However, for some content we will request information that makes you
              personally identifiable.
            </p>
            <p className="text-slate-600 mt-4">
              Your personal information is collected for internal use by THE PRIME ELECTRICAL
              LIMITED for site traffic analysis, response to requests and occasional marketing
              communications.
            </p>
            <p className="text-slate-600 mt-4">
              All personal information submitted to THE PRIME ELECTRICAL LIMITED is done so
              voluntarily and with your consent.
            </p>
            <p className="text-slate-600 mt-4">
              We pledge to hold all information you provide to us in absolute privacy.
            </p>
            <p className="text-slate-600 mt-4">
              We will never sell or rent your name or personal information to any third party
              without your express permission.
            </p>
            <p className="text-slate-600 mt-4">
              Only authorized employees may access your information.
            </p>

            <h2 className="font-display text-xl font-bold text-slate-900 mt-12">
              How Long We Retain Your Data
            </h2>
            <p className="text-slate-600 mt-4">
              If you leave a comment, the comment and its metadata are retained indefinitely. This
              is so we can recognize and approve any follow-up comments automatically instead of
              holding them in a moderation queue.
            </p>
            <p className="text-slate-600 mt-4">
              For users that register on our website (if any), we also store the personal
              information they provide in their user profile. Website administrators can also see
              and edit that information.
            </p>

            <h2 className="font-display text-xl font-bold text-slate-900 mt-12">
              What Rights You Have Over Your Data
            </h2>
            <p className="text-slate-600 mt-4">
              If you have an account on this site, or have left comments, you can request to
              receive an exported file of the personal data we hold about you, including any data
              you have provided to us. You can also request that we erase any personal data we hold
              about you. This does not include any data we are obliged to keep for administrative,
              legal, or security purposes.
            </p>

            <h2 className="font-display text-xl font-bold text-slate-900 mt-12">
              Advertising
            </h2>
            <p className="text-slate-600 mt-4">
              We may use remarketing advertisements through the Google Display Network. Google
              uses its Display Network to serve ads around the Internet on websites that support
              its AdSense platform. Google uses cookies to serve ads based on your past visits to
              websites around the web. If you do not wish to see remarketing ads from Google, you
              can visit Google&apos;s Ads Settings page, or you can visit the Network Advertising
              Initiative opt out page.
            </p>

            <h2 className="font-display text-xl font-bold text-slate-900 mt-12">
              Changes to This Privacy Policy
            </h2>
            <p className="text-slate-600 mt-4">
              If we decide to change our privacy policy, we will post those changes to this privacy
              statement, the homepage, and other places we deem appropriate so that you are aware
              of what information we collect, how we use it, and under what circumstances, if any,
              we disclose it. THE PRIME ELECTRICAL LIMITED reserves the right to modify this
              privacy statement at any time, so please review it frequently.
            </p>
          </div>
        </Container>
      </section>
    </ContentPageShell>
  )
}

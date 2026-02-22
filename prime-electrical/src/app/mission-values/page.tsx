import { type Metadata } from 'next'
import { ContentPageShell } from '@/components/ContentPageShell'
import { Container } from '@/components/Container'
import { CallToAction } from '@/components/CallToAction'

export const metadata: Metadata = {
  title: 'Mission & Values | Prime Electrical',
  description:
    'Prime Electrical — reliability, quality, safety, integrity, and responsiveness. Serving Auckland with industry expertise and commitment.',
}

export default function MissionValuesPage() {
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
              Mission & Values
            </h1>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Our Mission
            </h2>
            <ul className="mt-6 space-y-4 text-slate-600">
              <li>Serving our customers by adding superior value with our industry expertise, innovative systems and commitment to them.</li>
              <li>Serving our associates and their families by providing opportunities for associates to grow, advance and secure a prosperous future.</li>
              <li>Serving our suppliers through mutually rewarding relationships.</li>
              <li>Serving the communities in which we live and work.</li>
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Our Values
            </h2>
            <ul className="mt-6 space-y-4 text-slate-600">
              <li><strong className="text-slate-900">Reliability</strong> – we will do what it takes to get the job done and follow through on commitments</li>
              <li><strong className="text-slate-900">Quality</strong> – we will provide effective solutions that adhere to the highest industry standards</li>
              <li><strong className="text-slate-900">Safety</strong> – we will not sacrifice safety for anything, under any circumstances</li>
              <li><strong className="text-slate-900">Integrity</strong> – we will be honest and fair in our dealings with others</li>
              <li><strong className="text-slate-900">Responsiveness</strong> – we will be readily available and flexible in adapting to the changing needs of our customers</li>
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Our Vision
            </h2>
            <p className="mt-4 text-slate-600">
              Encompassing the fields of electrical installation, maintenance, repairs, and fabrication;
              our group will be indispensable; the valued partner and expert solutions provider to
              the underground and allied mining industries. This is and will remain the driving
              principle of progress and the touchstone of success.
            </p>
            <p className="mt-4 text-slate-600">
              Our group of companies will continue to be synonymous with quality services and products.
              Our clients&apos; experience of our reliable and industry leading work exceeds their expectations.
            </p>
          </div>
        </Container>
      </section>

      <CallToAction />
    </ContentPageShell>
  )
}

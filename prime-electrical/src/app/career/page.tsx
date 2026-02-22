import { type Metadata } from 'next'
import { ContentPageShell } from '@/components/ContentPageShell'
import { Container } from '@/components/Container'
import { CallToAction } from '@/components/CallToAction'

export const metadata: Metadata = {
  title: 'Join the Prime Electrical Team | Auckland',
  description:
    'Work with the best specialised electrical experts in Auckland. Prime Electrical offers growth, development, and a strong culture.',
}

export default function CareerPage() {
  return (
    <ContentPageShell>
      <section className="relative flex min-h-[50vh] items-center overflow-hidden bg-white pt-24 pb-16">
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
              PEOPLE. FIRST.
            </h1>
            <h2 className="mt-4 text-2xl font-semibold text-slate-700">
              JOIN THE PRIME ELECTRICAL TEAM
            </h2>
            <h3 className="mt-2 text-xl text-slate-600">
              TAKE YOUR CAREER TO THE NEXT LEVEL
            </h3>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Work with probably the best specialised personalities in an exceptionally strong and adaptable culture.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Our People
            </h2>
            <p className="mt-4 text-slate-600">
              We are a people industry. Our businesses recruit, empower and retain the satisfactory
              personnel within the enterprise. We rejoice DIVERSITY of backgrounds and thoughts,
              and we TRUST our employees to innovate with integrity. They are the coronary heart of
              The Prime Electrical, so we EMPOWER them and are searching for methods to DEVELOP
              their destiny capacity.
            </p>
            <ul className="mt-6 space-y-2 text-slate-600">
              <li>• We offer opportunities for growth and development</li>
              <li>• We share ideas and support each other to achieve our goals, collectively</li>
              <li>• Safety and wellbeing are ingrained in our DNA</li>
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Our Community
            </h2>
            <p className="mt-4 text-slate-600">
              We are dedicated to the communities where we stay and work and we embrace a way of
              life in which every one of us – and our corporation as an entire – can make a
              significant impact. We hunt down and create long-time period partnerships with
              nonprofit groups which might be without a doubt creating a distinction. We remain
              devoted to responsibly using the sources we need to make the sector round us higher.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Programmes
            </h2>
            <p className="mt-4 text-slate-600">
              We invest considerably within the improvement of our team through a huge variety of
              learning and improvement projects.
            </p>
            <p className="mt-4 text-slate-600">
              We build the precise technical process skills of each employee and the management
              skills of individuals who run our commercial enterprise and manage our teams.
            </p>
            <p className="mt-4 text-slate-600">
              Our graduate, trainee, and apprentice programmes are testimony to our dedication to
              the destiny, making sure that the next generation of &apos;The Prime Electrical&apos;
              are geared up to take at the demanding situations of the next day.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Professional Growth
            </h2>
            <ul className="mt-6 space-y-2 text-slate-600">
              <li>• Give Recognition and Rewards</li>
              <li>• Learning Management System</li>
              <li>• Mentoring and Coaching</li>
            </ul>
          </div>
        </Container>
      </section>

      <CallToAction />
    </ContentPageShell>
  )
}

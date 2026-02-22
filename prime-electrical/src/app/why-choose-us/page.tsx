import { type Metadata } from 'next'
import Link from 'next/link'
import { ContentPageShell } from '@/components/ContentPageShell'
import { Container } from '@/components/Container'
import { CallToAction } from '@/components/CallToAction'

export const metadata: Metadata = {
  title: 'Why Choose Prime Electrical | Auckland Electricians',
  description:
    'Prime Electrical — 10+ years experience, 5,000+ happy customers, 1,000+ projects. Your single source for electrical services in Auckland.',
}

export default function WhyChooseUsPage() {
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
              Why Choose Prime Electrical?
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              We are highly specialised in serving electrical services. Our installation services are
              always done promptly and safely.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white p-6 text-center">
                <p className="font-display text-4xl font-bold text-blue-600">10+</p>
                <p className="mt-2 text-sm font-medium text-slate-700">Years Experience</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-6 text-center">
                <p className="font-display text-4xl font-bold text-blue-600">5,000+</p>
                <p className="mt-2 text-sm font-medium text-slate-700">Happy Customers</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-6 text-center">
                <p className="font-display text-4xl font-bold text-blue-600">1,000+</p>
                <p className="mt-2 text-sm font-medium text-slate-700">Projects</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Reasons You Should Call Us
            </h2>
            <p className="mt-4 text-slate-600">
              Prime Electrical Limited is your single source for a complete range of high-quality
              electrical services, including design/build, engineering and maintenance.
            </p>
            <div className="mt-8 space-y-6">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                <h3 className="font-display font-semibold text-slate-900">Established & Reliable</h3>
                <p className="mt-2 text-slate-600">
                  We are a highly experienced team with a long track record of successful residential,
                  commercial, and maintenance electrical work.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                <h3 className="font-display font-semibold text-slate-900">Transparent Working Relationships</h3>
                <p className="mt-2 text-slate-600">
                  We offer full visibility and reporting on job progress as well as direct
                  communication with all staff involved in your project.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                <h3 className="font-display font-semibold text-slate-900">Electricians with Capacity</h3>
                <p className="mt-2 text-slate-600">
                  We are highly specialised in serving electrical services. Our dedicated team of
                  estimators can get you a FREE installation quote within 12–72 hours.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Our Partners
            </h2>
            <p className="mt-4 text-slate-600">
              Daikin, Mitsubishi, Panasonic, Gree, Carrier, and more heat pump brands.
            </p>
          </div>
        </Container>
      </section>

      <CallToAction />
    </ContentPageShell>
  )
}

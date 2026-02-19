import { CallToAction } from '@/components/CallToAction'
import { Faqs } from '@/components/Faqs'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { MobileStickyBar } from '@/components/MobileStickyBar'
import { Pricing } from '@/components/Pricing'
import { PrimaryFeatures } from '@/components/PrimaryFeatures'
import { SecondaryFeatures } from '@/components/SecondaryFeatures'
import { Testimonials } from '@/components/Testimonials'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <Pricing />
        <Testimonials />
        {/* AKF cross-sell banner */}
        <div className="bg-slate-100 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-display text-xl text-slate-900 sm:text-2xl">
                Had renovation work done recently?
              </p>
              <p className="mt-3 text-base text-slate-600">
                We specialise in post-build cleans. Ask about our AKF
                Construction bundle — CleanJet + AKF together saves you time
                and money.
              </p>
              <a
                href="https://akfconstruction.co.nz"
                className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-500 transition-colors"
              >
                Learn about our AKF bundle
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        <CallToAction />
        <Faqs />
      </main>
      <Footer />
      <MobileStickyBar phone="0800000000" bookingUrl="#pricing" />
    </>
  )
}

// Implements @salient page.tsx composition pattern — AKF Construction homepage
// Note: Pricing component not used — replaced with CallToAction quote CTA
import { CallToAction } from '@/components/CallToAction'
import { Faqs } from '@/components/Faqs'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { MobileStickyBar } from '@/components/MobileStickyBar'
import { PrimaryFeatures } from '@/components/PrimaryFeatures'
import { SecondaryFeatures } from '@/components/SecondaryFeatures'
import { Testimonials } from '@/components/Testimonials'

export default function Home() {
  return (
    <>
      <div className="hidden border-b border-slate-200 bg-slate-900 sm:block">
        <div className="mx-auto max-w-7xl px-4 py-2 text-center text-sm font-medium text-slate-300 sm:px-6 lg:px-8">
          Free, no-obligation quotes · Written estimate within 48 hours · Serving all Auckland suburbs{' '}
          <a href="#contact" className="ml-2 font-semibold text-white underline hover:text-slate-200">
            Get a quote →
          </a>
        </div>
      </div>
      <Header />
      <main>
        <Hero />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <Testimonials />
        <CallToAction />
        <Faqs />
      </main>
      <Footer />
      <MobileStickyBar phone="0995198763" bookingUrl="#contact" />
    </>
  )
}

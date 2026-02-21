import { CallToAction } from '@/components/CallToAction'
import { Faqs } from '@/components/Faqs'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Pricing } from '@/components/Pricing'
import { PrimaryFeatures } from '@/components/PrimaryFeatures'
import { SecondaryFeatures } from '@/components/SecondaryFeatures'
import { Testimonials } from '@/components/Testimonials'
import { Container } from '@/components/Container'
import { BookingWizard } from '@/components/BookingWizard'
import { SubscriptionToggle } from '@/components/SubscriptionToggle'
import { AIUpsellCard } from '@/components/AIUpsellCard'
import { AIInteractiveLayer } from '@/components/AIInteractiveLayer'

export default function Home() {
  return (
    <>
      <Header />
      <AIUpsellCard />
      <main>
        <Hero />
        <section id="booking" className="bg-slate-50 py-16 sm:py-24">
          <Container>
            <div className="mx-auto max-w-xl">
              <h2 className="mb-2 text-center font-display text-3xl font-bold text-slate-900 sm:text-4xl">
                Book Instantly
              </h2>
              <p className="mb-8 text-center text-slate-500">
                Select your rooms, pick a date, and confirm in under 2 minutes.
              </p>
              <div className="space-y-4">
                <SubscriptionToggle basePrice={99} />
                <BookingWizard />
              </div>
            </div>
          </Container>
        </section>
        <PrimaryFeatures />
        <SecondaryFeatures />
        <Pricing />
        <Testimonials />
        <CallToAction />
        <Faqs />
      </main>
      <Footer />
      <AIInteractiveLayer />
    </>
  )
}

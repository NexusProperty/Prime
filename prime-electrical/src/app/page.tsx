import { CallToAction } from '@/components/CallToAction'
import { Faqs } from '@/components/Faqs'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { PrimaryFeatures } from '@/components/PrimaryFeatures'
import { SecondaryFeatures } from '@/components/SecondaryFeatures'
import { Testimonials } from '@/components/Testimonials'
import { Container } from '@/components/Container'
import { FinancingBanner } from '@/components/FinancingBanner'
import { AIInteractiveLayer } from '@/components/AIInteractiveLayer'
import { LeadCaptureForm } from '@/components/ai'

export default function Home() {
  return (
    <>
      <FinancingBanner />
      <Header />
      <main>
        <Hero />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <CallToAction />
        <Testimonials />
        <section id="contact" className="bg-slate-50 py-16 sm:py-24">
          <Container>
            <div className="mx-auto max-w-2xl">
              <h2 className="mb-4 text-center font-display text-3xl font-bold text-slate-900 sm:text-4xl">
                Get a Free Quote
              </h2>
              <p className="mb-10 text-center text-slate-500">
                Tell us about your project. Our AI reviews every request to find you the best value
                bundle.
              </p>
              <LeadCaptureForm brand="prime" />
            </div>
          </Container>
        </section>
        <Faqs />
      </main>
      <Footer />
      <AIInteractiveLayer />
    </>
  )
}

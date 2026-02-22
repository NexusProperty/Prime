import { CallToAction } from '@/components/CallToAction'
import { Faqs } from '@/components/Faqs'
import { FeaturedProjects } from '@/components/FeaturedProjects'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { PrimaryFeatures } from '@/components/PrimaryFeatures'
import { SecondaryFeatures } from '@/components/SecondaryFeatures'
import { Testimonials } from '@/components/Testimonials'
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider'
import { ProjectTimeline } from '@/components/ProjectTimeline'
import { LeadCaptureForm } from '@/components/ai'
import { Container } from '@/components/Container'
import { AIInteractiveLayer } from '@/components/AIInteractiveLayer'

const BEFORE_AFTER = [
  {
    beforeSrc:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop',
    afterSrc:
      'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?q=80&w=1200&auto=format&fit=crop',
    beforeAlt: 'Kitchen before renovation',
    afterAlt: 'Kitchen after renovation',
  },
]

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedProjects />
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-center font-display text-3xl font-bold text-slate-900">
              See the Difference
            </h2>
            <div className="mx-auto max-w-3xl">
              <BeforeAfterSlider {...BEFORE_AFTER[0]} />
            </div>
          </div>
        </section>
        <ProjectTimeline />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <Testimonials />
        <CallToAction />
        <section id="contact" className="bg-slate-50 py-16 sm:py-24">
          <Container>
            <div className="mx-auto max-w-2xl">
              <h2 className="mb-4 text-center font-display text-3xl font-bold text-slate-900 sm:text-4xl">
                Get a Free Quote from AKF Construction
              </h2>
              <p className="mb-10 text-center text-slate-500">
                Tell us about your build. Our AI checks for bundle savings with our trade partners.
              </p>
              <LeadCaptureForm brand="akf" />
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

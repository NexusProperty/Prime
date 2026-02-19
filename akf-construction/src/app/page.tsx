import { CallToAction } from '@/components/CallToAction'
import { Faqs } from '@/components/Faqs'
import { FeaturedProjects } from '@/components/FeaturedProjects'
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
      <Header />
      <main>
        <Hero />
        <FeaturedProjects />
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

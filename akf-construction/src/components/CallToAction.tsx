// Implements @salient CallToAction.tsx pattern — AKF Construction CTA
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'

export function CallToAction() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-slate-900 py-32"
    >
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            Ready to transform your home?
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-300">
            Get a free, no-obligation consultation and written quote within 48
            hours. We come to you, anywhere in Auckland.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-x-6">
            <Button href="#quote-form" color="white">
              Get a Free Quote
            </Button>
            <Button href="#projects" variant="outline" color="white">
              View Our Projects
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}

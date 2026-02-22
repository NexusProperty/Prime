'use client'

import { BookingWizard } from '@/components/BookingWizard'

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-white border-b border-slate-200 pt-20 pb-16">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          
          {/* H1 with wave underline on "60 Seconds" */}
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
            Auckland Home Cleaning —{' '}
            <span className="relative whitespace-nowrap">
              <svg
                aria-hidden="true"
                viewBox="0 0 418 42"
                className="absolute top-2/3 left-0 h-[0.58em] w-full fill-sky-300/70"
                preserveAspectRatio="none"
              >
                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
              </svg>
              <span className="relative">Book in 60 Seconds</span>
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
            Vetted, insured cleaners. Eco-friendly products. 100% satisfaction guarantee. Your sparkling home, without the hassle.
          </p>

          {/* Booking Wizard */}
          <div className="mt-10 w-full max-w-2xl">
            <BookingWizard />
          </div>

          {/* Secondary CTA */}
          <a
            href="tel:092152900"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors"
          >
            <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
            (09) 215-2900
          </a>

          {/* Trust Icons Row */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-slate-700">
            <div className="flex items-center gap-2">
              <span className="text-xl">✅</span>
              <span className="text-sm font-medium">Vetted cleaners</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🌿</span>
              <span className="text-sm font-medium">Eco-friendly</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">💯</span>
              <span className="text-sm font-medium">Satisfaction guarantee</span>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}

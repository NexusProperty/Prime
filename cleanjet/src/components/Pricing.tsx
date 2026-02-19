'use client'

// Implements @salient Pricing.tsx pattern — CleanJet with one-off/weekly billing toggle
// Compatible alternative: billing period state added; Plan component adapted for cleaning tiers
import { useState } from 'react'
import clsx from 'clsx'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'

function CheckIcon({ className, ...props }: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      aria-hidden="true"
      className={clsx('h-6 w-6 flex-none fill-current stroke-current', className)}
      {...props}
    >
      <path
        d="M9.307 12.248a.75.75 0 1 0-1.114 1.004l1.114-1.004ZM11 15.25l-.557.502a.75.75 0 0 0 1.15-.043L11 15.25Zm4.844-5.041a.75.75 0 0 0-1.188-.918l1.188.918Zm-7.651 3.043 2.25 2.5 1.114-1.004-2.25-2.5-1.114 1.004Zm3.4 2.457 4.25-5.5-1.187-.918-4.25 5.5 1.188.918Z"
        strokeWidth={0}
      />
      <circle cx={12} cy={12} r={8.25} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const plans = [
  {
    name: '1–2 Bedrooms',
    priceOneOff: '$99',
    priceWeekly: '$79',
    description: 'Perfect for apartments and small homes.',
    href: '#booking-form',
    features: [
      'Up to 2 bedrooms',
      'Bathroom & kitchen clean',
      'Vacuum & mop all floors',
      'General tidy & surfaces',
    ],
    featured: false,
  },
  {
    name: '3–4 Bedrooms',
    priceOneOff: '$149',
    priceWeekly: '$119',
    description: 'Our most popular package for family homes.',
    href: '#booking-form',
    features: [
      'Up to 4 bedrooms',
      'All bathrooms cleaned',
      'Full kitchen clean',
      'Vacuum & mop all floors',
      'Beds made (on request)',
    ],
    featured: true,
  },
  {
    name: '5+ Bedrooms',
    priceOneOff: '$199',
    priceWeekly: '$159',
    description: 'For larger homes and lifestyle properties.',
    href: '#booking-form',
    features: [
      '5+ bedrooms',
      'All bathrooms cleaned',
      'Full kitchen clean',
      'Vacuum & mop all floors',
      'Beds made (on request)',
      'Flexible scheduling',
    ],
    featured: false,
  },
]

function Plan({
  name,
  price,
  description,
  href,
  features,
  featured = false,
}: {
  name: string
  price: string
  description: string
  href: string
  features: string[]
  featured?: boolean
}) {
  return (
    <section
      className={clsx(
        'flex flex-col rounded-3xl px-6 sm:px-8',
        featured ? 'order-first bg-sky-600 py-8 lg:order-none' : 'lg:py-8',
      )}
    >
      <h3 className="mt-5 font-display text-lg text-white">{name}</h3>
      <p className={clsx('mt-2 text-base', featured ? 'text-white' : 'text-slate-400')}>
        {description}
      </p>
      <p className="order-first font-display text-5xl font-light tracking-tight text-white">
        {price}{' '}
        <span className="text-xl font-normal opacity-70">NZD</span>
      </p>
      <ul
        role="list"
        className={clsx(
          'order-last mt-10 flex flex-col gap-y-3 text-sm',
          featured ? 'text-white' : 'text-slate-200',
        )}
      >
        {features.map((feature) => (
          <li key={feature} className="flex">
            <CheckIcon className={featured ? 'text-white' : 'text-sky-400'} />
            <span className="ml-4">{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        href={href}
        variant={featured ? 'solid' : 'outline'}
        color="white"
        className="mt-8"
        aria-label={`Book a ${name} clean for ${price}`}
      >
        Book This Clean
      </Button>
    </section>
  )
}

export function Pricing() {
  const [isWeekly, setIsWeekly] = useState(false)

  return (
    <section
      id="pricing"
      aria-label="Pricing"
      className="bg-slate-900 py-20 sm:py-32"
    >
      <Container>
        <div className="md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            Simple, transparent pricing.
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            No hidden fees. Choose your home size and how often you want us.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center gap-4 rounded-full bg-slate-800 p-1.5">
            <button
              onClick={() => setIsWeekly(false)}
              className={clsx(
                'rounded-full px-5 py-2 text-sm font-semibold transition',
                !isWeekly ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white',
              )}
            >
              One-off clean
            </button>
            <button
              onClick={() => setIsWeekly(true)}
              className={clsx(
                'rounded-full px-5 py-2 text-sm font-semibold transition',
                isWeekly ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white',
              )}
            >
              Weekly{' '}
              <span className="ml-1 rounded-full bg-sky-500 px-2 py-0.5 text-xs text-white">
                Save ~20%
              </span>
            </button>
          </div>
        </div>

        <div className="-mx-4 mt-16 grid max-w-2xl grid-cols-1 gap-y-10 sm:mx-auto lg:-mx-8 lg:max-w-none lg:grid-cols-3 xl:mx-0 xl:gap-x-8">
          {plans.map((plan) => (
            <Plan
              key={plan.name}
              name={plan.name}
              price={isWeekly ? plan.priceWeekly : plan.priceOneOff}
              description={plan.description}
              href={plan.href}
              features={plan.features}
              featured={plan.featured}
            />
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-slate-500">
          All prices include GST. Weekly plans are billed fortnightly.{' '}
          <a href="#faq" className="text-sky-400 hover:text-sky-300 underline">
            See FAQ
          </a>{' '}
          for cancellation policy.
        </p>
      </Container>
    </section>
  )
}

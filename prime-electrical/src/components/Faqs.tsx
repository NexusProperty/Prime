import Image from 'next/image'

import { Container } from '@/components/Container'
import backgroundImage from '@/images/background-faqs.jpg'

const faqs = [
  [
    {
      question: 'How much does a solar panel system cost in Auckland?',
      answer:
        'A typical residential solar system in Auckland ranges from $8,000–$18,000 depending on system size and roof type. We offer free, no-obligation quotes and flexible finance options including GEM Visa (6 months interest-free) and Q Mastercard.',
    },
    {
      question: 'How long does a heat pump installation take?',
      answer:
        'Most heat pump installations are completed in a single day. We handle supply, installation, and commissioning — and we\'ll clean up before we leave. Book a free site visit and we\'ll give you an exact timeframe.',
    },
  ],
  [
    {
      question: 'Do you offer a workmanship guarantee?',
      answer:
        'Yes. All our work is backed by a 12-month workmanship guarantee. We\'re Licensed Electrical Inspectors and members of Master Electricians New Zealand (MENZ), so you\'re covered.',
    },
    {
      question: 'Can I finance a solar or heat pump installation?',
      answer:
        'Absolutely. We work with ANZ (interest-free heat pump home loan top-ups), Westpac Warm Up Loans, GEM Visa (6 months interest-free on $250+), and Q Mastercard (3+ months zero interest). Ask us about the best option for your situation.',
    },
  ],
  [
    {
      question: 'What smart home systems do you install and support?',
      answer:
        'We install and configure Apple HomeKit, Google Home, and Alexa-compatible systems — including smart lighting, security cameras, alarm systems, and whole-home automation. We\'ll also future-proof your wiring for EV charging.',
    },
    {
      question: 'Do you handle emergency electrical callouts?',
      answer:
        'Yes — we handle urgent electrical faults across Auckland. Call us on 09-390-3620. For after-hours emergencies, leave a message and we\'ll get back to you as quickly as possible.',
    },
  ],
]

export function Faqs() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-32"
    >
      <Image
        className="absolute top-0 left-1/2 max-w-none translate-x-[-30%] -translate-y-1/4"
        src={backgroundImage}
        alt=""
        width={1558}
        height={946}
        unoptimized
      />
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faq-title"
            className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
          >
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            Can&apos;t find the answer you&apos;re looking for? Call us on{' '}
            <a
              href="tel:0993903620"
              className="font-semibold text-blue-600 hover:text-blue-500"
            >
              09-390-3620
            </a>{' '}
            and we&apos;ll be happy to help.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-8">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="font-display text-lg/7 text-slate-900">
                      {faq.question}
                    </h3>
                    <p className="mt-4 text-sm text-slate-700">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

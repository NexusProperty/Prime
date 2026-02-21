import Image from 'next/image'

import { Container } from '@/components/Container'
import backgroundImage from '@/images/background-faqs.jpg'

const faqs = [
  [
    {
      question: 'Do you bring your own cleaning products?',
      answer:
        'Yes — we bring everything we need, including eco-friendly, non-toxic cleaning products that are safe for children and pets. You don\'t need to supply anything. If you have a preferred product you\'d like us to use, just let us know.',
    },
    {
      question: 'Are your cleaners police-checked and insured?',
      answer:
        'Every CleanJet cleaner is background-checked and fully insured. We carry public liability insurance and take responsibility for any damage caused during a clean — your home is in safe hands.',
    },
  ],
  [
    {
      question: 'Can I skip or reschedule a clean?',
      answer:
        'Absolutely. There are no lock-in contracts. You can skip, reschedule, or cancel any clean with at least 24 hours\' notice — no fees, no hassle. Life happens, and we get it.',
    },
    {
      question: 'What\'s included in a regular clean?',
      answer:
        'A regular clean includes all rooms vacuumed and mopped, bathrooms scrubbed and sanitised, kitchen surfaces and appliance exteriors wiped down, and beds made on request. We follow a consistent checklist every visit so your home is always cleaned to the same high standard.',
    },
  ],
  [
    {
      question: 'Do you offer a bond-back guarantee for end of tenancy cleans?',
      answer:
        'Yes. Our end of tenancy clean is designed to meet property manager and landlord standards. If your bond is withheld due to cleaning, we\'ll return and reclean the affected areas at no cost — guaranteed.',
    },
    {
      question: 'Do you clean after building or renovation work?',
      answer:
        'We specialise in post-build and post-renovation cleans, including heavy dust removal, paint splash clean-up, window cleaning, and full scrub-down. We work directly with AKF Construction clients — ask about our bundle discount.',
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
            Still have a question? We&apos;d love to help — call or text us any
            time and we&apos;ll get back to you quickly.
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

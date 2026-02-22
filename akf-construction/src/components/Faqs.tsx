import Image from 'next/image'

import { Container } from '@/components/Container'
import backgroundImage from '@/images/background-faqs.jpg'

const faqs = [
  [
    {
      question: 'What construction services does AKF Construction offer?',
      answer:
        'AKF Construction offers a full range of residential and commercial construction services in Auckland, including new home builds, deck construction, fence building, painting services, home renovations, landscape work, and complete project management from initial planning through to final completion.',
    },
    {
      question: 'Where in Auckland does AKF Construction work?',
      answer:
        'AKF Construction is based in East Tamaki and serves homeowners and businesses across the wider Auckland region, including Manukau, Flat Bush, Botany, Howick, Pakuranga, and surrounding suburbs. Contact us to confirm availability for your location.',
    },
  ],
  [
    {
      question: 'Is AKF Construction a licensed builder?',
      answer:
        'Yes, AKF Construction operates with licensed and experienced building professionals. Our team brings years of industry experience to every residential and commercial project, ensuring all work meets New Zealand building standards and is completed to the highest quality.',
    },
    {
      question: 'How do I get a quote from AKF Construction?',
      answer:
        'Getting a quote is straightforward — call 09-951-8763, email Info@akfconstruction.co.nz, or fill in the contact form on our website. We discuss your project requirements, visit the site if needed, and provide a clear, transparent quote with no hidden costs.',
    },
  ],
  [
    {
      question: 'How long does a deck construction project take?',
      answer:
        'Most residential deck projects in Auckland are completed within one to two weeks, depending on size, design complexity, and material availability. AKF Construction provides a clear project timeline before work begins and keeps you informed throughout every stage of the build.',
    },
    {
      question: 'Can AKF Construction manage the full project from start to finish?',
      answer:
        'Yes. Project management is a core part of what AKF Construction does. We coordinate every stage of your build — from initial planning and council requirements through to final completion — so you have one trusted team handling your project from beginning to end.',
    },
  ],
  [
    {
      question: 'Does AKF Construction build new homes in Auckland?',
      answer:
        'Yes. AKF Construction specialises in new home builds across Auckland for residential clients. We work from initial design planning through to project completion, using quality materials and expert craftsmanship to deliver your new home on time and within budget.',
    },
    {
      question: 'Does AKF Construction offer commercial construction services?',
      answer:
        'Yes. In addition to residential work, AKF Construction provides construction services for commercial clients across Auckland, including commercial new builds, fit-outs, painting, fencing, and renovation work for offices, retail spaces, and other commercial properties.',
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
            Frequently Asked Questions About AKF Construction
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            Have a question we haven&apos;t answered? Call us on{' '}
            <a
              href="tel:0995198763"
              className="font-semibold text-slate-900 hover:text-slate-700"
            >
              09-951-8763
            </a>{' '}
            or email{' '}
            <a
              href="mailto:Info@akfconstruction.co.nz"
              className="font-semibold text-slate-900 hover:text-slate-700"
            >
              Info@akfconstruction.co.nz
            </a>
            .
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-4"
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

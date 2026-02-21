import Image from 'next/image'

import { Container } from '@/components/Container'
import backgroundImage from '@/images/background-faqs.jpg'

const faqs = [
  [
    {
      question: 'Do you handle Auckland Council consents?',
      answer:
        'Yes — we manage the consent process for you. For decks over 1.5m, structural alterations, and new builds, we prepare and submit all required documentation to Auckland Council. We\'ll keep you updated throughout.',
    },
    {
      question: 'What materials do you use for decks?',
      answer:
        'We use a range of premium materials including Kwila hardwood, composite decking (Trex, Futurewood), and treated pine — matched to your budget, aesthetic, and maintenance preference. We\'ll walk you through the options at your free consultation.',
    },
  ],
  [
    {
      question: 'Do you offer a structural guarantee?',
      answer:
        'All our structural work is backed by a 10-year guarantee. We use licensed building practitioners and adhere to NZ Building Code standards on every project, large or small.',
    },
    {
      question: 'Can you give me an online quote?',
      answer:
        'We recommend a free on-site consultation for accurate pricing — every project is different. However, you can call us on 09-951-8763 or fill in our contact form and we\'ll give you a ballpark figure before we visit.',
    },
  ],
  [
    {
      question: 'Do you do landscaping as well as construction?',
      answer:
        'Yes. We offer a full suite of outdoor services including landscape design, retaining walls, driveway construction, and automated gates — so you get a complete outdoor transformation from one team.',
    },
    {
      question: 'How long does a renovation take?',
      answer:
        'Timelines vary depending on scope. A kitchen renovation typically takes 3–6 weeks; a full home renovation can take 3–6 months. We provide a detailed project schedule before we begin and send weekly progress updates.',
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
            Have a question we haven&apos;t answered? Call us on{' '}
            <a
              href="tel:0995198763"
              className="font-semibold text-slate-900 hover:text-slate-700"
            >
              09-951-8763
            </a>{' '}
            or email{' '}
            <a
              href="mailto:info@akfconstruction.co.nz"
              className="font-semibold text-slate-900 hover:text-slate-700"
            >
              info@akfconstruction.co.nz
            </a>
            .
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

import { type Metadata } from 'next'
import Link from 'next/link'
import { ContentPageShell } from '@/components/ContentPageShell'
import { Container } from '@/components/Container'
import { CallToAction } from '@/components/CallToAction'

export const metadata: Metadata = {
  title: 'Smart Home Automation Auckland | Prime Electrical',
  description:
    'Prime Electrical sets up smart home automation in Auckland — lighting, heating, security, and voice control. Licensed electricians. Get a free quote today.',
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Smart Home Automation Auckland',
  description:
    'Prime Electrical installs smart home automation systems across Auckland, including automated lighting, heating control, security cameras, voice control integration (Alexa, Google Home, Apple HomeKit), and full home automation design and setup.',
  provider: {
    '@type': 'LocalBusiness',
    name: 'The Prime Electrical',
    telephone: '09-390-3620',
    url: 'https://theprimeelectrical.co.nz/',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Unit 2, 41 Smales Road',
      addressLocality: 'East Tāmaki',
      addressRegion: 'Auckland',
      postalCode: '2013',
      addressCountry: 'NZ',
    },
  },
  areaServed: { '@type': 'City', name: 'Auckland' },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is smart home automation and how does it work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Smart home automation connects your home\'s electrical devices to a central system controlled by smartphone or voice assistant. Prime Electrical installs the wiring and device configuration for a fully integrated smart home in Auckland.',
      },
    },
    {
      '@type': 'Question',
      name: "Does Prime Electrical's smart home system require extra wiring?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "In most cases, no. Prime Electrical's smart home framework is completely wireless, operating through your existing Wi-Fi network with no additional wiring costs in the majority of Auckland homes.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can Prime Electrical integrate smart home automation with voice assistants?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Prime Electrical configures smart home systems to work with Amazon Alexa, Google Home, and Apple HomeKit for hands-free voice control of lighting, heating, and security.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I automate just some rooms, or does it need to cover the whole house?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can start with any rooms or systems. Prime Electrical can automate a single room\'s lighting, just your heating system, or build a fully integrated whole-home smart system — designed around your needs and budget.',
      },
    },
    {
      '@type': 'Question',
      name: 'What areas of Auckland does Prime Electrical serve for smart home automation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Prime Electrical installs smart home automation across all Auckland suburbs including East Auckland, South Auckland, Auckland Central, North Shore, and West Auckland, as well as Hamilton.',
      },
    },
  ],
}

export default function SmartHomeAutomationPage() {
  return (
    <ContentPageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className="relative flex min-h-[50vh] items-center overflow-hidden bg-white pt-24 pb-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <Container className="relative">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Get The Best Home Automation In Auckland
            </h1>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center bg-blue-600 px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-blue-500"
              >
                Free Quote
              </Link>
              <a
                href="tel:0993903620"
                className="inline-flex items-center justify-center border-2 border-slate-900 px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
              >
                Call: 09-390-3620
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              What Is Smart Home Automation and What Does Prime Electrical Install?
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Smart home automation is a system that connects your home&apos;s electrical devices —
              lighting, heating, security cameras, window shades, and more — to a central hub that
              you control from your smartphone or through voice commands. Prime Electrical is
              Auckland&apos;s specialist in smart home installation, helping homeowners build
              personalised, fully automated home environments that are more comfortable, efficient,
              and secure.
            </p>
            <ul className="mt-6 space-y-2 text-slate-600">
              <li>• Lighting control — adjust, schedule, and dim lights from your phone or by voice command</li>
              <li>• Heating and cooling — set personalised temperature schedules for every room</li>
              <li>• Security systems — smart locks, cameras, and alarm systems controlled remotely</li>
              <li>• Window shades and blinds — automated open and close based on time or light levels</li>
              <li>• Entertainment systems — integrated audio, TV, and streaming control</li>
              <li>• Appliances and power points — automate and monitor energy usage across your home</li>
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              What Features Does a Prime Electrical Smart Home System Include?
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {[
                { title: 'Smart Home Controls', desc: 'Control lights, music, or room temperature from your smartphone — wherever you are.' },
                { title: 'Personalised Schedules', desc: 'Have your morning lighting set before you wake, or turn everything off automatically when you leave for work.' },
                { title: 'Voice Control', desc: 'Control your home by talking to a virtual voice assistant (Amazon Alexa, Google Home, or Apple HomeKit).' },
                { title: 'Renowned Smart Home Devices', desc: "Choose from the best home automation brands available in New Zealand, handpicked by Prime Electrical's team." },
                { title: 'Wireless Configuration', desc: "Our smart home framework is completely wireless — no additional wiring costs in most homes." },
                { title: 'Best Customer Support', desc: 'Available via phone or email throughout your smart home journey, from planning through to ongoing support.' },
              ].map((item) => (
                <div key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                  <h3 className="font-display font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Frequently Asked Questions — Smart Home Automation Auckland
            </h2>
            <ul className="mt-8 space-y-8">
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  What is smart home automation and how does it work?
                </h3>
                <p className="mt-2 text-slate-600">
                  Smart home automation connects your home&apos;s electrical devices — lighting,
                  heating, security, and more — to a central system you control from a smartphone or
                  voice assistant. Prime Electrical installs the electrical wiring and device
                  configuration needed for a fully integrated, seamless smart home in Auckland.
                </p>
              </li>
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  How much does smart home automation cost in Auckland?
                </h3>
                <p className="mt-2 text-slate-600">
                  Smart home installation costs vary depending on the size of your home, the number
                  of devices and systems you want to automate, and the level of customisation
                  required. Prime Electrical offers free consultations and no-obligation quotes.
                  Call 09-390-3620 or request a quote online to get an accurate estimate for your
                  home.
                </p>
              </li>
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  Does Prime Electrical&apos;s smart home system require extra wiring?
                </h3>
                <p className="mt-2 text-slate-600">
                  In most cases, no. Prime Electrical&apos;s smart home framework is completely
                  wireless, operating through your existing Wi-Fi network. This means installation
                  is clean and fast with no additional wiring expense in the majority of Auckland
                  homes. Your Prime Electrical technician will advise if any wiring work is needed
                  during the initial consultation.
                </p>
              </li>
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  Can Prime Electrical integrate smart home automation with voice assistants?
                </h3>
                <p className="mt-2 text-slate-600">
                  Yes. Prime Electrical configures smart home systems to work with Amazon Alexa,
                  Google Home, and Apple HomeKit, so you can control lighting, heating, and
                  security by voice command — hands-free, from anywhere in your home.
                </p>
              </li>
              <li>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  Can I automate just some rooms, or does smart home automation need to cover the whole house?
                </h3>
                <p className="mt-2 text-slate-600">
                  You can start with any rooms or systems you want — there is no requirement to
                  automate the whole house at once. Prime Electrical can install smart lighting in a
                  single room, automate just your heating, or build out a fully integrated
                  whole-home system. We design each installation around your needs and budget.
                </p>
              </li>
            </ul>
          </div>
        </Container>
      </section>

      <CallToAction />
    </ContentPageShell>
  )
}

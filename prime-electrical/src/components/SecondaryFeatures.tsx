import { Container } from '@/components/Container'

const features = [
  {
    name: 'Heat Pump Specialists',
    summary: 'Daikin, Panasonic & Mitsubishi — best price guaranteed.',
    description:
      'We supply and install the leading heat pump brands across Auckland. Get a free site assessment and a written quote that beats the big guys — or we\'ll match it.',
    icon: function HeatPumpIcon() {
      return (
        <>
          <path
            d="M12 2v4M12 18v4M4 12H2M22 12h-2M5.64 5.64l-2.83-2.83M21.19 21.19l-2.83-2.83M5.64 18.36l-2.83 2.83M21.19 2.81l-2.83 2.83"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            opacity=".5"
          />
          <circle cx="12" cy="12" r="4" fill="#fff" />
        </>
      )
    },
  },
  {
    name: 'Solar & EV Ready',
    summary: 'SEANZ certified',
    description:
      'Cut your power bill with a quality solar system, battery storage, or EV charger. We\'re SEANZ-certified and offer flexible financing options so you can start saving sooner.',
    icon: function SolarIcon() {
      return (
        <>
          <path
            d="M12 2v4M12 18v4M4 12H2M22 12h-2M5.64 5.64l-2.83-2.83M21.19 21.19l-2.83-2.83M5.64 18.36l-2.83 2.83M21.19 2.81l-2.83 2.83"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            opacity=".5"
          />
          <circle cx="12" cy="12" r="4" fill="#fff" />
        </>
      )
    },
  },
  {
    name: 'Smart Home Experts',
    summary: 'Apple, Google & Alexa compatible installs',
    description:
      'From smart lighting scenes to whole-home automation, security cameras, and EV charger integration — we design and install systems that work seamlessly together.',
    icon: function SmartHomeIcon() {
      return (
        <>
          <path
            opacity=".5"
            d="M12 3L3 9v12h6v-6h6v6h6V9L12 3Z"
            fill="#fff"
          />
          <path d="M12 3L3 9v12h6v-6h6v6h6V9L12 3Z" fill="#fff" />
          <path
            d="M9 15h6M9 18h6"
            stroke="#fff"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity=".7"
          />
        </>
      )
    },
  },
]

function FeatureCard({
  feature,
}: {
  feature: (typeof features)[number]
}) {
  const IconComponent = feature.icon
  return (
    <div className="flex flex-col">
      <div className="w-9 rounded-lg bg-blue-600 p-2 flex items-center justify-center">
        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
          <IconComponent />
        </svg>
      </div>
      <h3 className="mt-6 text-sm font-medium text-blue-600">{feature.name}</h3>
      <p className="mt-2 font-display text-xl text-slate-900">
        {feature.summary}
      </p>
      <p className="mt-4 text-sm text-slate-600">{feature.description}</p>
    </div>
  )
}

export function SecondaryFeatures() {
  return (
    <section
      id="secondary-features"
      aria-label="Why choose Prime Electrical"
      className="pt-20 pb-14 sm:pt-32 sm:pb-20 lg:pb-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
            Why Choose Us
          </h2>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 sm:gap-y-16 lg:mt-20 lg:max-w-none lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.name} feature={feature} />
          ))}
        </div>
      </Container>
    </section>
  )
}

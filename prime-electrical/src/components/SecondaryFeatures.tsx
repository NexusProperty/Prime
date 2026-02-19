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
            d="M18 8a10 10 0 1 0 0 20A10 10 0 0 0 18 8Zm0 3a7 7 0 1 1 0 14A7 7 0 0 1 18 11Z"
            opacity=".4"
            fill="#fff"
          />
          <path
            d="M18 14a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-1 9.93V25a1 1 0 0 0 2 0v-1.07A5.002 5.002 0 0 0 23.07 19H25a1 1 0 0 0 0-2h-1.07A5.002 5.002 0 0 0 19 12.93V11a1 1 0 0 0-2 0v1.93A5.002 5.002 0 0 0 12.93 17H11a1 1 0 0 0 0 2h1.93A5.002 5.002 0 0 0 17 23.93Z"
            fill="#fff"
          />
        </>
      )
    },
  },
  {
    name: 'Solar & EV Ready',
    summary: 'SEANZ-certified solar installs. Finance from $0 upfront.',
    description:
      'Cut your power bill with a quality solar system, battery storage, or EV charger. We\'re SEANZ-certified and offer flexible financing options so you can start saving sooner.',
    icon: function SolarIcon() {
      return (
        <>
          <path
            d="M18 10v2M18 24v2M10 18H8M28 18h-2M12.93 12.93l-1.42-1.42M26.49 26.49l-1.42-1.42M12.93 23.07l-1.42 1.42M26.49 11.51l-1.42 1.42"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            opacity=".5"
          />
          <circle cx="18" cy="18" r="5" fill="#fff" />
        </>
      )
    },
  },
  {
    name: 'Smart Home Experts',
    summary: 'Apple HomeKit, Google Home & Alexa — fully integrated.',
    description:
      'From smart lighting scenes to whole-home automation, security cameras, and EV charger integration — we design and install systems that work seamlessly together.',
    icon: function SmartHomeIcon() {
      return (
        <>
          <path
            opacity=".5"
            d="M18 9 8 16v12h7v-7h6v7h7V16L18 9Z"
            fill="#fff"
          />
          <path d="M18 9 8 16v12h7v-7h6v7h7V16L18 9Z" fill="#fff" />
          <path
            d="M15 21h6M15 24h6"
            stroke="#6692F1"
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
  return (
    <div className="flex flex-col">
      <div className="w-9 rounded-lg bg-blue-600">
        <svg aria-hidden="true" className="h-9 w-9" fill="none">
          <feature.icon />
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
            Every home service — one trusted team.
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            From a simple fault to a full solar system installation, we bring
            the expertise, the brands, and the best pricing in Auckland.
          </p>
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

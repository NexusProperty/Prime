import { Container } from '@/components/Container'

const features = [
  {
    name: 'Vetted & Fully Insured',
    summary: 'Background-checked cleaners. Your home is in safe hands.',
    description:
      'Every CleanJet cleaner goes through a rigorous background check and is covered by full public liability insurance. We stand behind our team — and behind every clean.',
    icon: function ShieldIcon() {
      return (
        <>
          <path
            opacity=".4"
            d="M18 8 9 11.5v8c0 5 4.5 8.5 9 9.5 4.5-1 9-4.5 9-9.5v-8L18 8Z"
            fill="#fff"
          />
          <path
            d="M15 18.5l2 2 4-4"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )
    },
  },
  {
    name: 'Eco-Friendly Products',
    summary: 'Non-toxic and safe for children, pets, and the planet.',
    description:
      'We use eco-certified, non-toxic cleaning products on every visit. No harsh chemicals — just effective, safe cleaning that\'s good for your family and better for New Zealand.',
    icon: function LeafIcon() {
      return (
        <>
          <path
            opacity=".4"
            d="M10 26c2-6 6-10 14-12-1 6-4 11-9 13"
            fill="#fff"
          />
          <path
            d="M10 26c0-8 4-14 14-18 0 10-5 17-14 18Z"
            fill="#fff"
          />
          <path
            d="M10 26c2-3 3-6 3-8"
            stroke="#6692F1"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity=".7"
          />
        </>
      )
    },
  },
  {
    name: '100% Satisfaction Guarantee',
    summary: 'Not happy? We reclean for free — every single time.',
    description:
      'If your clean doesn\'t meet our high standards, call us within 24 hours and we\'ll return to fix it at no charge. No arguments, no excuses. That\'s our promise.',
    icon: function BadgeIcon() {
      return (
        <>
          <path
            opacity=".4"
            d="M18 8c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10S23.5 8 18 8Z"
            fill="#fff"
          />
          <path
            d="M14 18l3 3 5-5"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
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
      <div className="w-9 rounded-lg bg-sky-500">
        <svg aria-hidden="true" className="h-9 w-9" fill="none">
          <feature.icon />
        </svg>
      </div>
      <h3 className="mt-6 text-sm font-medium text-sky-600">{feature.name}</h3>
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
      aria-label="Why choose CleanJet"
      className="pt-20 pb-14 sm:pt-32 sm:pb-20 lg:pb-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
            Clean you can trust. Every single time.
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            We don&apos;t just clean homes — we give Auckland families back
            their time. Here&apos;s why thousands choose CleanJet.
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

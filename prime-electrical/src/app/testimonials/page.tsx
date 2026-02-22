import { type Metadata } from 'next'
import { ContentPageShell } from '@/components/ContentPageShell'
import { Container } from '@/components/Container'
import { CallToAction } from '@/components/CallToAction'

export const metadata: Metadata = {
  title: 'Testimonials | Prime Electrical Auckland',
  description:
    'Read what Auckland customers say about Prime Electrical — heat pump installation, electrical work, smart home automation, and more.',
}

const testimonials = [
  {
    name: 'John Parker',
    quote: "It's always nice to know that you can fully rely on a company and pay for an excellent job they do for you. I appreciate your wonderful customer support, thank you!",
  },
  {
    name: 'Arjun Preet Sandhu',
    quote: 'Very happy with the service and quality of work provided by the team at Prime electrical. They have done a lot of work for me, from heat pump install to complete wiring work for a new house build, home automation work, sound system wiring & install, security systems & camera systems.',
  },
  {
    name: 'Hayden Debenham',
    quote: 'Very thorough and reasonable priced, with great installation of 2 x high quality Heatpumps for my personal home. The installation was not an easy install, but they made it work and did what was necessary to make sure they did it right. Couldn\'t recommend them more, and will continue to use them for electrical work needed in the future. Thanks guys!',
  },
  {
    name: 'li Smith',
    quote: "These guys did great job for me! They are professional and the quote is reasonable. They installed a heat pump, toilet fan & a range hood for my property for the whole day. I think they work very carefully. I'm quite happy with them.",
  },
  {
    name: 'Chaiwala',
    quote: "Max and team are a bunch of professional young guys with solid expertise in their trade. We bought and installed from them a Daikin heatpump and had a seamless experience. Competent pricing, probably the best in the market. Received honest opinions on placement of heatpump for best results. They do not cut corners to save time. Will surely use them again and highly recommended.",
  },
  {
    name: 'szats p',
    quote: 'Very knowledgeable and job well done. Offered us options and cost to help us make decisions. Definitely recommend for reliability and peace of mind.',
  },
  {
    name: 'Gerry Newman',
    quote: "I would definitely recommend these guys to all of my friends and other potential clients. The service is really good, and I can forget about safety issues at all.",
  },
  {
    name: 'Aman Grewal',
    quote: "New heat pump installed about a couple of weeks ago. Excellent installation. It wasn't a standard install and the team did a really good job with the whole process. Looks like it's been apart of the furniture for ages. Best investment coming into winter and a great competitive quote. Thanks so much team 🙂",
  },
  {
    name: 'likhil landge',
    quote: "I would highly recommend this company. Had 4 other big heat pump companies come to me and gave me the quote to install the heat pump. But prime electric beat all the quotes and did the wonderful job. Very impressed with communication and professionalism.",
  },
  {
    name: 'Lorraine Coller',
    quote: "Came to fit the heat pump very quickly. Arrived on time. Polite and friendly. Respectful of my home and offered to vacuum some dust after fitting the unit. Very well priced and efficient. I have already recommended this company to others and will continue to do so.",
  },
]

export default function TestimonialsPage() {
  return (
    <ContentPageShell>
      <section className="relative flex min-h-[40vh] items-center overflow-hidden bg-white pt-24 pb-16">
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
              Customer Testimonials
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Better Service Starts Here. Give us a Miss Call to get a Free Quote.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-16 sm:py-24">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote
                key={t.name}
                className="rounded-lg border border-slate-200 bg-white p-6"
              >
                <p className="text-slate-600 italic">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4 font-semibold text-slate-900">— {t.name}</footer>
              </blockquote>
            ))}
          </div>
        </Container>
      </section>

      <CallToAction />
    </ContentPageShell>
  )
}

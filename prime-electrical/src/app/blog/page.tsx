import { type Metadata } from 'next'
import { ContentPageShell } from '@/components/ContentPageShell'
import { Container } from '@/components/Container'

export const metadata: Metadata = {
  title: 'Blog | Prime Electrical Auckland',
  description:
    'Tips and guides on heat pumps, solar panels, smart home automation, and electrical services from Prime Electrical.',
}

const blogPosts = [
  { title: 'Things To Know Before Opting for Solar Panel Installation', date: '03/02/2023', url: '#' },
  { title: 'Your Guide to Heat Pump Installation', date: '31/01/2023', url: '#' },
  { title: 'Different Types Of Solar Panels', date: '26/07/2022', url: '#' },
  { title: 'Components Of A Home Security System', date: '08/07/2022', url: '#' },
  { title: 'Heat Pump Installation in Auckland – Top 7 Benefits', date: '22/06/2022', url: '#' },
  { title: 'Home Electrical Panel Upgradation - Top 5 Signs to Consider', date: '15/06/2022', url: '#' },
  { title: 'Different Types of Home Security Systems in Auckland', date: '31/05/2022', url: '#' },
  { title: 'Things to Consider Before Choosing a Home Ventilation System in Auckland', date: '27/05/2022', url: '#' },
  { title: 'Types of Underfloor Heating & its benefits', date: '29/04/2022', url: '#' },
  { title: 'Things to Consider Before Choosing the Best Solar Panels for Your Home in Auckland', date: '06/04/2022', url: '#' },
  { title: 'Guide to Find the Right Heat Pump in Auckland, New Zealand', date: '17/03/2022', url: '#' },
  { title: 'How to Buy a Home Security System | Guide for choosing the Best Security System in Auckland', date: '25/02/2022', url: '#' },
  { title: 'How to Get Your Home Automation in Auckland – Reasons to consider having the Smart Home', date: '09/02/2022', url: '#' },
  { title: 'TOP 3 THINGS TO CONSIDER TO FIND THE BEST ELECTRICIAN IN AUCKLAND', date: '15/01/2022', url: '#' },
  { title: 'SOLAR PANEL INSTALLATION FOR NEW ZEALAND HOMES – 5 REASONS TO HAVE SOLAR PANELS FOR YOUR HOME', date: '05/01/2022', url: '#' },
  { title: 'HOW TO DESIGN HOME SECURITY SYSTEMS', date: '27/12/2021', url: '#' },
  { title: 'SMART HOME AUTOMATION TRENDS IN 2022', date: '24/12/2021', url: '#' },
  { title: 'Solar Panel maintenance', date: '08/12/2021', url: '#' },
  { title: 'Trends in Residential Electrical Technology', date: '18/11/2021', url: '#' },
  { title: 'KNOW YOUR HEAT PUMPS', date: '10/11/2021', url: '#' },
]

export default function BlogPage() {
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
              Blog
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Tips and guides on heat pumps, solar panels, smart home automation, and electrical services.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl mb-8">
              Topics Covered
            </h2>
            <ul className="mb-12 flex flex-wrap gap-2">
              {['Heat Pump Installation & Selection', 'Solar Panel Installation & Maintenance', 'Smart Home Automation', 'Home Security Systems', 'Home Ventilation Systems', 'Underfloor Heating', 'Electrical Panel Upgradation', 'Finding the Best Electrician in Auckland'].map((topic) => (
                <li key={topic}>
                  <span className="rounded-full bg-slate-200 px-4 py-2 text-sm text-slate-700">{topic}</span>
                </li>
              ))}
            </ul>
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl mb-8">
              Blog Posts
            </h2>
            <ul className="space-y-4">
              {blogPosts.map((post) => (
                <li key={post.title}>
                  <a
                    href={post.url}
                    className="block rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-slate-50"
                  >
                    <h3 className="font-display font-semibold text-slate-900">{post.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{post.date}</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </ContentPageShell>
  )
}

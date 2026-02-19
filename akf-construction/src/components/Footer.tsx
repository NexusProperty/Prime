// Implements @salient Footer.tsx pattern — AKF Construction
import Link from 'next/link'
import { Container } from '@/components/Container'
import { NavLink } from '@/components/NavLink'

const hubBrands = [
  { name: 'Prime Electrical', href: '#', desc: 'Electrical & Solar' },
  { name: 'CleanJet', href: '#', desc: 'Home Cleaning' },
]

export function Footer() {
  return (
    <footer className="bg-slate-900 pb-16 sm:pb-0">
      <Container>
        <div className="py-16">
          <span className="mx-auto block text-center font-display text-xl font-semibold text-white">
            AKF Construction
          </span>
          <nav className="mt-10 text-sm" aria-label="quick links">
            <div className="-my-1 flex flex-wrap justify-center gap-x-6 gap-y-2">
              <NavLink href="#projects">Projects</NavLink>
              <NavLink href="#services">Services</NavLink>
              <NavLink href="#decks">Decks & Fencing</NavLink>
              <NavLink href="#testimonials">Reviews</NavLink>
              <NavLink href="#contact">Get a Quote</NavLink>
            </div>
          </nav>
        </div>

        {/* Hub footer — Prime Group cross-links */}
        <div className="border-t border-white/10 py-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500">
            Part of the Prime Group
          </p>
          <div className="mt-4 flex justify-center gap-x-8">
            {hubBrands.map((brand) => (
              <Link key={brand.name} href={brand.href} className="group text-center">
                <p className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                  {brand.name}
                </p>
                <p className="text-xs text-slate-500">{brand.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center border-t border-white/10 py-10 sm:flex-row-reverse sm:justify-between">
          <div className="flex gap-x-6">
            <Link href="#" className="group" aria-label="AKF Construction on Facebook">
              <svg className="h-6 w-6 fill-slate-500 group-hover:fill-slate-300" aria-hidden="true" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-500 sm:mt-0">
            Copyright &copy; {new Date().getFullYear()} AKF Construction Ltd. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}

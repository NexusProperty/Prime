import Link from 'next/link'
import { Container } from '@/components/Container'

const navigation = {
  services: [
    { name: 'Our Services', href: '/our-services' },
    { name: 'Deck Construction', href: '/our-services#deck' },
    { name: 'Fence Construction', href: '/our-services#fence' },
    { name: 'Home Renovation', href: '/our-services#renovation' },
    { name: 'New Builds', href: '/our-services#new-build' },
  ],
  company: [
    { name: 'About Us', href: '/about-us' },
    { name: 'Contact Us', href: '/contact-us' },
    { name: 'Featured Projects', href: '/#projects' },
    { name: 'How We Work', href: '/#process' },
    { name: 'FAQ', href: '/#faq' },
  ],
  contact: [
    { name: '09-951-8763', href: 'tel:0995198763' },
    { name: 'Info@akfconstruction.co.nz', href: 'mailto:Info@akfconstruction.co.nz' },
    { name: '2/41 Smales Road, East Tamaki', href: 'https://maps.google.com/?q=2/41+Smales+Road+East+Tamaki+Auckland+2013' },
    { name: 'Auckland 2013', href: '#' },
    { name: 'Mon–Fri 8:00am–5:00pm', href: '#' },
  ],
}

const hubBrands = [
  { name: 'Prime Electrical', href: '#', desc: 'Solar, heat pumps & electrical' },
  { name: 'CleanJet', href: '#', desc: 'Post-build & residential cleaning' },
]

export function Footer() {
  return (
    <footer className="bg-slate-900">
      <Container>
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
            {/* Brand column */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-800 ring-1 ring-white/10">
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 text-amber-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                  </svg>
                </div>
                <span className="font-display text-base font-semibold text-white">
                  AKF Construction
                </span>
              </Link>

              <p className="mt-4 text-sm leading-relaxed text-slate-500">
                Auckland builders specialising in renovations, decks, fencing,
                and new builds. Built on trust. Driven by quality.
              </p>

              {/* Guarantee badge */}
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1.5 ring-1 ring-amber-500/20">
                <svg aria-hidden="true" className="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
                <span className="text-xs font-semibold text-amber-400">
                  10-year structural guarantee
                </span>
              </div>

              {/* Socials */}
              <div className="mt-6 flex gap-4">
                <Link
                  href="#"
                  className="group"
                  aria-label="AKF Construction on Facebook"
                >
                  <svg
                    className="h-5 w-5 fill-slate-600 transition group-hover:fill-white"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="group"
                  aria-label="AKF Construction on Instagram"
                >
                  <svg
                    className="h-5 w-5 fill-slate-600 transition group-hover:fill-white"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                Services
              </h3>
              <ul role="list" className="mt-6 space-y-3">
                {navigation.services.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-500 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                Company
              </h3>
              <ul role="list" className="mt-6 space-y-3">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-500 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                Contact
              </h3>
              <ul role="list" className="mt-6 space-y-3">
                {navigation.contact.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-sm text-slate-500 hover:text-white transition-colors"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Quote prompt card */}
              <div className="mt-8 rounded-xl bg-amber-500/10 p-4 ring-1 ring-amber-500/20">
                <p className="text-sm font-semibold text-white">
                  Free site consultation
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Written quote within 48 hours. No obligation. We come to you.
                </p>
                <a
                  href="tel:0995198763"
                  className="mt-3 block text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Call 09-951-8763 →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Prime Group strip */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Part of the Prime Group: Prime Electrical · CleanJet
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/5 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-700">
              Copyright &copy; {new Date().getFullYear()} AKF Construction Ltd. All rights reserved.
            </p>
            <div className="flex gap-x-6">
              <Link href="/privacy-policy" className="text-sm text-slate-700 hover:text-slate-500">
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className="text-sm text-slate-700 hover:text-slate-500">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}

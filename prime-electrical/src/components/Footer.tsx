import Link from 'next/link'
import { Container } from '@/components/Container'

const navigation = {
  services: [
    { name: 'Electrical Services', href: '#electrical' },
    { name: 'Solar Panels', href: '#solar' },
    { name: 'Heat Pumps', href: '#solar' },
    { name: 'EV Chargers', href: '#solar' },
    { name: 'Smart Home', href: '#smart-home' },
    { name: 'Healthy Homes', href: '#electrical' },
  ],
  company: [
    { name: 'About Us', href: '#' },
    { name: 'Reviews', href: '#testimonials' },
    { name: 'Finance Options', href: '#financing' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Careers', href: '#' },
  ],
  contact: [
    { name: '09-390-3620', href: 'tel:0993903620' },
    { name: 'info@theprimeelectrical.co.nz', href: 'mailto:info@theprimeelectrical.co.nz' },
    { name: 'Unit 2, 41 Smales Road, East Tāmaki, Auckland 2013', href: '#' },
    { name: 'Mon–Fri 8:30am–5:00pm', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-slate-900">
      <Container>
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
            {/* Brand column */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600">
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C13.21 17.89 11 21 11 21z" />
                  </svg>
                </div>
                <span className="font-display text-lg font-semibold text-white">
                  Prime Electrical
                </span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                Auckland&apos;s trusted electricians for solar, heat pumps,
                smart home, and electrical services. Certified. Reliable.
                10+ years experience.
              </p>
              {/* Socials */}
              <div className="mt-6 flex gap-4">
                <Link
                  href="#"
                  className="group"
                  aria-label="Prime Electrical on Facebook"
                >
                  <svg
                    className="h-5 w-5 fill-slate-500 transition group-hover:fill-white"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-300">
                Services
              </h3>
              <ul role="list" className="mt-6 space-y-3">
                {navigation.services.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-300">
                Company
              </h3>
              <ul role="list" className="mt-6 space-y-3">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-300">
                Contact
              </h3>
              <ul role="list" className="mt-6 space-y-3">
                {navigation.contact.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Prime Group strip */}
        <div className="border-t border-white/10 py-6">
          <div className="text-center">
            <p className="text-sm text-slate-400">
              Part of the Prime Group: <span className="text-white font-medium">AKF Construction</span> · <span className="text-white font-medium">CleanJet</span>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-500">
              Copyright &copy; {new Date().getFullYear()} Prime Electrical Ltd. All rights reserved.
            </p>
            <div className="flex gap-x-6">
              <Link href="#" className="text-sm text-slate-500 hover:text-slate-400">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-slate-500 hover:text-slate-400">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}

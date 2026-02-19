'use client'

import Link from 'next/link'
import {
  Popover,
  PopoverButton,
  PopoverBackdrop,
  PopoverPanel,
} from '@headlessui/react'
import clsx from 'clsx'

import { Button } from '@/components/Button'
import { NavLink } from '@/components/NavLink'

function MobileNavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <PopoverButton as={Link} href={href} className="block w-full p-2">
      {children}
    </PopoverButton>
  )
}

function MobileNavIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx(
          'origin-center transition',
          open && 'scale-90 opacity-0',
        )}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx(
          'origin-center transition',
          !open && 'scale-90 opacity-0',
        )}
      />
    </svg>
  )
}

function MobileNavigation() {
  return (
    <Popover>
      <PopoverButton
        className="relative z-10 flex h-8 w-8 items-center justify-center focus:not-data-focus:outline-hidden"
        aria-label="Toggle Navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </PopoverButton>
      <PopoverBackdrop
        transition
        className="fixed inset-0 bg-slate-300/50 duration-150 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in"
      />
      <PopoverPanel
        transition
        className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5 data-closed:scale-95 data-closed:opacity-0 data-enter:duration-150 data-enter:ease-out data-leave:duration-100 data-leave:ease-in"
      >
        <MobileNavLink href="#services">Services</MobileNavLink>
        <MobileNavLink href="#solar">Solar & Heat Pumps</MobileNavLink>
        <MobileNavLink href="#smart-home">Smart Home</MobileNavLink>
        <MobileNavLink href="#testimonials">Reviews</MobileNavLink>
        <MobileNavLink href="#financing">Finance Options</MobileNavLink>
        <hr className="m-2 border-slate-300/40" />
        <MobileNavLink href="#contact">Get a Free Quote</MobileNavLink>
      </PopoverPanel>
    </Popover>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Desktop top utility bar */}
      <div className="hidden border-b border-slate-100 bg-slate-50 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 sm:px-6 lg:px-8">
          <p className="text-xs text-slate-500">
            Unit 2, 41 Smales Road, East Tāmaki, Auckland 2013 &nbsp;·&nbsp;
            Mon–Fri 8:30am–5:00pm
          </p>
          <a
            href="tel:0993903620"
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-500"
          >
            <svg
              aria-hidden="true"
              className="h-3 w-3"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
            09-390-3620
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between" aria-label="Main navigation">
          {/* Logo */}
          <Link href="/" aria-label="Prime Electrical Home" className="flex items-center gap-2">
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
            <span className="font-display text-lg font-semibold text-slate-900">
              Prime Electrical
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-x-1 md:flex">
            <NavLink href="#services">Services</NavLink>
            <NavLink href="#solar">Solar & Heat Pumps</NavLink>
            <NavLink href="#smart-home">Smart Home</NavLink>
            <NavLink href="#testimonials">Reviews</NavLink>
            <NavLink href="#financing">Finance</NavLink>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-x-4 md:flex">
            <a
              href="tel:0993903620"
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-blue-600"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              09-390-3620
            </a>
            <Button href="#contact" color="blue">
              Get a Free Quote
            </Button>
          </div>

          {/* Mobile hamburger */}
          <div className="-mr-1 md:hidden">
            <MobileNavigation />
          </div>
        </nav>
      </div>
    </header>
  )
}

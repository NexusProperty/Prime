'use client'

import Link from 'next/link'
import {
  Popover,
  PopoverButton,
  PopoverBackdrop,
  PopoverPanel,
} from '@headlessui/react'
import clsx from 'clsx'

function MobileNavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <PopoverButton as={Link} href={href} className="block w-full p-4 border-b border-slate-800 text-sm font-bold uppercase tracking-widest text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
      {children}
    </PopoverButton>
  )
}

function MobileNavIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 overflow-visible stroke-slate-900"
      fill="none"
      strokeWidth={2}
      strokeLinecap="square"
    >
      <path
        d="M0 2H16M0 8H16M0 14H16"
        className={clsx(
          'origin-center transition',
          open && 'scale-90 opacity-0',
        )}
      />
      <path
        d="M2 2L14 14M14 2L2 14"
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
        className="relative z-10 flex h-10 w-10 items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors focus:outline-hidden rounded-none"
        aria-label="Toggle Navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </PopoverButton>
      <PopoverBackdrop
        transition
        className="fixed inset-0 z-40 bg-slate-950/90 backdrop-blur-sm duration-150 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in"
      />
      <PopoverPanel
        transition
        className="absolute inset-x-4 top-24 z-50 flex origin-top flex-col bg-slate-900 border-l-4 border-amber-500 shadow-2xl data-closed:scale-95 data-closed:opacity-0 data-enter:duration-150 data-enter:ease-out data-leave:duration-100 data-leave:ease-in rounded-none"
      >
        <div className="p-2">
          <MobileNavLink href="/#projects">Projects</MobileNavLink>
          <MobileNavLink href="/our-services">Our Services</MobileNavLink>
          <MobileNavLink href="/about-us">About Us</MobileNavLink>
          <MobileNavLink href="/contact-us">Contact Us</MobileNavLink>
          <div className="mt-4 p-4">
            <PopoverButton as={Link} href="/contact-us" className="flex w-full h-12 items-center justify-center bg-slate-900 font-sans text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-slate-800 rounded-full">
              Get a Quote
            </PopoverButton>
          </div>
        </div>
      </PopoverPanel>
    </Popover>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-block px-4 py-2 text-sm font-bold uppercase tracking-widest text-slate-600 transition-colors hover:text-slate-900"
    >
      {children}
    </Link>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* High-Vis Utility bar */}
      <div className="hidden bg-slate-900 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex gap-6 text-xs font-mono tracking-widest text-slate-400 uppercase">
            <span>2/41 Smales Road, East Tāmaki</span>
            <span className="text-slate-600">|</span>
            <span>Mon–Fri 8:00am–5:00pm</span>
          </div>
          <a
            href="tel:0995198763"
            className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-amber-500 hover:text-amber-400 transition-colors"
          >
            <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
            09-951-8763
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          className="flex h-20 items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo - Structural block */}
          <Link
            href="/"
            aria-label="AKF Construction Home"
            className="flex items-center gap-3 group"
          >
            <div className="flex h-12 w-12 items-center justify-center bg-slate-900 transition-transform group-hover:scale-105 rounded-none">
              <svg
                aria-hidden="true"
                className="h-6 w-6 text-amber-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold text-slate-900 uppercase tracking-tight leading-none">
                AKF Construction
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">
                Auckland Builders
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center md:flex">
            <NavLink href="/#projects">Projects</NavLink>
            <NavLink href="/our-services">Our Services</NavLink>
            <NavLink href="/about-us">About Us</NavLink>
            <NavLink href="/contact-us">Contact Us</NavLink>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-x-6 md:flex">
            <Link
              href="/contact-us"
              className="inline-flex h-10 items-center justify-center bg-slate-900 px-6 font-sans text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-slate-800 rounded-full"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <MobileNavigation />
          </div>
        </nav>
      </div>
    </header>
  )
}

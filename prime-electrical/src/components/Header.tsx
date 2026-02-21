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
    <PopoverButton as={Link} href={href} className="block w-full p-4 border-b border-slate-200 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors">
      {children}
    </PopoverButton>
  )
}

function MobileNavIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6 overflow-visible stroke-slate-600"
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
        className="relative z-10 flex h-10 w-10 items-center justify-center rounded-md bg-white hover:bg-slate-50 transition-colors focus:outline-2 focus:outline-blue-600"
        aria-label="Toggle Navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </PopoverButton>
      <PopoverBackdrop
        transition
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm duration-150 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in"
      />
      <PopoverPanel
        transition
        className="absolute inset-x-4 top-20 z-50 flex origin-top flex-col bg-white border border-slate-200 shadow-xl rounded-lg data-closed:scale-95 data-closed:opacity-0 data-enter:duration-150 data-enter:ease-out data-leave:duration-100 data-leave:ease-in"
      >
        <div className="p-2">
          <MobileNavLink href="#services">Services</MobileNavLink>
          <MobileNavLink href="#solar">Solar & Heat Pumps</MobileNavLink>
          <MobileNavLink href="#smart-home">Smart Home</MobileNavLink>
          <MobileNavLink href="#testimonials">Reviews</MobileNavLink>
          <div className="mt-4 p-4">
            <PopoverButton as={Link} href="#contact" className="flex w-full h-12 items-center justify-center bg-blue-600 font-sans text-sm font-semibold text-white rounded-full transition-colors hover:bg-blue-700">
              Get a Free Quote
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
      className="inline-flex items-center px-4 text-sm font-medium text-slate-700 transition-colors hover:text-slate-900"
    >
      {children}
    </Link>
  )
}

export function Header() {
  return (
    <>
      {/* Top Telemetry Bar */}
      <div className="hidden bg-slate-950 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400">
              System Online
            </span>
            <span className="font-mono text-[10px] text-slate-600">|</span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
              Auckland // NZ
            </span>
          </div>
          <a
            href="tel:0993903620"
            className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400 hover:text-blue-300 transition-colors"
          >
            <svg aria-hidden="true" className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
            09-390-3620
          </a>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            className="flex h-16 items-center justify-between"
            aria-label="Main navigation"
          >
            {/* Logo */}
            <Link
              href="/"
              aria-label="Prime Electrical Home"
              className="flex items-center gap-2.5"
            >
              <div className="flex h-8 w-8 items-center justify-center bg-blue-600">
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C13.21 17.89 11 21 11 21z" />
                </svg>
              </div>
              <span className="font-mono text-sm font-bold uppercase tracking-[0.15em] text-slate-900">
                Prime Electrical
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex md:items-center">
              <NavLink href="#services">Services</NavLink>
              <NavLink href="#solar">Solar & Heat Pumps</NavLink>
              <NavLink href="#smart-home">Smart Home</NavLink>
              <NavLink href="#testimonials">Reviews</NavLink>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex md:items-center">
              <Link
                href="#contact"
                className="inline-flex h-9 items-center justify-center bg-slate-900 px-5 font-mono text-xs font-bold uppercase tracking-widest text-blue-400 transition-colors hover:bg-slate-800"
              >
                Get a Free Quote
              </Link>
            </div>

            {/* Mobile hamburger */}
            <div className="md:hidden">
              <MobileNavigation />
            </div>
          </nav>
        </div>
      </header>
    </>
  )
}

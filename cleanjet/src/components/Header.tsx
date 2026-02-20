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
    <PopoverButton as={Link} href={href} className="block w-full p-4 border-b border-slate-100 text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors">
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
        className="relative z-10 flex h-10 w-10 items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 transition-colors focus:outline-hidden rounded-none"
        aria-label="Toggle Navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </PopoverButton>
      <PopoverBackdrop
        transition
        className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm duration-150 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in"
      />
      <PopoverPanel
        transition
        className="absolute inset-x-4 top-24 z-50 flex origin-top flex-col bg-white border-t-4 border-sky-500 shadow-2xl data-closed:scale-95 data-closed:opacity-0 data-enter:duration-150 data-enter:ease-out data-leave:duration-100 data-leave:ease-in rounded-none"
      >
        <div className="p-2">
          <MobileNavLink href="#services">Services</MobileNavLink>
          <MobileNavLink href="#pricing">Pricing</MobileNavLink>
          <MobileNavLink href="#how-it-works">Protocol</MobileNavLink>
          <MobileNavLink href="#testimonials">Verification</MobileNavLink>
          <div className="mt-4 p-4">
            <PopoverButton as={Link} href="#booking" className="flex w-full h-12 items-center justify-center bg-sky-500 font-sans text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-sky-400 rounded-none">
              Initiate Service
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
      className="inline-flex h-full items-center px-6 text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-sky-600 hover:bg-slate-50 border-l border-slate-100"
    >
      {children}
    </Link>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Clinical Promo Bar */}
      <div className="hidden border-b border-sky-100 bg-sky-50/50 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-sky-700 uppercase">
            <span className="h-1.5 w-1.5 bg-sky-500 rounded-none" />
            First service deployment: 20% discount active
          </div>
          <a
            href="#pricing"
            className="text-[10px] font-bold tracking-widest text-sky-600 uppercase hover:text-sky-800 transition-colors"
          >
            Review Pricing Matrix →
          </a>
        </div>
      </div>

      {/* Main Clinical Nav */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          className="flex h-20 items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            aria-label="CleanJet Home"
            className="flex items-center gap-3 group"
          >
            <div className="flex h-10 w-10 items-center justify-center bg-sky-50 border border-sky-100 transition-colors group-hover:border-sky-300 rounded-none">
              <svg
                aria-hidden="true"
                className="h-5 w-5 text-sky-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold text-slate-900 uppercase tracking-tight leading-none">
                CleanJet
              </span>
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                Clinical Hygiene
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden h-full items-center border-r border-slate-100 md:flex">
            <NavLink href="#services">Services</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="#how-it-works">Protocol</NavLink>
            <NavLink href="#testimonials">Verification</NavLink>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-x-6 pl-6 md:flex">
            <a
              href="tel:0800000000"
              className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-slate-500 hover:text-sky-600 transition-colors"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              0800 000 000
            </a>
            <a
              href="#booking"
              className="inline-flex h-10 items-center justify-center bg-sky-500 px-6 font-sans text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-sky-400 rounded-none shadow-xs"
            >
              Initiate Service
            </a>
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

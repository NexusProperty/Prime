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
    <PopoverButton as={Link} href={href} className="block w-full p-4 border-b border-slate-200 text-xs font-mono font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors">
      {children}
    </PopoverButton>
  )
}

function MobileNavIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 overflow-visible stroke-blue-600"
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
        className="relative z-10 flex h-10 w-10 items-center justify-center border border-slate-300 bg-white hover:bg-slate-50 hover:border-blue-500 transition-colors focus:outline-hidden"
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
        className="absolute inset-x-4 top-24 z-50 flex origin-top flex-col bg-white border border-slate-200 shadow-2xl data-closed:scale-95 data-closed:opacity-0 data-enter:duration-150 data-enter:ease-out data-leave:duration-100 data-leave:ease-in rounded-none"
      >
        <div className="p-2">
          <MobileNavLink href="#services">System Architecture</MobileNavLink>
          <MobileNavLink href="#solar">Solar Optimization</MobileNavLink>
          <MobileNavLink href="#smart-home">Automation</MobileNavLink>
          <MobileNavLink href="#financing">Capital Allocation</MobileNavLink>
          <div className="mt-4 p-4">
            <PopoverButton as={Link} href="#contact" className="flex w-full h-12 items-center justify-center bg-blue-600 font-sans text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-blue-500">
              Initialize Diagnostics
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
      className="inline-flex h-full items-center px-6 text-xs font-mono font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-slate-900 hover:bg-slate-50 border-l border-slate-200"
    >
      {children}
    </Link>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      
      {/* Top Telemetry Bar (Minimalist Clinical Version) */}
      <div className="hidden border-b border-slate-200 bg-slate-50 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 text-[10px] font-mono tracking-widest text-slate-500 uppercase">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              STATUS: NOMINAL
            </div>
            <span className="text-slate-300">|</span>
            <span>HQ: 2/41 SMALES RD, AUCKLAND</span>
          </div>
          <a
            href="tel:0993903620"
            className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest text-blue-600 hover:text-blue-500 transition-colors uppercase"
          >
            <svg aria-hidden="true" className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
            COMM LINK: [09] 939-0362
          </a>
        </div>
      </div>

      {/* Main Clinical Navigation */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          className="flex h-16 items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            aria-label="Prime Electrical Home"
            className="flex items-center gap-3 group"
          >
            <div className="flex h-10 w-10 items-center justify-center bg-blue-600 transition-colors group-hover:bg-blue-500 rounded-none">
              <svg
                aria-hidden="true"
                className="h-5 w-5 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C13.21 17.89 11 21 11 21z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold text-slate-900 uppercase tracking-tight leading-none group-hover:text-blue-600 transition-colors">
                Prime Electrical
              </span>
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                SYSTEMS & AUTOMATION
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden h-full items-center border-r border-slate-200 md:flex">
            <NavLink href="#services">Architecture</NavLink>
            <NavLink href="#solar">Solar Arrays</NavLink>
            <NavLink href="#smart-home">Automation</NavLink>
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center md:flex ml-6">
            <a
              href="#contact"
              className="inline-flex h-10 items-center justify-center bg-transparent border-b-2 border-blue-600 px-6 font-mono text-xs font-bold uppercase tracking-widest text-slate-900 transition-all hover:bg-slate-50 hover:text-blue-600 rounded-none"
            >
              System Request
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

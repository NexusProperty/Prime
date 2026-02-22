'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { SiteProvider } from '@/lib/site-context'
import type { Site } from '@/lib/site-context'

interface DashboardShellProps {
  children: React.ReactNode
  sites: Site[]
  userEmail: string
}

export default function DashboardShell({ children, sites, userEmail }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <SiteProvider initialSites={sites}>
      <div>
        {/* Mobile sidebar dialog */}
        <Dialog open={sidebarOpen} onClose={() => setSidebarOpen(false)} transition className="relative z-50 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />
          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon className="size-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <Sidebar sites={sites} userEmail={userEmail} />
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
          <Sidebar sites={sites} userEmail={userEmail} />
        </div>

        {/* Main content area */}
        <div className="lg:pl-64">
          <TopBar onMobileMenuOpen={() => setSidebarOpen(true)} />
          <main className="py-8">
            <div className="px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SiteProvider>
  )
}

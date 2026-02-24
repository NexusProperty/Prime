import { type Metadata } from 'next'
import { Inter, Sora } from 'next/font/google'
import clsx from 'clsx'

import '@/styles/tailwind.css'

export const metadata: Metadata = {
  title: 'Mission Control — Demo',
  description: 'Prime Mission Control Dashboard Demo',
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// Sora is used as the display font in place of Mona Sans (self-host Mona Sans for production)
const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sora',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={clsx(
        'h-full antialiased',
        inter.variable,
        sora.variable,
      )}
    >
      <body className="h-full bg-gray-50 dark:bg-zinc-950">
        {children}
      </body>
    </html>
  )
}

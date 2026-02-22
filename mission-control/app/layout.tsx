import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'Mission Control',
  description: 'Central intelligence hub for Prime, AKF, and CleanJet',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-gray-950">
      <body className={`${geist.variable} font-sans h-full antialiased`}>
        {children}
      </body>
    </html>
  )
}

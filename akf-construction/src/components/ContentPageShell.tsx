import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'

interface ContentPageShellProps {
  children: React.ReactNode
  /** Optional JSON-LD schema object(s) - will be rendered as script tags */
  jsonLd?: object | object[]
  /** Optional className for the main content wrapper */
  className?: string
}

export function ContentPageShell({
  children,
  jsonLd,
  className,
}: ContentPageShellProps) {
  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      )}
      <Header />
      <main className={className}>
        <Container className="py-16 sm:py-24">{children}</Container>
      </main>
      <Footer />
    </>
  )
}

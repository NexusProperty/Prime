import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'

export function ContentPageShell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <>
      <Header />
      <main className={className}>
        <Container className="py-16 sm:py-24">{children}</Container>
      </main>
      <Footer />
    </>
  )
}

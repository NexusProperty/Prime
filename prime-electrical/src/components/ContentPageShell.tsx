import { FinancingBanner } from '@/components/FinancingBanner'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { AIInteractiveLayer } from '@/components/AIInteractiveLayer'

export function ContentPageShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <FinancingBanner />
      <Header />
      <main>{children}</main>
      <Footer />
      <AIInteractiveLayer />
    </>
  )
}

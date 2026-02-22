import { type Metadata } from 'next'
import { ContentPageShell } from '@/components/ContentPageShell'
import { Container } from '@/components/Container'

export const metadata: Metadata = {
  title: 'Terms and Conditions | Prime Electrical',
  description:
    'Terms and conditions for use of the Prime Electrical website.',
}

export default function TermsAndConditionsPage() {
  return (
    <ContentPageShell>
      <section className="relative flex min-h-[40vh] items-center overflow-hidden bg-white pt-24 pb-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <Container className="relative">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Terms and Conditions
            </h1>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-slate-600">
              All data on this site is accommodated data purposes just and THE PRIME ELECTRICAL
              LIMITED has put forth sensible attempts to guarantee that data gave on this site is
              precise at the hour of incorporation, anyway there might be unintentional and
              incidental blunders for which THE PRIME ELECTRICAL LIMITED apologizes.
            </p>
            <p className="text-slate-600 mt-6">
              This site might contain connections to sites kept up with by different associations.
              THE PRIME ELECTRICAL LIMITED makes no guarantee or portrayal with respect to the
              exactness (or some other part) of the data on those sites. Connections to different
              sites ought not be understood as a support or suggestion of any data on those sites.
            </p>
            <p className="text-slate-600 mt-6">
              THE PRIME ELECTRICAL LIMITED makes no portrayals or guarantees of any sort about the
              data gave on its site or by means of hypertext joins or some other thing utilized
              either straightforwardly or by implication from THE PRIME ELECTRICAL LIMITED site
              and maintains all authority to make changes and amendments whenever, without notice.
              By getting to this site, you concur that THE PRIME ELECTRICAL LIMITED isn&apos;t
              dependable to you or any outsider for any misfortune experienced regarding the
              utilization of this site (or any of the substance contained thus) including, however
              not restricted to, the transmission of any PC infection.
            </p>

            <h2 className="font-display text-xl font-bold text-slate-900 mt-12">
              Copyright
            </h2>
            <p className="text-slate-600 mt-4">
              THE PRIME ELECTRICAL LIMITED claims copyright in the content of this website and all
              rights are expressly reserved. No part of this website may be reproduced without
              the prior written consent of THE PRIME ELECTRICAL LIMITED.
            </p>
          </div>
        </Container>
      </section>
    </ContentPageShell>
  )
}

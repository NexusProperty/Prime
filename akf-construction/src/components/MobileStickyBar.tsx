// Compatible alternative — not in Salient template natively
// Fixed bottom bar visible only on mobile (sm:hidden)
// Minimum touch target: 44px height enforced via py-4
export function MobileStickyBar({
  phone,
  bookingUrl,
}: {
  phone: string
  bookingUrl: string
}) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex sm:hidden border-t border-slate-200 shadow-lg"
      role="navigation"
      aria-label="Mobile quick actions"
    >
      <a
        href={`tel:${phone}`}
        className="flex flex-1 items-center justify-center gap-2 bg-blue-600 py-4 text-sm font-semibold text-white active:bg-blue-700"
      >
        <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>
        Call Now
      </a>
      <a
        href={bookingUrl}
        className="flex flex-1 items-center justify-center gap-2 bg-slate-900 py-4 text-sm font-semibold text-white active:bg-slate-700"
      >
        <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
        </svg>
        Book Online
      </a>
    </div>
  )
}

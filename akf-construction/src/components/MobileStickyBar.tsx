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
        className="flex flex-1 items-center justify-center gap-2 bg-slate-900 py-4 text-sm font-semibold text-white active:bg-slate-800"
      >
        <span aria-hidden="true">📞</span>
        <span>Call — {phone}</span>
      </a>
      <a
        href={bookingUrl}
        className="flex flex-1 items-center justify-center gap-2 bg-amber-600 py-4 text-sm font-semibold text-white active:bg-amber-700"
      >
        <span aria-hidden="true">📋</span>
        <span>Get a Quote</span>
      </a>
    </div>
  )
}

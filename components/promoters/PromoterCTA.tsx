import Link from 'next/link';

export function PromoterCTA() {
  return (
    <section className="mt-20 overflow-hidden rounded-3xl bg-neutral-900 px-8 py-12 text-white md:px-14 md:py-16">
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div className="max-w-xl">
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">
            RUN A NIGHT?
          </h2>
          <p className="mt-3 text-base text-neutral-300">
            Sell tickets, track sales, get paid per ticket. No monthly fee.
            Set up in under five minutes.
          </p>
          <ul className="mt-4 flex flex-wrap gap-4 text-sm text-neutral-300">
            <li>âœ“ Own your audience</li>
            <li>âœ“ Instant payouts</li>
            <li>âœ“ Zero platform fee on the first 100 tickets</li>
          </ul>
        </div>
        <Link
          href="/promoters/apply"
          className="rounded-full bg-white dark:bg-gray-900 px-7 py-3 text-sm font-semibold text-black dark:text-white transition hover:bg-neutral-100"
        >
          Start free â†’
        </Link>
      </div>
    </section>
  );
}

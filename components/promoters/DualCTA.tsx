import Link from 'next/link';

export function DualCTA() {
  return (
    <section className="mt-20 grid gap-5 md:grid-cols-2">
      <div className="flex flex-col justify-between rounded-3xl border border-neutral-200 bg-white p-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            For fans
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
            FIND YOUR NEXT NIGHT OUT.
          </h2>
          <p className="mt-3 text-base text-neutral-600">
            Browse 40+ events from verified promoters this weekend.
            Buy directly — no queue, no booking fee surprises.
          </p>
        </div>
        <Link href="#promoters"
          className="mt-8 inline-flex w-fit rounded-full bg-black px-7 py-3 text-sm font-semibold text-white hover:bg-neutral-800">
          Browse events →
        </Link>
      </div>

      <div className="flex flex-col justify-between rounded-3xl bg-neutral-900 p-10 text-white">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            For promoters
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
            RUN A NIGHT ON GRID.
          </h2>
          <p className="mt-3 text-base text-neutral-300">
            Find the venue, book the lineup, fill the room, get paid next
            morning. 3% per ticket. No monthly fee.
          </p>

          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-300">
            <li>✓ 400+ venues</li>
            <li>✓ Same-day payouts</li>
            <li>✓ Affiliate codes</li>
          </ul>
        </div>
        <Link href="/promoters/apply"
          className="mt-8 inline-flex w-fit rounded-full bg-white px-7 py-3 text-sm font-semibold text-black hover:bg-neutral-100">
          Start free →
        </Link>
      </div>
    </section>
  );
}
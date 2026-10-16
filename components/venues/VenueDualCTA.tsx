import Link from 'next/link';

export function VenueDualCTA() {
  return (
    <section className="mt-20 grid gap-5 md:grid-cols-2">
      <div className="flex flex-col justify-between rounded-3xl border border-neutral-200 bg-white p-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">For promoters, bands &amp; DJs</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
            BOOK A VENUE.
          </h2>
          <p className="mt-3 text-base text-neutral-600">
            Browse 21 venues across 5 cities. Filter by capacity, deal type,
            tech, and price. Book directly, pay a deposit, sign the contract.
          </p>
        </div>
        <Link href="#venues"
          className="mt-8 inline-flex w-fit rounded-full bg-black px-7 py-3 text-sm font-semibold text-white hover:bg-neutral-800">
          Browse venues →
        </Link>
      </div>
      <div className="flex flex-col justify-between rounded-3xl bg-neutral-900 p-10 text-white">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">For venues</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
            FILL YOUR NIGHTS.
          </h2>
          <p className="mt-3 text-base text-neutral-300">
            Publish your calendar, receive vetted offers, collect deposits
            automatically. 3% per booking. No monthly fee.
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-300">
            <li>✓ Auto deposits</li>
            <li>✓ Two-way reviews</li>
            <li>✓ Bar split tracking</li>
          </ul>
        </div>
        <Link href="/venues/apply"
          className="mt-8 inline-flex w-fit rounded-full bg-white px-7 py-3 text-sm font-semibold text-black hover:bg-neutral-100">
          List your venue →
        </Link>
      </div>
    </section>
  );
}
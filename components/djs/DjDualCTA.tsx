import Link from 'next/link';

export function DjDualCTA() {
  return (
    <section className="mt-20 grid gap-5 md:grid-cols-2">
      <div className="flex flex-col justify-between rounded-3xl border border-neutral-200 bg-white p-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">For promoters &amp; bookers</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
            BOOK YOUR NEXT SET.
          </h2>
          <p className="mt-3 text-base text-neutral-600">
            Browse 187 DJs across 7 cities. Filter by genre, tier, draw, and
            fee. Book directly, pay a deposit, sign the contract.
          </p>
        </div>
        <Link href="#djs"
          className="mt-8 inline-flex w-fit rounded-full bg-black px-7 py-3 text-sm font-semibold text-white hover:bg-neutral-800">
          Browse DJs →
        </Link>
      </div>
      <div className="flex flex-col justify-between rounded-3xl bg-neutral-900 p-10 text-white">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">For DJs</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
            GET BOOKED.
          </h2>
          <p className="mt-3 text-base text-neutral-300">
            List yourself, set your fee, get deposits upfront, get paid same
            day. 3% per booking. No monthly fee.
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-300">
            <li>✓ Set your rate card</li>
            <li>✓ Deposit protection</li>
            <li>✓ Auto splits</li>
          </ul>
        </div>
        <Link href="/djs/apply"
          className="mt-8 inline-flex w-fit rounded-full bg-white px-7 py-3 text-sm font-semibold text-black hover:bg-neutral-100">
          Start booking →
        </Link>
      </div>
    </section>
  );
}
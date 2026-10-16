import Link from 'next/link';

export function ProducerDualCTA() {
  return (
    <section className="mt-20 grid gap-5 md:grid-cols-2">
      <div className="flex flex-col justify-between rounded-3xl border border-neutral-200 bg-white p-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">For listeners</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
            FIND YOUR NEXT BEAT.
          </h2>
          <p className="mt-3 text-base text-neutral-600">
            Browse 187 beats from verified producers. Preview before you buy,
            license in three clicks.
          </p>
        </div>
        <Link href="#producers"
          className="mt-8 inline-flex w-fit rounded-full bg-black px-7 py-3 text-sm font-semibold text-white hover:bg-neutral-800">
          Browse producers →
        </Link>
      </div>
      <div className="flex flex-col justify-between rounded-3xl bg-neutral-900 p-10 text-white">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">For producers</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
            SELL YOUR CATALOGUE.
          </h2>
          <p className="mt-3 text-base text-neutral-300">
            List your beats, get sync briefs, sell direct, get paid the same
            day. 3% per sale. No monthly fee.
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-300">
            <li>✓ 6,400+ beats live</li>
            <li>✓ Sync pipeline</li>
            <li>✓ Auto contracts</li>
          </ul>
        </div>
        <Link href="/producers/apply"
          className="mt-8 inline-flex w-fit rounded-full bg-white px-7 py-3 text-sm font-semibold text-black hover:bg-neutral-100">
          Start selling →
        </Link>
      </div>
    </section>
  );
}
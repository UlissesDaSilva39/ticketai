import Link from 'next/link';

export function VocalistDualCTA() {
  return (
    <section className="mt-20 grid gap-5 md:grid-cols-2">
      <div className="flex flex-col justify-between rounded-3xl border border-neutral-200 bg-white p-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">For listeners</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
            FIND YOUR NEXT VOICE.
          </h2>
          <p className="mt-3 text-base text-neutral-600">
            Browse 187 vocalists from verified artists. Preview before you book,
            license in three clicks.
          </p>
        </div>
        <Link href="#vocalists"
          className="mt-8 inline-flex w-fit rounded-full bg-black px-7 py-3 text-sm font-semibold text-white hover:bg-neutral-800">
          Browse vocalists →
        </Link>
      </div>
      <div className="flex flex-col justify-between rounded-3xl bg-neutral-900 p-10 text-white">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">For vocalists</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
            GET BOOKED.
          </h2>
          <p className="mt-3 text-base text-neutral-300">
            List your demos, get sync briefs, book sessions, get paid same day.
            3% per booking. No monthly fee.
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-300">
            <li>✓ 6,400+ demos live</li>
            <li>✓ Sync pipeline</li>
            <li>✓ Auto contracts</li>
          </ul>
        </div>
        <Link href="/vocalists/apply"
          className="mt-8 inline-flex w-fit rounded-full bg-white px-7 py-3 text-sm font-semibold text-black hover:bg-neutral-100">
          Start booking →
        </Link>
      </div>
    </section>
  );
}
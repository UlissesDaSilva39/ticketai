import Link from 'next/link';

export function VocalistHero() {
  return (
    <section className="pt-16 pb-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        Vocalists
      </p>
      <h1 className="mt-4 text-[88px] leading-[0.95] font-black tracking-tight">
        VOCALISTS
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-neutral-700">
        Discover the voices behind the records you love — or book sessions,
        sell features, and get paid the same day.
      </p>
      <p className="mt-2 max-w-2xl text-base text-neutral-500">
        From session singers in Manchester to chart-topping topliners in
        Berlin. Stream previews, book sessions directly, and license vocals —
        or use GRID to reach producers, sell features, and get paid on every
        booking.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link href="#vocalists"
          className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800">
          Browse vocalists
          <span aria-hidden>→</span>
        </Link>
        <Link href="/vocalists/apply"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:border-neutral-900">
          Get booked on GRID
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
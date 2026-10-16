import Link from 'next/link';

export function PromoterHero() {
  return (
    <section className="pt-16 pb-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        Promoters
      </p>

      <h1 className="mt-4 text-[88px] leading-[0.95] font-black tracking-tight">
        PROMOTERS
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-neutral-700">
        Discover the promoters behind the UK&apos;s best nights out — or run
        your own, end to end.
      </p>
      <p className="mt-2 max-w-2xl text-base text-neutral-500">
        From underground warehouse parties in Berlin to intimate jazz in
        London. Find your next event and buy tickets directly, or use GRID to
        book a venue, fill the room, and get paid the same day.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          href="#promoters"
          className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Browse events by promoter
          <span aria-hidden>→</span>
        </Link>

        <Link
          href="/promoters/apply"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:border-neutral-900"
        >
          Run a night on GRID
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
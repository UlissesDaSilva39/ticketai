import Link from 'next/link';

export function BandHero() {
  return (
    <section className="pt-16 pb-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        Bands
      </p>
      <h1 className="mt-4 text-[88px] leading-[0.95] font-black tracking-tight">
        BANDS
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-neutral-700">
        Discover the bands behind the nights you&apos;ll never forget — or book
        gigs, sell tickets, and get paid the same day.
      </p>
      <p className="mt-2 max-w-2xl text-base text-neutral-500">
        From DIY punk trios in Bristol to arena-ready acts in London. Stream
        tracks, buy tickets, and grab merch directly — or use GRID to find
        venues, fill the room, and get paid on every ticket and shirt sold.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link href="#bands"
          className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800">
          Browse bands
          <span aria-hidden>→</span>
        </Link>
        <Link href="/bands/apply"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:border-neutral-900">
          Book gigs on GRID
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
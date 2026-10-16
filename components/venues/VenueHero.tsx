import Link from 'next/link';

export function VenueHero() {
  return (
    <section className="pt-16 pb-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        Venues
      </p>
      <h1 className="mt-4 text-[88px] leading-[0.95] font-black tracking-tight">
        VENUES
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-neutral-700">
        Discover the rooms behind the nights you&apos;ll never forget — or
        list your venue, fill empty nights, and get paid the same day.
      </p>
      <p className="mt-2 max-w-2xl text-base text-neutral-500">
        From 100-cap basement clubs in Manchester to 3,000-cap warehouses in
        Berlin. Real-time availability, transparent deal terms, and instant
        booking — for promoters, bands, and DJs on both sides of the deal.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link href="#venues"
          className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800">
          Browse venues
          <span aria-hidden>→</span>
        </Link>
        <Link href="/venues/apply"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:border-neutral-900">
          List your venue
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
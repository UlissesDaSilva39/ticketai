import Link from 'next/link';

export function DjHero() {
  return (
    <section className="pt-16 pb-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        DJs
      </p>
      <h1 className="mt-4 text-[88px] leading-[0.95] font-black tracking-tight">
        DJS
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-neutral-700">
        Discover the DJs behind the sets you&apos;ll never forget — or get
        booked for gigs, sell tickets, and get paid the same day.
      </p>
      <p className="mt-2 max-w-2xl text-base text-neutral-500">
        From bedroom selectors in Manchester to international headliners in
        Berlin. Stream mixes, book sets directly, pay deposits — or use GRID
        to get booked, set your fee, and get paid on every gig.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link href="#djs"
          className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800">
          Browse DJs
          <span aria-hidden>→</span>
        </Link>
        <Link href="/djs/apply"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:border-neutral-900">
          Get booked on GRID
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
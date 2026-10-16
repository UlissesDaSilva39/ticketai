import Link from 'next/link';

export function ProducerHero() {
  return (
    <section className="pt-16 pb-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        Producers
      </p>
      <h1 className="mt-4 text-[88px] leading-[0.95] font-black tracking-tight">
        PRODUCERS
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-neutral-700">
        Discover the producers behind the records you love — or sell your own
        beats, land placements, and get paid the same day.
      </p>
      <p className="mt-2 max-w-2xl text-base text-neutral-500">
        From bedroom beatmakers in Manchester to chart-topping producers in
        Berlin. Stream previews, license beats, and book sessions directly — or
        use GRID to reach labels, sell your catalogue, and get paid on every
        sale.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link href="#producers"
          className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800">
          Browse producers
          <span aria-hidden>→</span>
        </Link>
        <Link href="/producers/apply"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:border-neutral-900">
          Sell beats on GRID
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
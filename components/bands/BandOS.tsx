const PILLARS = [
  { tag: '01 · BOOKINGS', title: 'Find venues, festivals, and private events',
    body: 'Real-time availability across 400+ venues in the UK and EU. Filter by capacity, curfew, tech spec, and fee. Book a venue in three clicks.',
    cta: 'Book a venue →', href: '/venues' },
  { tag: '02 · LINEUP', title: 'Find support slots and touring partners',
    body: 'Search by genre, city, draw size, and availability. Send offers directly and manage the whole lineup in one dashboard.',
    cta: 'Find bands →', href: '/bands' },
  { tag: '03 · SALES', title: 'Sell tickets, merch, and vinyl direct',
    body: 'Built-in checkout, presales, promo codes, affiliate links, and automatic contracts. No DICE, no Shopify, no middlemen.',
    cta: 'See pricing →', href: '/pricing' },
  { tag: '04 · MONEY', title: 'Get paid the same day',
    body: '3% per sale, no monthly fee. Payouts land the morning after the show. Split revenue with band members, manager, and agents automatically.',
    cta: 'See how splits work →', href: '/how-it-works#splits' },
];

export function BandOS() {
  return (
    <section className="border-t border-neutral-200 py-20">
      <div className="mb-12 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          The GRID band OS
        </p>
        <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
          Everything you need to book a gig, sell tickets and merch, and get paid — in one place.
        </h2>
        <p className="mt-4 text-lg text-neutral-600">
          Stop duct-taping DICE, Bandsintown, Shopify, Bandcamp, Linktree, and
          a group chat full of unpaid invoices. GRID runs the whole pipeline.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {PILLARS.map((p) => (
          <article key={p.tag}
            className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-7 transition hover:border-neutral-900">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">{p.tag}</p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight">{p.title}</h3>
              <p className="mt-3 text-base text-neutral-600">{p.body}</p>
            </div>
            <a href={p.href}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-black underline-offset-4 hover:underline">
              {p.cta}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
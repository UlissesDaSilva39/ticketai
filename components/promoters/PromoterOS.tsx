const PILLARS = [
  { tag: '01 · SUPPLY', title: 'Find and book venues',
    body: 'Real-time availability across 400+ rooms in the UK and EU. Filter by capacity, curfew, tech spec, and cost. Message the venue manager directly.',
    cta: 'Browse venues →', href: '/venues' },
  { tag: '02 · TALENT', title: 'Book artists in minutes',
    body: 'Search by genre, fee range, and availability. See who is already playing your city that weekend and stack lineups that sell.',
    cta: 'Find artists →', href: '/artists' },
  { tag: '03 · DEMAND', title: 'Sell tickets and fill the room',
    body: 'Built-in checkout, promo codes, affiliate links, and a distribution engine that pushes your event to fans already searching in your city.',
    cta: 'See how distribution works →', href: '/how-it-works' },
  { tag: '04 · MONEY', title: 'Get paid the same day',
    body: '3% per ticket, no monthly fee. Payouts land the morning after the event. Split revenue with artists and venues automatically.',
    cta: 'See pricing →', href: '/pricing' },
];

export function PromoterOS() {
  return (
    <section className="border-t border-neutral-200 py-20">
      <div className="mb-12 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          The GRID promoter OS
        </p>
        <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
          Everything you need to run a night — in one place.
        </h2>
        <p className="mt-4 text-lg text-neutral-600">
          Stop duct-taping Eventbrite, Instagram DMs, spreadsheets, and a
          payments provider. GRID runs the whole pipeline.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {PILLARS.map((p) => (
          <article key={p.tag}
            className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-7 transition hover:border-neutral-900">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
                {p.tag}
              </p>
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
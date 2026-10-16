const PILLARS = [
  { tag: '01 · AVAILABILITY', title: 'Publish your calendar, take bookings 24/7',
    body: 'Real-time calendar sync. Set recurring slots, blackout dates, and day-rate overrides in one dashboard.',
    cta: 'Manage calendar →', href: '/venues/calendar' },
  { tag: '02 · BOOKINGS', title: 'Receive offers from vetted promoters, bands, and DJs',
    body: 'Auto-match to your genre and capacity. Approve, counter, or decline in one click. No more DM-chasing.',
    cta: 'Review offers →', href: '/venues/offers' },
  { tag: '03 · TECH', title: 'Publish tech spec, riders, and capacity',
    body: 'PA, lights, backline, monitors, engineer, curfew, load-in times. Everything a promoter needs to book with confidence.',
    cta: 'Manage tech spec →', href: '/venues/tech' },
  { tag: '04 · MONEY', title: 'Get paid on time, every time',
    body: '3% per booking, no monthly fee. Deposits auto-collected, released 24h before doors. No-shows forfeit. Split revenue with bar and kitchen auto.',
    cta: 'See how deposits work →', href: '/how-it-works#deposits' },
];

export function VenueOS() {
  return (
    <section className="border-t border-neutral-200 py-20">
      <div className="mb-12 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          The GRID venue OS
        </p>
        <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
          Everything you need to fill empty nights, get paid on time, and never chase a deposit again.
        </h2>
        <p className="mt-4 text-lg text-neutral-600">
          Stop juggling spreadsheets of availabilities, DMs from promoters,
          contract PDFs, and chasing deposits. GRID runs the whole pipeline.
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
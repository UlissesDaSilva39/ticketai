const PILLARS = [
  { tag: '01 · BOOKINGS', title: 'Get booked for clubs, festivals, private events',
    body: 'Real-time availability across 400+ venues. Filter by capacity, set time, and fee. Book directly or send offers.',
    cta: 'See how booking works →', href: '/how-it-works' },
  { tag: '02 · MIXES', title: 'Publish mixes, edits, and IDs',
    body: 'Streaming previews that convert to bookings. Curated drops that push your mix to promoters and labels already searching your style.',
    cta: 'Publish a mix →', href: '/mixcloud' },
  { tag: '03 · RESIDENCIES', title: 'Land regular club slots and monthly nights',
    body: 'Venue residency board showing open slots across 400+ venues. Apply with one click, negotiate terms, sign contracts in-app.',
    cta: 'Browse residencies →', href: '/residencies' },
  { tag: '04 · MONEY', title: 'Set your fee, get paid same day',
    body: '3% per booking, no monthly fee. Payouts land the morning after the set. Split revenue with agents, managers, and collaborators automatically.',
    cta: 'See how splits work →', href: '/how-it-works#splits' },
];

export function DjOS() {
  return (
    <section className="border-t border-neutral-200 py-20">
      <div className="mb-12 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          The GRID DJ OS
        </p>
        <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
          Everything you need to get booked, sell mixes, and get paid — in one place.
        </h2>
        <p className="mt-4 text-lg text-neutral-600">
          Stop juggling Instagram DMs, Linktree, Dropbox, PayPal, and a
          spreadsheet of unpaid gigs. GRID runs the whole pipeline.
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
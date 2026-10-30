const PILLARS = [
  { tag: '01 Â· REACH', title: 'Get your tracks heard',
    body: 'Streaming previews that convert to bookings. Curated drops that push your profile to A&Rs, producers, and labels already searching your style.',
    cta: 'See how reach works â†’', href: '/how-it-works' },
  { tag: '02 Â· SESSIONS', title: 'Find producers, studios, and collaborators',
    body: 'Search by city, genre, key, and budget. Book sessions through GRID or message to collaborate async.',
    cta: 'Find sessions â†’', href: '/producers' },
  { tag: '03 Â· FEATURES', title: 'Sell features, hooks, and verses',
    body: 'Built-in checkout, licensing tiers (hook, verse, exclusive), affiliate codes, and automatic contracts. No middlemen.',
    cta: 'See pricing â†’', href: '/pricing' },
  { tag: '04 Â· MONEY', title: 'Get paid the same day',
    body: '3% per booking, no monthly fee. Payouts land the morning after the session. Split revenue with producers and writers automatically.',
    cta: 'See how splits work â†’', href: '/how-it-works#splits' },
];

export function ArtistOS() {
  return (
    <section className="border-t border-neutral-200 py-20">
      <div className="mb-12 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          The GRID artist OS
        </p>
        <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
          Everything you need to get booked, sell features, and get paid â€” in one place.
        </h2>
        <p className="mt-4 text-lg text-neutral-600">
          Stop juggling Instagram DMs, SoundCloud, Dropbox, PayPal, and a
          spreadsheet of unpaid features. GRID runs the whole pipeline.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {PILLARS.map((p) => (
          <article key={p.tag}
            className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white dark:bg-gray-900 p-7 transition hover:border-neutral-900">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">{p.tag}</p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight">{p.title}</h3>
              <p className="mt-3 text-base text-neutral-600">{p.body}</p>
            </div>
            <a href={p.href}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-black dark:text-white underline-offset-4 hover:underline">
              {p.cta}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

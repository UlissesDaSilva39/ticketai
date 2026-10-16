export function VenueWorkspacePreview() {
  return (
    <section className="border-t border-neutral-200 py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Your dashboard</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            One screen. Every booking. Every promoter.
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            Live calendar, offer queue, deal terms, capacity chart, and payout
            schedule — updated in real time.
          </p>
          <ul className="mt-6 space-y-3 text-base text-neutral-700">
            <li>✓ Live calendar &amp; offer queue</li>
            <li>✓ Deal terms (flat / bar split / door)</li>
            <li>✓ Capacity chart per event</li>
            <li>✓ Tech spec + rider archive</li>
            <li>✓ Two-way reviews (promoters)</li>
            <li>✓ Post-season revenue report</li>
            <li>✓ CSV / PDF export</li>
          </ul>
          <a href="/venues/apply"
            className="mt-8 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800">
            Open your dashboard →
          </a>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl">
          <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-neutral-100">
            <img src="/img/venue-dashboard.png"
              alt="GRID venue dashboard showing live calendar, offer queue, and payout schedule"
              className="h-full w-full object-cover" />
          </div>
          <div className="mt-3 flex items-center gap-2 px-1 pb-1">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="ml-auto text-xs text-neutral-400">grid.app / venue / dashboard</span>
          </div>
        </div>
      </div>
    </section>
  );
}
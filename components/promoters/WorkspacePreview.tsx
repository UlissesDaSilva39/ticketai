export function WorkspacePreview() {
  return (
    <section className="border-t border-neutral-200 py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Your dashboard
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            One screen. Every ticket. Every fan.
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            Live sales, tier breakdown, city map of buyers, affiliate leaderboard,
            and payout schedule — updated in real time.
          </p>

          <ul className="mt-6 space-y-3 text-base text-neutral-700">
            <li>✓ Live sales &amp; door check-in</li>
            <li>✓ Fan list &amp; repeat-buyer flags</li>
            <li>✓ Affiliate payout tracker</li>
            <li>✓ Post-event revenue report</li>
            <li>✓ CSV / PDF export</li>
          </ul>

          <a href="/promoters/apply"
            className="mt-8 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800">
            Open your dashboard →
          </a>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl">
          <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-neutral-100">
            <img src="/img/promoter-dashboard.png"
              alt="GRID promoter dashboard showing live ticket sales, fan map, and payout schedule"
              className="h-full w-full object-cover" />
          </div>
          <div className="mt-3 flex items-center gap-2 px-1 pb-1">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="ml-auto text-xs text-neutral-400">
              grid.app / promoter / dashboard
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
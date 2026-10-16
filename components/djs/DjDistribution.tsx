const CHANNELS = [
  { icon: '🎧', title: 'Playlists', body: 'Your mixes appear in GRID editorial and streaming partner playlists.',          metric: '46% of GRID gigs' },
  { icon: '📻', title: 'Radio',     body: 'Auto-pitched to BBC Radio 1, Rinse FM, NTS, and community stations.',          metric: 'Avg. 3 spins/mo' },
  { icon: '📺', title: 'Sync',      body: 'Sync pitch to supervisors when a brief matches your style.',                   metric: 'Avg. 1 brief/mo' },
  { icon: '💌', title: 'Fan CRM',   body: 'Export followers, retarget them, turn one gig into a club residency.',         metric: '41% repeat rate' },
];

export function DjDistribution() {
  return (
    <section className="border-t border-neutral-200 py-20">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Distribution</p>
        <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
          We don&apos;t just host mixes. We get them heard.
        </h2>
        <p className="mt-4 text-lg text-neutral-600">
          Every DJ on GRID gets pushed through four channels — playlists,
          radio, sync, and your own fan list.
        </p>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {CHANNELS.map((c) => (
          <div key={c.title} className="rounded-2xl border border-neutral-200 bg-white p-6">
            <span className="text-2xl" aria-hidden>{c.icon}</span>
            <h3 className="mt-3 text-lg font-bold">{c.title}</h3>
            <p className="mt-2 text-sm text-neutral-600">{c.body}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-emerald-700">{c.metric}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
const CHANNELS = [
  { icon: '🎤', title: 'A&R',       body: 'Your demo appears in label A&R and producer searches by genre + role.',       metric: '34% of GRID shows' },
  { icon: '📺', title: 'Sync',      body: 'Auto-pitched to sync supervisors when a brief matches your vocal style.',   metric: 'Avg. 3 briefs/mo' },
  { icon: '🎧', title: 'Playlists', body: 'Curated placements in GRID editorial and streaming partner playlists.',        metric: '2.2× stream lift' },
  { icon: '💌', title: 'Fan CRM',   body: 'Export followers, retarget them, turn one session into a repeat client.',     metric: '29% repeat booking' },
];

export function ArtistDistribution() {
  return (
    <section className="border-t border-neutral-200 py-20">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Distribution</p>
        <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
          We don&apos;t just host demos. We get them heard.
        </h2>
        <p className="mt-4 text-lg text-neutral-600">
          Every artist on GRID gets pushed through four channels — A&R, sync,
          playlists, and your own fan list.
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
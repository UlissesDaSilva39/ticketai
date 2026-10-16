const CHANNELS = [
  { icon: '🔍', title: 'Search',       body: 'Your beat appears when artists search by genre + BPM + key.', metric: '38% of GRID sales' },
  { icon: '📺', title: 'Sync pitches', body: 'Auto-pitched to sync supervisors and label A&Rs when a brief matches.', metric: 'Avg. 4 briefs/mo' },
  { icon: '🎧', title: 'Playlists',    body: 'Curated placements in GRID editorial and streaming partner playlists.', metric: '2.1× stream lift' },
  { icon: '💌', title: 'Fan CRM',      body: 'Export buyers, retarget them, turn one sale into a repeat customer.', metric: '27% repeat rate' },
];

export function ProducerDistribution() {
  return (
    <section className="border-t border-neutral-200 py-20">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Distribution</p>
        <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
          We don&apos;t just host beats. We get them heard.
        </h2>
        <p className="mt-4 text-lg text-neutral-600">
          Every beat on GRID gets pushed through four channels — search, sync,
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
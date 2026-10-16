const CHANNELS = [
  { icon: '🔍', title: 'Search',
    body: 'Your event appears the moment fans search your city + genre + date.',
    metric: '44% of GRID ticket sales' },
  { icon: '📱', title: 'Social pushes',
    body: 'Auto-generated posts, reels, and story templates tuned to your event.',
    metric: '2.4× avg. reach lift' },
  { icon: '🎟️', title: 'Affiliate codes',
    body: 'Give every DJ, artist, and friend a unique code. They get paid per ticket sold.',
    metric: 'Up to 30% of sales' },
  { icon: '💌', title: 'Fan CRM',
    body: 'Export your buyers, retarget them, and turn one night into a residency.',
    metric: '38% repeat rate' },
];

export function Distribution() {
  return (
    <section className="border-t border-neutral-200 py-20">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Distribution
        </p>
        <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
          We don&apos;t just sell tickets. We fill the room.
        </h2>
        <p className="mt-4 text-lg text-neutral-600">
          Every event on GRID gets pushed through four channels — search,
          social, affiliates, and your own fan list.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {CHANNELS.map((c) => (
          <div key={c.title} className="rounded-2xl border border-neutral-200 bg-white p-6">
            <span className="text-2xl" aria-hidden>{c.icon}</span>
            <h3 className="mt-3 text-lg font-bold">{c.title}</h3>
            <p className="mt-2 text-sm text-neutral-600">{c.body}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              {c.metric}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
const CHANNELS = [
  { icon: '🎤', title: 'Promoters',  body: 'Your venue appears to verified promoters already booking your city.',  metric: '38% of GRID bookings' },
  { icon: '🎸', title: 'Artists',    body: 'Touring acts and bands searching your city and size.',                   metric: '42% of GRID gigs' },
  { icon: '🎪', title: 'Festivals',  body: 'Festival organizers searching for warm-up venues in your city.',        metric: 'Avg. 2 inquiries' },
  { icon: '💌', title: 'Fan CRM',    body: 'Export past promoters, retarget them, turn one booking into a season.', metric: '47% repeat rate' },
];

export function VenueDistribution() {
  return (
    <section className="border-t border-neutral-200 py-20">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Distribution</p>
        <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
          We don&apos;t just list venues. We fill your empty nights.
        </h2>
        <p className="mt-4 text-lg text-neutral-600">
          Every venue on GRID gets pushed through four channels — promoters,
          artists, festivals, and your own CRM.
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
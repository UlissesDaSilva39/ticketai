const LOGOS = ['Village Underground', 'Printworks', 'Fabric', 'Motion', 'YES', 'Brudenell'];

const TESTIMONIALS = [
  { quote: 'Sold our last tour through GRID. No booking fees, no resellers.',
    name: 'The Static Frames', role: 'Post-punk · London', stat: '£18k tour revenue' },
  { quote: 'Three festivals booked through GRID in one season. No middlemen.',
    name: 'Ghost Signals', role: 'Indie · Manchester', stat: '3 festival slots' },
  { quote: 'First tour where we actually made money. The splits tool saved us.',
    name: 'Northern Lights', role: 'Folk · Leeds', stat: '£6,400 saved' },
];

export function BandProof() {
  return (
    <section className="border-t border-neutral-200 py-20">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Trusted by</p>
      <div className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-4">
        {LOGOS.map((l) => (
          <span key={l} className="text-xl font-black tracking-tight text-neutral-400">{l}</span>
        ))}
      </div>
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure key={t.name}
            className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6">
            <blockquote className="text-base text-neutral-800">&ldquo;{t.quote}&rdquo;</blockquote>
            <figcaption className="mt-6">
              <p className="text-sm font-semibold">{t.name}</p>
              <p className="text-xs text-neutral-500">{t.role}</p>
              <p className="mt-3 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {t.stat}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
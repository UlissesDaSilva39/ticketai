const LOGOS = ['Beggars', 'AWAL', 'Ninja Tune', '!K7', 'Secretly', 'Domino'];

const TESTIMONIALS = [
  { quote: 'Moved my whole catalogue to GRID. Cut my platform fees by 60%.',
    name: 'Marcus K.', role: 'Producer · London', stat: '£8,400 saved' },
  { quote: 'Two sync briefs came through in the first week. Landed one on a Netflix doc series.',
    name: 'Ilona B.', role: 'Producer · Berlin', stat: '£12k sync payout' },
  { quote: 'My first £1k in a month from GRID. No cold DMs, no BeatStars fees, just sales.',
    name: 'Priya S.', role: 'Producer · Manchester', stat: '£1,200 / month' },
];

export function ProducerProof() {
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
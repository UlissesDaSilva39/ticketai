const LOGOS = ['Village Underground', 'Fabric', 'Motion', 'Hidden', 'YES', 'Brudenell'];

const TESTIMONIALS = [
  { quote: 'Moved our whole calendar to GRID. Cut admin time by 60%.',
    name: 'Village Underground', role: 'Warehouse · London', stat: '£18k saved in admin' },
  { quote: 'Filled 12 off-peak nights in three months. Deposits always collected.',
    name: 'Hidden', role: 'Club · Manchester', stat: '12 nights filled' },
  { quote: 'First season where we actually made money. The bar split auto-calculated.',
    name: 'Motion', role: 'Club · Bristol', stat: '£24k this season' },
];

export function VenueProof() {
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
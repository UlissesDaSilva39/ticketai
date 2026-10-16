const STATS = [
  { k: '0%',  label: 'Upfront cost',    sub: 'Free to list. Free to sell.' },
  { k: '3%',  label: 'Per ticket sold', sub: 'Only when you make money.' },
  { k: 'T+1', label: 'Payout speed',    sub: 'Money lands the next morning.' },
  { k: '0',   label: 'Monthly fee',     sub: 'No subscription. Ever.' },
];

export function Economics() {
  return (
    <section className="border-y border-neutral-200 bg-neutral-50 py-14">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label}>
            <p className="text-4xl font-black tracking-tight md:text-5xl">{s.k}</p>
            <p className="mt-2 text-sm font-semibold">{s.label}</p>
            <p className="mt-1 text-sm text-neutral-500">{s.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
const CARDS = [
  { icon: '🔒', title: 'Secure payment',
    body: 'Funds held until 24h before delivery, then released. No more PayPal chasing.' },
  { icon: '📝', title: 'Auto contracts',
    body: 'Every booking generates a contract with split terms. No more "who owns what" disputes.' },
  { icon: '💸', title: 'Same-day payouts',
    body: 'Money lands the morning after completion. No more chasing invoices.' },
];

export function WhyGridBlock() {
  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        Why book through GRID
      </h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {CARDS.map((c) => (
          <div key={c.title} className="rounded-2xl border border-neutral-200 bg-white p-5">
            <span className="text-2xl" aria-hidden>{c.icon}</span>
            <h3 className="mt-3 text-sm font-bold">{c.title}</h3>
            <p className="mt-2 text-xs text-neutral-600 leading-relaxed">{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
const QA = [
  { q: 'What does GRID cost?',
    a: '3% per booking. No monthly fee, no listing cost, no hidden charges. If you don\u2019t work, you don\u2019t pay.' },
  { q: 'Do I keep my own bookings and network?',
    a: 'Yes. GRID is non-exclusive. Keep your existing promoters, agents, and direct bookings. Use GRID for new bookings, contracts, deposits, and payment.' },
  { q: 'How does the fee negotiation work?',
    a: 'Set your rate card — peak night rate, off-peak, travel radius, deposit percentage. Promoters see your transparent rate and can send an offer. You accept, counter, or decline.' },
  { q: 'How do deposits work?',
    a: 'Promoters pay a deposit through GRID at booking confirmation. Funds are held until 24h before the set, then released automatically. Cancellations within 24h forfeit the deposit per your rate card terms.' },
  { q: 'Can I still play with my current agency?',
    a: 'Yes. GRID handles new bookings end-to-end, and can act as a payment/contract layer for agency bookings too. Agents get their percentage automatically via splits.' },
  { q: 'What if a promoter cancels?',
    a: 'Automatic deposit forfeiture per your rate card. We flag the promoter in your history so you know before you book again. No-shows are logged and reported.' },
];

export function DjFaq() {
  return (
    <section className="border-t border-neutral-200 py-20">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">DJ FAQ</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Answers, not asterisks.</h2>
        </div>
        <dl className="divide-y divide-neutral-200">
          {QA.map((item) => (
            <div key={item.q} className="py-6">
              <dt className="text-lg font-semibold">{item.q}</dt>
              <dd className="mt-2 text-base text-neutral-600">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
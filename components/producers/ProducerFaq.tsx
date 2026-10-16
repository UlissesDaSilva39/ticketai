const QA = [
  { q: 'What does GRID cost?',
    a: '3% per sale. No monthly fee, no listing cost, no hidden charges. If you don\u2019t sell, you don\u2019t pay.' },
  { q: 'Who owns the beat after a sale?',
    a: 'You do — until a customer buys an exclusive. Lease sales keep you as the owner; exclusive sales transfer rights per the contract we generate automatically.' },
  { q: 'Can I sell on BeatStars / Bandcamp at the same time?',
    a: 'Yes. GRID is non-exclusive. Sell everywhere. We just handle the delivery, contract, and payout.' },
  { q: 'How do splits work?',
    a: 'Add collaborators by email. We route their percentage automatically on every sale — no manual PayPal chase.' },
  { q: 'How do sync pitches work?',
    a: 'Match your catalogue to open briefs from labels, agencies, and supervisors. Pitch in one click. We track the pipeline.' },
  { q: 'What if someone samples my beat without a license?',
    a: 'Content-ID monitoring across streaming platforms. We flag matches and help you file claims automatically.' },
];

export function ProducerFaq() {
  return (
    <section className="border-t border-neutral-200 py-20">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Producer FAQ</p>
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
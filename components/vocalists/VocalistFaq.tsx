const QA = [
  { q: 'What does GRID cost?',
    a: '3% per booking. No monthly fee, no listing cost, no hidden charges. If you don\u2019t work, you don\u2019t pay.' },
  { q: 'Do I keep ownership of my vocals?',
    a: 'You do — until a client buys an exclusive. Session and hook bookings keep you as the owner; exclusive bookings transfer rights per the contract we generate automatically.' },
  { q: 'Can I still book through my own network / agency?',
    a: 'Yes. GRID is non-exclusive. Book your regular clients off-platform and use us for the rest. We just handle the payment, contract, and split.' },
  { q: 'How do splits work?',
    a: 'Add writers by email. We route their percentage automatically on every booking — no manual PayPal chase.' },
  { q: 'How do sync pitches work?',
    a: 'Match your demo catalogue to open briefs from labels, agencies, and supervisors. Pitch in one click. We track the pipeline.' },
  { q: 'What if a client uses my vocals without permission?',
    a: 'Content-ID monitoring across streaming platforms. We flag matches and help you file claims automatically.' },
];

export function VocalistFaq() {
  return (
    <section className="border-t border-neutral-200 py-20">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Vocalist FAQ</p>
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
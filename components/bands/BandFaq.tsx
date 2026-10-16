const QA = [
  { q: 'What does GRID cost?',
    a: '3% per sale. No monthly fee, no listing cost, no hidden charges. If you don\u2019t sell, you don\u2019t pay.' },
  { q: 'Do we still own our recordings and merch designs?',
    a: 'Yes. GRID is a sales channel, not a label. You own the masters, the artwork, the merch, and the ticket data.' },
  { q: 'Can we still sell through DICE, Bandcamp, and our own site?',
    a: 'Yes. GRID is non-exclusive. Sell everywhere. We just handle the delivery, contract, and payout.' },
  { q: 'How do band splits work?',
    a: 'Add band members, manager, agent, and producer by email. We route each percentage automatically on every sale — no more "who\u2019s chasing who" spreadsheet chaos.' },
  { q: 'How does booking work?',
    a: 'Search venues, send offers, sign contracts, collect deposits, and confirm doors — all in one flow. Venues can accept, decline, or counter through the dashboard.' },
  { q: 'What if a gig cancels?',
    a: 'Full refunds to ticket buyers, automatic. Deposits are handled per your venue contract. We flag the venue in your history so you know before you book again.' },
];

export function BandFaq() {
  return (
    <section className="border-t border-neutral-200 py-20">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Band FAQ</p>
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
const QA = [
  { q: 'What does GRID cost?',
    a: '3% per booking. No monthly fee, no listing cost, no hidden charges. If you don\u2019t book, you don\u2019t pay.' },
  { q: 'Can we still take bookings outside GRID?',
    a: 'Yes. GRID is non-exclusive. Keep your direct bookings, your existing promoter relationships, and your own calendar. Use GRID as an additional channel.' },
  { q: 'How do deposits work?',
    a: 'Promoters pay a deposit through GRID at booking confirmation. Funds are held until 24h before doors, then released automatically. No-shows forfeit the deposit per your terms.' },
  { q: 'How does bar split / door split work?',
    a: 'Choose your deal type per booking. For bar split, connect your POS to auto-track. For door split, we integrate with your door scanner. Flat fee is always 100% upfront.' },
  { q: 'What about riders and tech spec?',
    a: 'Upload once. Every promoter sees it before booking. Update any time. Riders travel with the booking confirmation.' },
  { q: 'Can we turn off messaging / enquiries?',
    a: 'Yes. Toggle off in settings. Bookings still flow through the offer queue — promoters send formal offers, not DMs.' },
];

export function VenueFaq() {
  return (
    <section className="border-t border-neutral-200 py-20">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Venue FAQ</p>
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
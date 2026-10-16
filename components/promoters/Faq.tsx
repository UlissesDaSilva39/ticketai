const QA = [
  { q: 'What does GRID cost?',
    a: '3% per ticket sold. No monthly fee, no setup cost, no hidden charges. If you don\u2019t sell, you don\u2019t pay.' },
  { q: 'How fast do I get paid?',
    a: 'Payouts land the morning after your event. Same-day on request for events under £10k gross.' },
  { q: 'Can I use my own Stripe / bank account?',
    a: 'Yes. GRID Payouts runs on Stripe. Connect your own account in seconds or use ours.' },
  { q: 'Can I migrate my existing fan list?',
    a: 'Upload CSV, or sync from Mailchimp, Substack, or your Instagram followers. We\u2019ll help with the import.' },
  { q: 'Do you handle refunds and fraud?',
    a: 'Yes. Chargeback protection, duplicate-ticket detection, and one-click refunds are built in.' },
  { q: 'What if my event doesn\u2019t sell?',
    a: 'You pay nothing. Events can be cancelled up to 48 hours before doors with full automatic refunds to buyers.' },
];

export function Faq() {
  return (
    <section className="border-t border-neutral-200 py-20">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Promoter FAQ
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            Answers, not asterisks.
          </h2>
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
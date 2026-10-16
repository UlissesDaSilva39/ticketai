const LOGOS = ['Fabric', 'Printworks', 'Motion', 'Hidden', 'Kraftwerk', 'Village Underground'];

const TESTIMONIALS = [
  { quote: 'We moved from Eventbrite and cut our fee by 9%. Paid for our sound rig in one show.',
    name: 'Marcus D.', role: 'Nightshift Presents · London', stat: '£4,200 saved in 6 months' },
  { quote: "The affiliate codes turned every DJ on my lineup into a salesperson. We sold 340 more tickets than last year's edition.",
    name: 'Ilona V.', role: 'Warehouse Sessions · Berlin', stat: '+22% tickets sold' },
  { quote: 'Booked a venue at 9am, had a full lineup by lunch, sold out in 3 days.',
    name: 'Priya S.', role: 'Fresh Talent UK · London', stat: 'Sold out in 72 hours' },
];

export function Proof() {
  return (
    <section className="border-t border-neutral-200 py-20">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        Trusted by
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-4">
        {LOGOS.map((l) => (
          <span key={l} className="text-xl font-black tracking-tight text-neutral-400">
            {l}
          </span>
        ))}
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure key={t.name}
            className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6">
            <blockquote className="text-base text-neutral-800">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
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
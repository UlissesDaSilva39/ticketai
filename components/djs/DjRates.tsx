import Link from 'next/link';
import type { DjRate } from '@/lib/djs';

export function DjRates({ rates, slug }: { rates?: DjRate[]; slug: string }) {
  if (!rates || rates.length === 0) return null;

  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        Booking rates
      </h2>
      <ul className="mt-4 space-y-3">
        {rates.map((r, i) => (
          <li key={i} className="rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold">{r.label}</p>
                  {r.popular && (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-700">
                      Popular
                    </span>
                  )}
                </div>
                {r.description && (
                  <p className="mt-1 text-sm text-neutral-600">{r.description}</p>
                )}
              </div>
              <p className="text-sm font-semibold whitespace-nowrap">{r.price}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-neutral-500">
        All bookings: deposit 30% at confirmation, balance T+1 after event.
        Travel outside London quoted separately.
      </p>
      <Link
        href={`/book/dj/${slug}`}
        className="mt-4 inline-flex rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
      >
        Book this DJ
      </Link>
    </section>
  );
}
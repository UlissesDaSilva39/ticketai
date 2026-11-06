'use client';

import Link from 'next/link';
import type { Service } from '@/lib/artists';

export function ArtistServicesPanel({
  services,
  slug,
}: {
  services?: Service[];
  slug: string;
}) {
  if (!services || services.length === 0) return null;

  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        Services
      </h2>
      <ul className="mt-4 space-y-3">
        {services.map((s, i) => (
          <li key={i} className="rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold">{s.label}</p>
                  {s.popular && (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-700">
                      Popular
                    </span>
                  )}
                </div>
                {s.description && (
                  <p className="mt-1 text-sm text-neutral-600">{s.description}</p>
                )}
                {s.turnaround && (
                  <p className="mt-2 text-xs text-neutral-500">{s.turnaround}</p>
                )}
              </div>
              <p className="text-sm font-semibold whitespace-nowrap">{s.price}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-neutral-500">
        All engagements include contract + invoice. Paid through GRID Â· 3% per booking Â· Payout next day.
      </p>
      <Link
        href={`/artists/${slug}/book`}
        className="mt-4 inline-flex rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
      >
        Book a session â†’
      </Link>
    </section>
  );
}
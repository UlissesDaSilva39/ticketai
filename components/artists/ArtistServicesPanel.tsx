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
      <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-5">
        <dl className="divide-y divide-neutral-200">
          {services.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-3 first:pt-0">
              <dt className="text-sm font-medium text-neutral-900">{s.label}</dt>
              <dd className="text-sm font-semibold text-neutral-900">{s.price}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 border-t border-neutral-200 pt-4 text-xs text-neutral-500">
          All engagements include contract + invoice. Paid through GRID · 3% per
          booking · Payout next day.
        </p>
        <Link
          href={`/artists/${slug}/book`}
          className="mt-5 inline-flex rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          Book a session →
        </Link>
      </div>
    </section>
  );
}
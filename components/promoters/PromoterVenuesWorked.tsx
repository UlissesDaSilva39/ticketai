import Link from 'next/link';
import type { VenueWorked } from '@/lib/promoters';

export function PromoterVenuesWorked({ venues }: { venues?: VenueWorked[] }) {
  if (!venues || venues.length === 0) return null;

  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        Venues worked with
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
        {venues.map((v) => (
          <Link
            key={v.slug}
            href={`/venues/${v.slug}`}
            className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-900"
          >
            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-100 flex items-center justify-center text-2xl font-black text-neutral-300">
              {v.name.charAt(0)}
            </div>
            <p className="mt-3 truncate text-sm font-semibold">{v.name}</p>
            <p className="text-xs text-neutral-500">Capacity {v.capacity}</p>
            <p className="text-xs text-neutral-500">{v.deal}</p>
            <p className="mt-3 text-xs font-semibold text-neutral-700 group-hover:text-black">
              View venue →
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
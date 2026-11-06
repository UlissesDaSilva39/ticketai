import Link from 'next/link';
import type { MerchItem } from '@/lib/artists';

export function ArtistMerch({ items }: { items?: MerchItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Merch
        </h2>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {items.map((m) => (
          <article key={m.id} className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="aspect-square w-full overflow-hidden rounded-xl bg-neutral-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.image} alt={m.name} className="h-full w-full object-cover" />
            </div>

            <div className="mt-3 flex items-start justify-between gap-2">
              <p className="text-sm font-semibold">{m.name}</p>
              {m.limited && (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                  LIMITED
                </span>
              )}
            </div>

            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm font-bold">{m.price}</p>
              {typeof m.stock === 'number' && (
                <p className="text-xs text-neutral-500">{m.stock} left</p>
              )}
            </div>

            {m.sizes && m.sizes.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {m.sizes.map((s) => (
                  <span key={s} className="rounded border border-neutral-200 px-2 py-0.5 text-[10px] font-medium text-neutral-600">
                    {s}
                  </span>
                ))}
              </div>
            )}

            <Link
              href={m.url}
              className="mt-3 rounded-full bg-black px-4 py-2 text-center text-xs font-semibold text-white hover:bg-neutral-800"
            >
              Add to cart
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-4">
        <Link href="/merch" className="text-sm font-semibold text-neutral-700 hover:text-black">
          View all merch â†’
        </Link>
      </div>
    </section>
  );
}
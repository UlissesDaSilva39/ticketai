'use client';

import Link from 'next/link';
import { useCart, parsePoundsToPence } from '@/lib/cart';
import type { MerchItem } from '@/lib/artists';

export function MerchCard({ item, artistSlug }: { item: MerchItem; artistSlug: string }) {
  const { add } = useCart();

  function quickAdd() {
    add({
      id: item.id,
      slug: item.url,
      name: item.name,
      price: parsePoundsToPence(item.price),
      image: item.image,
      size: item.sizes?.[0],
    });
  }

  return (
    <article className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-4">
      <Link href={item.url} className="group">
        <div className="aspect-square w-full overflow-hidden rounded-xl bg-neutral-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="mt-3 flex items-start justify-between gap-2">
        <Link href={item.url} className="text-sm font-semibold hover:underline">
          {item.name}
        </Link>
        {item.limited && (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
            LIMITED
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between">
        <p className="text-sm font-bold">{item.price}</p>
        {typeof item.stock === 'number' && (
          <p className="text-xs text-neutral-500">{item.stock} left</p>
        )}
      </div>

      {item.sizes && item.sizes.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {item.sizes.map((s) => (
            <span
              key={s}
              className="rounded border border-neutral-200 px-2 py-0.5 text-[10px] font-medium text-neutral-600"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={quickAdd}
          className="rounded-full bg-black px-4 py-2 text-center text-xs font-semibold text-white hover:bg-neutral-800"
        >
          Add to cart
        </button>
        <Link
          href={item.url}
          className="rounded-full border border-neutral-300 px-4 py-2 text-center text-xs font-semibold text-neutral-900 hover:border-neutral-900"
        >
          Details
        </Link>
      </div>
    </article>
  );
}
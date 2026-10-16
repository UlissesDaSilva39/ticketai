import Link from 'next/link';
import type { Bundle } from '@/lib/artists';

export function ArtistBundle({ bundle }: { bundle?: Bundle }) {
  if (!bundle) return null;

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        Bundle
      </p>

      <h3 className="mt-3 text-2xl font-black tracking-tight">{bundle.name}</h3>
      <p className="mt-2 text-sm text-neutral-600">{bundle.description}</p>

      <div className="mt-4 flex flex-wrap items-baseline gap-3">
        <span className="text-sm text-neutral-400 line-through">{bundle.originalPrice}</span>
        <span className="text-2xl font-black tracking-tight">{bundle.bundlePrice}</span>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
          {bundle.saving}
        </span>
      </div>

      <Link
        href={bundle.url}
        className="mt-5 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
      >
        Add bundle to cart →
      </Link>

      {typeof bundle.stock === 'number' && (
        <p className="mt-3 text-xs text-neutral-500">
          Only {bundle.stock} bundles available
        </p>
      )}
    </section>
  );
}
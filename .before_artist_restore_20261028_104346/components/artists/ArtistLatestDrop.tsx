import Link from 'next/link';
import type { LatestDrop } from '@/lib/artists';

export function ArtistLatestDrop({ drop }: { drop?: LatestDrop }) {
  if (!drop) return null;

  return (
    <section className="rounded-2xl border border-neutral-200 bg-gradient-to-r from-neutral-50 to-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600">
            ðŸŽµ {drop.label}
          </p>
          <p className="mt-1 text-lg font-black tracking-tight">{drop.title}</p>
          <p className="mt-0.5 text-sm text-neutral-500">{drop.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={drop.ctaUrl} className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800">
            Listen
          </Link>
          <button type="button" className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:border-neutral-900">
            Save
          </button>
          <button type="button" className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:border-neutral-900">
            Share
          </button>
        </div>
      </div>
    </section>
  );
}
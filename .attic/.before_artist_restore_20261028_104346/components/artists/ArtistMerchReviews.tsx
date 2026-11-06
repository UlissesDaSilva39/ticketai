import type { Review } from '@/lib/artists';

export function ArtistMerchReviews({ reviews }: { reviews?: Review[] }) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        Fans also support
      </h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {reviews.slice(0, 2).map((r, i) => (
          <figure key={i} className="rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="text-sm text-amber-500">{'â˜…'.repeat(r.rating ?? 5)}</div>
            <blockquote className="mt-3 text-sm text-neutral-800">
              &ldquo;{r.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4">
              <p className="text-sm font-semibold">{r.name}</p>
              <p className="text-xs text-neutral-500">{r.role}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                âœ“ Verified purchase
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
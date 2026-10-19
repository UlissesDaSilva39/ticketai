import type { PromoterReview } from '@/lib/promoters';

export function PromoterReviews({ reviews }: { reviews?: PromoterReview[] }) {
  if (!reviews || reviews.length === 0) return null;

  const avg = reviews.reduce((sum, r) => sum + (r.rating ?? 5), 0) / reviews.length;

  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        Reviews from artists & venues
      </h2>

      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-5">
        <p className="text-3xl font-black tracking-tight">{avg.toFixed(1)}</p>
        <div>
          <p className="text-sm text-amber-500">{'★'.repeat(Math.round(avg))}</p>
          <p className="text-xs text-neutral-500">
            From {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {reviews.map((r, i) => (
          <figure key={i} className="rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm text-amber-500">{'★'.repeat(r.rating ?? 5)}</div>
              {r.date && <p className="text-xs text-neutral-400">{r.date}</p>}
            </div>
            <blockquote className="mt-3 text-sm text-neutral-800">
              &ldquo;{r.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4">
              <p className="text-sm font-semibold">{r.name}</p>
              <p className="text-xs text-neutral-500">{r.role}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
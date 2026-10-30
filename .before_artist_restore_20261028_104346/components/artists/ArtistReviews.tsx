import type { Review } from '@/lib/artists';

export function ArtistReviews({ reviews }: { reviews?: Review[] }) {
  if (!reviews || reviews.length === 0) return null;

  const avg = reviews.reduce((sum, r) => sum + (r.rating ?? 5), 0) / reviews.length;
  const count = reviews.length;

  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        Reviews from clients
      </h2>

      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-5">
        <p className="text-3xl font-black tracking-tight">{avg.toFixed(1)}</p>
        <div>
          <p className="text-sm text-amber-500">
            {'â˜…'.repeat(Math.round(avg))}
            <span className="text-neutral-300">{'â˜…'.repeat(5 - Math.round(avg))}</span>
          </p>
          <p className="text-xs text-neutral-500">
            From {count} {count === 1 ? 'client' : 'clients'}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {reviews.map((r, i) => (
          <figure key={i} className="rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm text-amber-500">
                {'â˜…'.repeat(r.rating ?? 5)}
              </div>
              {r.date && (
                <p className="text-xs text-neutral-400">{r.date}</p>
              )}
            </div>
            <blockquote className="mt-3 text-sm text-neutral-800">
              &ldquo;{r.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-2">
              <div>
                <p className="text-sm font-semibold">{r.name}</p>
                <p className="text-xs text-neutral-500">{r.role}</p>
              </div>
              {r.verified && (
                <span className="ml-auto rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  âœ“ Verified booking
                </span>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
import type { Credit } from '@/lib/artists';

export function ArtistCredits({ credits }: { credits?: Credit[] }) {
  if (!credits || credits.length === 0) return null;

  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        Credits
      </h2>
      <ul className="mt-4 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
        {credits.map((c, i) => (
          <li key={i} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold">{c.title}</p>
              <p className="text-xs text-neutral-500">{c.role}</p>
            </div>
            {c.year && <p className="text-xs text-neutral-500">{c.year}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
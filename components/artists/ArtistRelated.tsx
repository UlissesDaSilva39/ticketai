import Link from 'next/link';

type Related = { slug: string; name: string; city: string; role?: string; photo?: string };

export function ArtistRelated({ artists }: { artists: Related[] }) {
  if (!artists || artists.length === 0) return null;

  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        Related profiles
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
        {artists.map((a) => (
          <Link
            key={a.slug}
            href={`/artists/${a.slug}`}
            className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-900"
          >
            <div className="aspect-square w-full overflow-hidden rounded-xl bg-neutral-100">
              {a.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.photo} alt={a.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-black text-neutral-300">
                  {a.name.charAt(0)}
                </div>
              )}
            </div>
            <p className="mt-3 truncate text-sm font-semibold">{a.name}</p>
            <p className="text-xs text-neutral-500">{a.city}</p>
            {a.role && <p className="text-xs text-neutral-500">{a.role}</p>}
            <p className="mt-3 text-xs font-semibold text-neutral-700 group-hover:text-black">
              View profile →
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
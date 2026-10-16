'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Related = { slug: string; name: string; city: string; role?: string; photo?: string };

function Avatar({ src, name }: { src?: string; name: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  const hasSrc = Boolean(src);
  const showImage = hasSrc && loaded && !failed;

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-100">
      <div className="absolute inset-0 flex items-center justify-center text-3xl font-black text-neutral-300">
        {name.charAt(0)}
      </div>
      {hasSrc && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={
            'relative h-full w-full object-cover transition-opacity duration-200 ' +
            (showImage ? 'opacity-100' : 'opacity-0')
          }
        />
      )}
    </div>
  );
}

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
            <Avatar src={a.photo} name={a.name} />
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
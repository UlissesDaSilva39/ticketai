'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageButton } from '@/components/promoters/MessageButton';

type Props = {
  name: string;
  handle: string;
  city: string;
  role: string;
  bio: string;
  genres: string[];
  verified?: boolean;
  available?: boolean;
  followers: number;
  responseTime?: string;
  photo?: string;
};

export function ArtistProfileHeader({
  name, handle, city, role, bio, genres,
  verified, available = true, followers, responseTime, photo,
}: Props) {
  const [following, setFollowing] = useState(false);

  return (
    <header className="grid gap-6 md:grid-cols-[240px_1fr] md:gap-8">
      <div className="aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl font-black text-neutral-300">
            {name.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">{name}</h1>
          {verified && (
            <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-semibold text-white">
              VERIFIED
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-neutral-500">@{handle}</p>

        <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-neutral-500">
          {city} · {role}
        </p>

        <p className="mt-3 max-w-2xl text-base text-neutral-700">{bio}</p>

        {genres.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {genres.map((g) => (
              <span key={g} className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium">
                {g}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          {available ? (
            <>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-emerald-700">Available for new projects</span>
              {responseTime && (
                <span className="text-neutral-400">· Responds in {responseTime}</span>
              )}
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-amber-700">Currently booked</span>
            </>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <MessageButton
            promoterSlug={handle}
            promoterName={name}
            variant="secondary"
            size="md"
          />
          <button
            type="button"
            onClick={() => setFollowing((f) => !f)}
            className={
              'rounded-full px-5 py-3 text-sm font-semibold transition ' +
              (following
                ? 'border border-neutral-300 bg-white text-neutral-900'
                : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200')
            }
          >
            {following ? 'Following' : '+ Follow'}{' '}
            <span className="text-neutral-500">
              ({(followers + (following ? 1 : 0)).toLocaleString()})
            </span>
          </button>
          <Link
            href={`/artists/${handle}/book`}
            className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Book a session →
          </Link>
        </div>
      </div>
    </header>
  );
}
'use client';

import { useState } from 'react';
import type { Track } from '@/lib/artists';

export function ArtistTracksList({ tracks }: { tracks?: Track[] }) {
  const [playing, setPlaying] = useState<string | null>(null);

  if (!tracks || tracks.length === 0) {
    return (
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Tracks
        </h2>
        <div className="mt-4 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center">
          <p className="text-base font-semibold">No tracks yet</p>
          <p className="mt-1 text-sm text-neutral-500">
            This artist has not published any music.
          </p>
          <button
            type="button"
            className="mt-6 rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            + Follow to be notified
          </button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        Tracks
      </h2>
      <ul className="mt-4 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
        {tracks.map((t) => (
          <li key={t.id} className="flex items-center gap-4 px-5 py-4">
            <button
              type="button"
              aria-label={`Play ${t.title}`}
              onClick={() => setPlaying(playing === t.id ? null : t.id)}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white transition hover:bg-neutral-800"
            >
              {playing === t.id ? '❚❚' : '▶'}
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{t.title}</p>
              <p className="text-xs text-neutral-500">
                {t.genre} · {t.duration} · {t.plays} plays
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
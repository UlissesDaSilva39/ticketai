'use client';

import { useEffect, useRef, useState } from 'react';
import type { Track } from '@/lib/artists';

export function ArtistTracksList({ tracks }: { tracks?: Track[] }) {
  const [playing, setPlaying] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

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
        </div>
      </section>
    );
  }

  function toggle(track: Track) {
    if (playing === track.id) {
      audioRef.current?.pause();
      setPlaying(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(track.previewUrl);
    audio.addEventListener('timeupdate', () => {
      if (audio.duration > 0) {
        setProgress((p) => ({ ...p, [track.id]: audio.currentTime / audio.duration }));
      }
    });
    audio.addEventListener('ended', () => {
      setPlaying(null);
      setProgress((p) => ({ ...p, [track.id]: 0 }));
    });
    audio.addEventListener('error', () => {
      setPlaying(null);
    });
    audio.play().catch(() => setPlaying(null));
    audioRef.current = audio;
    setPlaying(track.id);
  }

  function playAll() {
    if (!tracks || tracks.length === 0) return;
    toggle(tracks[0]);
  }

  const totalSeconds = tracks.reduce((sum, t) => {
    const [m, s] = t.duration.split(':').map(Number);
    return sum + (m * 60 + s);
  }, 0);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalRemaining = totalSeconds % 60;

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Tracks
        </h2>
        <p className="text-xs text-neutral-500">
          {tracks.length} tracks · Total {totalMinutes}:{String(totalRemaining).padStart(2, '0')}
        </p>
      </div>

      <button
        type="button"
        onClick={playAll}
        className="mt-3 inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
      >
        ▶ Play all
      </button>

      <ul className="mt-4 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
        {tracks.map((t) => {
          const isPlaying = playing === t.id;
          const pct = Math.round((progress[t.id] ?? 0) * 100);
          return (
            <li key={t.id} className="px-5 py-4">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  aria-label={isPlaying ? `Pause ${t.title}` : `Play ${t.title}`}
                  onClick={() => toggle(t)}
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white transition hover:bg-neutral-800"
                >
                  {isPlaying ? '❚❚' : '▶'}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{t.title}</p>
                  <p className="text-xs text-neutral-500">
                    {t.genre} · {t.duration} · {t.plays} plays
                  </p>
                </div>
              </div>
              {isPlaying && (
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-neutral-200">
                  <div
                    className="h-full bg-black transition-[width] duration-150"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
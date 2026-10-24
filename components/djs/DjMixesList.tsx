'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { DjMix } from '@/lib/djs';

export function DjMixesList({ mixes }: { mixes?: DjMix[] }) {
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

  if (!mixes || mixes.length === 0) return null;

  function toggle(mix: DjMix) {
    if (playing === mix.id) {
      audioRef.current?.pause();
      setPlaying(null);
      return;
    }
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(mix.previewUrl);
    audio.addEventListener('timeupdate', () => {
      if (audio.duration > 0) {
        setProgress((p) => ({ ...p, [mix.id]: audio.currentTime / audio.duration }));
      }
    });
    audio.addEventListener('ended', () => {
      setPlaying(null);
      setProgress((p) => ({ ...p, [mix.id]: 0 }));
    });
    audio.addEventListener('error', () => setPlaying(null));
    audio.play().catch(() => setPlaying(null));
    audioRef.current = audio;
    setPlaying(mix.id);
  }

  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        Mixes
      </h2>
      <ul className="mt-4 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
        {mixes.map((m) => {
          const isPlaying = playing === m.id;
          const pct = Math.round((progress[m.id] ?? 0) * 100);
          return (
            <li key={m.id} className="px-5 py-4">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  aria-label={isPlaying ? `Pause ${m.title}` : `Play ${m.title}`}
                  onClick={() => toggle(m)}
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white hover:bg-neutral-800"
                >
                  {isPlaying ? '❚❚' : '▶'}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{m.title}</p>
                  <p className="text-xs text-neutral-500">
                    {m.duration} · {m.plays.toLocaleString()} plays
                  </p>
                </div>
                {m.price && (
                  <Link
                    href={`/merch/${m.id}`}
                    className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800"
                  >
                    Buy {m.price}
                  </Link>
                )}
              </div>
              {isPlaying && (
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-neutral-200">
                  <div
                    className="h-full bg-black transition-[width] duration-150 text-white"
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
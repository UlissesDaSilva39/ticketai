"use client";

import { useEffect, useRef, useState } from "react";

type Track = {
  id: string;
  title: string;
  duration_seconds: number | null;
  audio_url: string;
  play_count: number;
};

const DEMO: Track[] = [
  { id: "demo-1", title: "Midnight Drive", duration_seconds: 222, audio_url: "", play_count: 1200000 },
  { id: "demo-2", title: "Neon Hours", duration_seconds: 250, audio_url: "", play_count: 890000 },
  { id: "demo-3", title: "Afterglow", duration_seconds: 208, audio_url: "", play_count: 640000 },
  { id: "demo-4", title: "Static Love", duration_seconds: 302, audio_url: "", play_count: 410000 },
];

export default function TopTracks({ artistId }: { artistId: string }) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/artist-tracks?artistId=" + artistId)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const real = d.tracks || [];
        if (real.length > 0) {
          setTracks(real);
          setIsDemo(false);
        } else {
          setTracks(DEMO);
          setIsDemo(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [artistId]);

  const play = (t: Track) => {
    if (!t.audio_url) return;
    if (audioRef.current) audioRef.current.pause();
    if (playingId === t.id) {
      setPlayingId(null);
      return;
    }
    const audio = new Audio(t.audio_url);
    audio.play().catch(() => {});
    audio.onended = () => setPlayingId(null);
    audioRef.current = audio;
    setPlayingId(t.id);
  };

  const fmt = (s: number | null) => {
    if (!s) return "--:--";
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m + ":" + String(sec).padStart(2, "0");
  };

  const fmtPlays = (n: number) => {
    if (n < 1000) return String(n);
    if (n < 1_000_000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  };

  if (loading) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-bold">Top Tracks</h2>
        <span className="text-[10px] uppercase tracking-wider text-gray-500">
          {isDemo ? "Demo · Upload to replace" : "Uploaded tracks"}
        </span>
      </div>
      <ul>
        {tracks.map((t, i) => (
          <li
            key={t.id}
            className="group flex items-center gap-4 px-6 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
          >
            <span className="w-5 text-sm text-gray-400 text-right tabular-nums">
              {playingId === t.id ? <span className="text-black">▶</span> : i + 1}
            </span>
            <button
              type="button"
              onClick={() => play(t)}
              disabled={!t.audio_url}
              className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-20 shrink-0"
              aria-label={"Play " + t.title}
            >
              {playingId === t.id ? "❚❚" : "▶"}
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{t.title}</p>
              <p className="text-xs text-gray-500 truncate">
                Artist · {t.audio_url ? "Single" : "Demo"}
              </p>
            </div>
            <span className="text-xs text-gray-500 tabular-nums hidden sm:block w-20 text-right">
              {fmtPlays(t.play_count)} plays
            </span>
            <span className="text-xs text-gray-500 tabular-nums w-12 text-right">
              {fmt(t.duration_seconds)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
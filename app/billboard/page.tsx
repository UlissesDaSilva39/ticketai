"use client";
import { useState } from "react";
import Link from "next/link";
import { useLicensing } from "@/lib/hooks/useLicensing";
import LicenceBadge from "@/components/LicenceBadge";
import TrackCredit from "@/components/TrackCredit";

export default function BillboardPage() {
  const { getRankedTracks, recordPlay, hydrated } = useLicensing();
  const [filter, setFilter] = useState<"top40" | "all" | "new">("top40");
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (!hydrated) return null;

  const ranked = getRankedTracks();
  const display = filter === "top40" ? ranked.slice(0, 40) : filter === "new" ? [...ranked].reverse() : ranked;

  const handlePlay = (id: string) => {
    recordPlay(id);
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-xs font-semibold text-gray-500 hover:text-emerald-600 mb-6 inline-block">
          ← Back to GRID
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">GRID Billboard</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            The UK's licensed music chart. Every track cleared for streaming.
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          {(["top40", "all", "new"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                filter === f
                  ? "bg-emerald-600 text-white"
                  : "bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-800 hover:border-emerald-300"
              }`}
            >
              {f === "top40" ? "Top 40" : f === "all" ? "All tracks" : "New"}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
          {display.map((track, i) => (
            <div key={track.id} className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-zinc-800 last:border-0 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
              <div className="w-8 text-center text-sm font-bold text-gray-400">{i + 1}</div>
              <button
                onClick={() => handlePlay(track.id)}
                className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white grid place-items-center flex-shrink-0"
                aria-label={playingId === track.id ? "Pause" : "Play"}
              >
                {playingId === track.id ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                ) : (
                  <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>
              <div className={`w-10 h-10 rounded-lg ${track.color} text-white grid place-items-center font-bold text-sm flex-shrink-0`}>
                {track.title[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{track.title}</p>
                  <LicenceBadge status={track.status} territory={track.territories[0]} />
                </div>
                <p className="text-xs text-gray-600 dark:text-zinc-400 truncate">{track.artistName} · {track.genre}</p>
                <TrackCredit
                  isrc={track.isrc}
                  masterOwner={track.masterOwner}
                  composer={track.composer}
                  publisher={track.publisher}
                  territory={track.territories.join(", ")}
                  compact
                />
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-bold text-gray-900 dark:text-white">{track.plays.toLocaleString()}</p>
                <p className="text-[10px] text-gray-500">plays</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link href="/licensing" className="text-sm font-bold text-emerald-600 hover:underline">
            Licence your music to GRID →
          </Link>
        </div>
      </div>
    </div>
  );
}
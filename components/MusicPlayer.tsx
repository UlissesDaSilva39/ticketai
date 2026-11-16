"use client";
import { useState } from "react";

interface Track {
  id: string;
  title: string;
  duration: string;
  plays?: number;
}

interface Props {
  tracks: Track[];
  artistName: string;
}

const PlayIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
);

const PauseIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
);

export default function MusicPlayer({ tracks, artistName }: Props) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (tracks.length === 0) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white text-base">Latest releases</h3>
        <span className="text-xs text-gray-500">{tracks.length} tracks</span>
      </div>
      <div className="space-y-2">
        {tracks.map((track) => (
          <div key={track.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group">
            <button
              onClick={() => setPlayingId(playingId === track.id ? null : track.id)}
              className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white grid place-items-center flex-shrink-0 transition-colors"
              aria-label={playingId === track.id ? "Pause" : "Play"}
            >
              {playingId === track.id ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4 ml-0.5" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{track.title}</p>
              <p className="text-xs text-gray-500">
                {artistName}{track.plays ? ` · ${track.plays.toLocaleString()} plays` : ""}
              </p>
            </div>
            <span className="text-xs text-gray-500 flex-shrink-0">{track.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
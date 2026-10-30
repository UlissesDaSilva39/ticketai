"use client";

import { useRef, useState } from "react";

type Track = {
  id: string;
  title: string;
  artist_name: string | null;
  cover_url: string | null;
  audio_url: string | null;
  duration_seconds: number | null;
  play_count: number;
};

export default function TrackCard({ track }: { track: Track }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().catch(() => {});
      setPlaying(true);
    }
  };

  const mmss = (s: number | null) => {
    if (!s) return "0:00";
    const m = Math.floor(s / 60);
    const sec = String(s % 60).padStart(2, "0");
    return m + ":" + sec;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-3 w-44 shrink-0 hover:shadow-md transition">
      <div className="relative">
        {track.cover_url ? (
          <img src={track.cover_url} alt={track.title} className="w-full h-40 object-cover rounded-xl" />
        ) : (
          <div className="w-full h-40 bg-gray-100 rounded-xl" />
        )}
        <button
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:scale-105 transition"
        >
          {playing ? <span className="text-lg">||</span> : <span className="text-lg pl-0.5">&#9654;</span>}
        </button>
      </div>
      <p className="text-sm font-medium mt-3 truncate">{track.title}</p>
      <p className="text-xs text-gray-500 truncate">{track.artist_name}</p>
      <div className="flex items-center justify-between mt-1 text-xs text-gray-400">
        <span>{track.play_count.toLocaleString()} plays</span>
        <span>{mmss(track.duration_seconds)}</span>
      </div>
      {track.audio_url && (
        <audio ref={audioRef} src={track.audio_url} onEnded={() => setPlaying(false)} />
      )}
    </div>
  );
}

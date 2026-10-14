"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

export type Track = {
  id: string;
  title: string;
  artist_name?: string | null;
  audio_url?: string | null;
  cover_url?: string | null;
};

type Ctx = {
  current: Track | null;
  playing: boolean;
  play: (t: Track) => void;
  toggle: () => void;
  stop: () => void;
};

const PlayerCtx = createContext<Ctx | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [current, setCurrent] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!audioRef.current) audioRef.current = new Audio();
    const a = audioRef.current;
    const onEnd = () => setPlaying(false);
    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    a.addEventListener("ended", onEnd);
    a.addEventListener("pause", onPause);
    a.addEventListener("play", onPlay);
    return () => {
      a.removeEventListener("ended", onEnd);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("play", onPlay);
    };
  }, []);

  const play = (t: Track) => {
    const a = audioRef.current;
    if (!a) return;
    setCurrent(t);
    if (!t.audio_url) return;
    a.src = t.audio_url;
    a.play().catch(() => setPlaying(false));
  };

  const toggle = () => {
    const a = audioRef.current;
    if (!a || !current) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  };

  const stop = () => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
    setPlaying(false);
  };

  return (
    <PlayerCtx.Provider value={{ current, playing, play, toggle, stop }}>
      {children}
      {current ? (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black text-white border-t border-gray-800">
          <div className="mx-auto max-w-[1400px] px-6 py-3 flex items-center gap-4">
            <button
              onClick={toggle}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center text-sm"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? "II" : "\u25B6"}
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{current.title}</p>
              <p className="text-xs text-gray-400 truncate">
                {current.artist_name ?? ""}
              </p>
            </div>
            <button
              onClick={stop}
              className="text-xs text-gray-400 hover:text-white"
            >
              Stop
            </button>
          </div>
        </div>
      ) : null}
    </PlayerCtx.Provider>
  );
}

export function usePlayer() {
  const c = useContext(PlayerCtx);
  if (!c) throw new Error("usePlayer must be used inside PlayerProvider");
  return c;
}

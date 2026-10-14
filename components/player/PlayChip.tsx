"use client";
import { usePlayer, type Track } from "./GlobalPlayer";

export function PlayChip({ track }: { track: Track }) {
  const { play, toggle, current, playing } = usePlayer();
  const isThis = current?.id === track.id;
  const isPlaying = isThis && playing;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isThis) toggle();
        else play(track);
      }}
      className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-black text-white shadow-lg flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
      aria-label={isPlaying ? "Pause" : "Play"}
    >
      {isPlaying ? "II" : "\u25B6"}
    </button>
  );
}

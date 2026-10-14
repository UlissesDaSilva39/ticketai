"use client";
import { usePlayer, type Track } from "./GlobalPlayer";

type Row = {
  id: string;
  title: string;
  artist_name?: string | null;
  audio_url?: string | null;
  cover_url?: string | null;
};

export default function PlayAllButton({ tracks }: { tracks: Row[] }) {
  const { play, toggle, current, playing } = usePlayer();

  const playable = tracks.filter((t) => t.audio_url);
  const disabled = playable.length === 0;

  const isOneOfThese = current && playable.some((t) => t.id === current.id);
  const isPlaying = isOneOfThese && playing;

  const onClick = () => {
    if (disabled) return;
    if (isOneOfThese) {
      toggle();
      return;
    }
    const first: Track = {
      id: playable[0].id,
      title: playable[0].title,
      artist_name: playable[0].artist_name ?? null,
      audio_url: playable[0].audio_url ?? null,
      cover_url: playable[0].cover_url ?? null,
    };
    play(first);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-2 text-sm font-semibold transition-colors ${
        disabled
          ? "bg-white/10 text-white/40 cursor-not-allowed"
          : "bg-white text-black hover:bg-gray-100"
      }`}
    >
      {isPlaying ? (
        <>
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <rect x="6" y="6" width="4" height="12" />
            <rect x="14" y="6" width="4" height="12" />
          </svg>
          <span>Pause</span>
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span>Play all</span>
        </>
      )}
    </button>
  );
}

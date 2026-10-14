"use client";
import { usePlayer, type Track } from "@/components/player/GlobalPlayer";

export default function PostAudioBar({
  postId,
  audioUrl,
  title,
  artist,
}: {
  postId: string;
  audioUrl: string;
  title?: string;
  artist?: string;
}) {
  const { play, toggle, current, playing } = usePlayer();
  const isThis = current?.id === postId;
  const isPlaying = isThis && playing;

  const track: Track = {
    id: postId,
    title: title || "Audio post",
    artist_name: artist || null,
    audio_url: audioUrl,
    cover_url: null,
  };

  return (
    <div className="mt-3 flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (isThis) toggle();
          else play(track);
        }}
        className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shrink-0 hover:bg-gray-800 transition-colors"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <rect x="6" y="6" width="4" height="12" />
            <rect x="14" y="6" width="4" height="12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{title || "Audio post"}</p>
        <p className="text-xs text-gray-500 truncate">{artist || "Unknown artist"}</p>
      </div>

      <div className="flex items-end gap-[2px] h-6 shrink-0">
        {[40, 70, 50, 90, 60, 80, 45, 65, 55, 75].map((h, i) => (
          <span
            key={i}
            className="w-[3px] bg-gray-300 rounded-full"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

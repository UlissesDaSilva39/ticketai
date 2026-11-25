import SimilarClickTracker from "@/components/SimilarClickTracker";
import { getSimilarArtists } from "@/lib/data/artists";

interface Props {
  currentId: string;
  limit?: number;
  title?: string;
}

export default function SimilarArtistsRail({
  currentId,
  limit = 5,
  title = "Fans also like",
}: Props) {
  const similar = getSimilarArtists(currentId, limit);
  if (similar.length === 0) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
          <svg
            className="w-4 h-4 text-emerald-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6-4a3 3 0 11-3-3"
            />
          </svg>
          {title}
        </h3>
        <span className="text-[10px] font-semibold text-gray-400">
          Based on genre &amp; audience
        </span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {similar.map((artist) => (
          <SimilarClickTracker
            key={artist.id}
            href={`/artist/${artist.id}`}
            className="flex flex-col items-center flex-shrink-0 w-24 group cursor-pointer"
          >
            <div
              className={`w-16 h-16 rounded-full ${artist.color} text-white flex items-center justify-center font-bold text-xl mb-2 ring-2 ring-transparent group-hover:ring-emerald-500 transition-all`}
            >
              {artist.name[0]}
            </div>
            <p className="text-[11px] font-bold text-gray-900 dark:text-white text-center leading-tight truncate w-full">
              {artist.name}
            </p>
            <p className="text-[9px] text-gray-500 text-center truncate w-full">
              {artist.genres[0]}
            </p>
            <span className="text-[9px] font-semibold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">
              View &rarr;
            </span>
          </SimilarClickTracker>
        ))}
      </div>
    </div>
  );
}
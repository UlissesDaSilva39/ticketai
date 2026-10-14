import Link from "next/link";
import { PlayChip } from "@/components/player/PlayChip";

type Artist = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  genre: string | null;
  city: string | null;
  role: string | null;
};

type Track = {
  id: string;
  title: string;
  artist_name: string | null;
  audio_url: string | null;
  cover_url: string | null;
  duration_seconds: number | null;
};

export default function EventArtists({
  artists,
  tracksByArtist,
}: {
  artists: Artist[];
  tracksByArtist: Record<string, Track[]>;
}) {
  if (artists.length === 0) return null;

  return (
    <section className="mt-10">
      <h2
        className="text-2xl font-bold uppercase mb-4"
        style={{ fontFamily: "var(--font-antonio)" }}
      >
        Artists performing
      </h2>

      <div className="space-y-6">
        {artists.map((artist) => {
          const name = artist.full_name || artist.username || "Artist";
          const initials = name
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
          const tracks = tracksByArtist[artist.id] || [];

          return (
            <div
              key={artist.id}
              className="bg-white border border-gray-200 rounded-2xl p-5"
            >
              <div className="flex items-start gap-4">
                <Link
                  href={artist.username ? "/artists/" + artist.username : "#"}
                  className="shrink-0"
                >
                  {artist.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={artist.avatar_url}
                      alt={name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center text-lg font-bold">
                      {initials}
                    </div>
                  )}
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <Link
                        href={artist.username ? "/artists/" + artist.username : "#"}
                        className="text-lg font-bold hover:underline truncate block"
                      >
                        {name}
                      </Link>
                      {artist.username ? (
                        <p className="text-xs text-gray-500">@{artist.username}</p>
                      ) : null}
                    </div>
                    <Link
                      href={artist.username ? "/artists/" + artist.username : "#"}
                      className="text-xs font-medium rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5"
                    >
                      View profile
                    </Link>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {artist.role ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 uppercase font-semibold">
                        {artist.role}
                      </span>
                    ) : null}
                    {artist.genre ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {artist.genre}
                      </span>
                    ) : null}
                    {artist.city ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {artist.city}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              {tracks.length > 0 ? (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">
                    {"Listen before you buy · " +
                      tracks.length +
                      " track" +
                      (tracks.length === 1 ? "" : "s")}
                  </p>
                  <ul className="space-y-1">
                    {tracks.map((t) => (
                      <li
                        key={t.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="relative w-10 h-10 rounded-md bg-gradient-to-br from-gray-700 to-gray-900 shrink-0 flex items-center justify-center text-white overflow-hidden">
                          {t.cover_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={t.cover_url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-bold opacity-60">
                              {t.title.charAt(0).toUpperCase()}
                            </span>
                          )}
                          <PlayChip
                            track={{
                              id: t.id,
                              title: t.title,
                              artist_name: t.artist_name,
                              audio_url: t.audio_url,
                              cover_url: t.cover_url,
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold truncate">
                            {t.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {t.artist_name || "Artist"}
                            {t.duration_seconds
                              ? " · " +
                                Math.floor(t.duration_seconds / 60) +
                                ":" +
                                String(t.duration_seconds % 60).padStart(2, "0")
                              : ""}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
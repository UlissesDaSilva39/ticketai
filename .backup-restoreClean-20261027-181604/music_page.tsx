"use client";
import { useState, useEffect } from "react";

type Artist = {
  id: string;
  name: string;
  genre: string;
  image: string;
  spotifyId: string | null;
  spotifyUrl: string;
  followers: number;
  hasSpotifyEmbed: boolean;
  nextGig?: { date: string; venue: string; city: string };
  priceMin?: number | null;
  priceCurrency?: string;
  ticketUrl?: string | null;
};

export default function MusicPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [search, setSearch] = useState("London");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchArtists = async (query: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/artists?keyword=" + encodeURIComponent(query));
      const data = await res.json();
      if (data.error) { setError(data.error); setArtists([]); }
      else { setArtists(data.artists || []); }
    } catch (e) {
      setError("Failed to load artists");
      setArtists([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchArtists("London"); }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 sm:py-10">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Music</h1>
            <p className="text-sm text-gray-500 mt-1">Listen, buy merch, and grab tickets for artists playing near you.</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); fetchArtists(search); }} className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by city..."
              className="w-full sm:w-64 px-4 py-2.5 rounded-full bg-white border border-gray-300 text-gray-900 text-sm outline-none focus:ring-2 focus:ring-black"
            />
            <button type="submit" className="px-5 py-2.5 rounded-full bg-black text-white font-semibold text-sm hover:bg-gray-800 transition">
              Search
            </button>
          </form>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 h-72 animate-pulse" />
            ))}
          </div>
        ) : artists.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg font-medium text-gray-700 mb-2">No artists found for &quot;{search}&quot;</p>
            <p className="text-sm">Try another city like London, Manchester, or Birmingham.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-500 mb-4">{artists.length} artists playing in {search}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {artists.map((artist) => (
                <div key={artist.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition flex flex-col">
                  {artist.hasSpotifyEmbed ? (
                    <div className="mb-3 -mx-2">
                      <iframe
                        src={"https://open.spotify.com/embed/artist/" + artist.spotifyId + "?utm_source=generator&theme=0"}
                        width="100%"
                        height="352"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="h-40 mb-3 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-xs text-center px-4">Spotify preview not available</span>
                    </div>
                  )}

                  <h3 className="text-base font-bold line-clamp-1">{artist.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{artist.genre} - {artist.nextGig?.city}</p>

                  {artist.nextGig?.date && artist.nextGig.date !== "TBA" && (
                    <p className="text-xs font-semibold text-blue-600 mt-2 line-clamp-1">
                      {artist.nextGig.date} - {artist.nextGig.venue}
                    </p>
                  )}

                  <div className="mt-auto pt-3 flex flex-col gap-2">
                    {artist.spotifyUrl && (
                      <a
                        href={artist.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-xs font-semibold text-center py-2 rounded-full bg-green-50 text-green-700 hover:bg-green-100 transition"
                      >
                        Open in Spotify
                      </a>
                    )}
                    {artist.ticketUrl && (
                      <a
                        href={artist.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-xs font-semibold text-center py-2 rounded-full bg-black text-white hover:bg-gray-800 transition"
                      >
                        Get Tickets →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
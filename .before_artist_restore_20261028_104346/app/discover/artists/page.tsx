"use client";
import { useState, useEffect } from "react";

type Artist = {
  id: string;
  name: string;
  genre: string;
  image: string;
  nextGig?: { date: string; venue: string; city: string };
  priceMin?: number | null;
  priceCurrency?: string;
  ticketUrl?: string | null;
  spotifyUrl?: string;
};

export default function DiscoverArtistsPage() {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-gray-900">Discover artists</h1>
        <p className="text-sm sm:text-base text-gray-600">Artists playing in your city.</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); fetchArtists(search); }} className="mb-8 flex gap-2 max-w-md">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by city..."
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
        <button type="submit" className="px-6 py-2 text-sm bg-black text-white font-semibold rounded-lg hover:bg-gray-800 whitespace-nowrap">
          Search
        </button>
      </form>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100 text-sm"><strong>Error:</strong> {error}</div>}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse" />)}
        </div>
      ) : artists.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg font-medium text-gray-700 mb-2">No artists found for &quot;{search}&quot;</p>
          <p className="text-sm">Try another city like London, Manchester, or Birmingham.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-500 mb-3">{artists.length} artists playing in {search}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {artists.map((artist) => (
              <div key={artist.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all flex flex-col">
                <div className="h-40 sm:h-48 bg-gray-100 relative shrink-0">
                  <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                  {artist.priceMin != null && (
                    <span className="absolute bottom-2 left-2 bg-white/95 text-black text-xs font-bold px-2 py-1 rounded shadow">
                      From {artist.priceCurrency} {artist.priceMin}
                    </span>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-base font-bold text-gray-900 line-clamp-1">{artist.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-1">{artist.genre} - {artist.nextGig?.city || search}</p>

                  {artist.nextGig?.date && artist.nextGig.date !== "TBA" && (
                    <p className="text-xs font-semibold text-blue-600 mt-2 line-clamp-1">{artist.nextGig.date} - {artist.nextGig.venue}</p>
                  )}

                  <div className="mt-auto pt-3 flex flex-col gap-2">
                    {artist.spotifyUrl && (
                      <a href={artist.spotifyUrl} target="_blank" rel="noopener noreferrer"
                        className="w-full text-xs font-semibold text-center py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition">
                        Listen on Spotify
                      </a>
                    )}
                    {artist.ticketUrl && (
                      <a href={artist.ticketUrl} target="_blank" rel="noopener noreferrer"
                        className="w-full text-xs font-semibold text-center py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition">
                        Get Tickets →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";

type Artist = {
  id: string;
  name: string;
  genre: string;
  image: string;
  spotifyId: string | null;
  spotifyUrl: string;
  hasSpotifyEmbed: boolean;
  nextGig?: { date: string; venue: string; city: string };
  priceMin?: number | null;
  priceCurrency?: string;
  ticketUrl?: string | null;
};

const SAVED_KEY = "grid.saved_artists";
const EMAIL_KEY = "grid.captured_email";
const CLICK_COUNT_KEY = "grid.ticket_clicks";

export default function MusicPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [search, setSearch] = useState("London");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [pendingTicketUrl, setPendingTicketUrl] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
      if (Array.isArray(saved)) setSavedIds(saved);
    } catch {}
  }, []);

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

  const saveArtist = (id: string) => {
    if (savedIds.includes(id)) return;
    const next = [...savedIds, id];
    setSavedIds(next);
    try { localStorage.setItem(SAVED_KEY, JSON.stringify(next)); } catch {}
  };

  const handleTicketClick = (e: React.MouseEvent, artist: Artist) => {
    saveArtist(artist.id);
    try {
      const clicks = parseInt(localStorage.getItem(CLICK_COUNT_KEY) || "0", 10) + 1;
      localStorage.setItem(CLICK_COUNT_KEY, String(clicks));
      const captured = localStorage.getItem(EMAIL_KEY);
      if (!captured && clicks === 1) {
        e.preventDefault();
        setPendingTicketUrl(artist.ticketUrl || null);
        setEmailModalOpen(true);
      }
    } catch {}
  };

  const submitEmail = () => {
    if (!emailInput.includes("@")) return;
    try { localStorage.setItem(EMAIL_KEY, emailInput); } catch {}
    setEmailModalOpen(false);
    if (pendingTicketUrl) window.open(pendingTicketUrl, "_blank");
    setPendingTicketUrl(null);
    setEmailInput("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-gray-900">Music</h1>
        <p className="text-sm sm:text-base text-gray-600">Listen and grab tickets for artists playing near you.</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <div key={i} className="h-96 bg-gray-200 rounded-xl animate-pulse" />)}
        </div>
      ) : artists.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg font-medium text-gray-700 mb-2">No artists found for &quot;{search}&quot;</p>
          <p className="text-sm">Try another city like London, Manchester, or Birmingham.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-500 mb-3">{artists.length} artists playing in {search}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {artists.map((artist) => (
              <div key={artist.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all flex flex-col relative">
                {savedIds.includes(artist.id) && (
                  <span className="absolute top-2 right-2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">Saved</span>
                )}
                <div className="h-40 bg-gray-100 relative shrink-0">
                  <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{artist.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-1">{artist.genre} - {artist.nextGig?.city || search}</p>
                  {artist.nextGig?.date && artist.nextGig.date !== "TBA" && (
                    <p className="text-xs font-semibold text-blue-600 mt-1 line-clamp-1">{artist.nextGig.date} - {artist.nextGig.venue}</p>
                  )}
                  {artist.hasSpotifyEmbed ? (
                    <div className="mt-2">
                      <iframe
                        src={"https://open.spotify.com/embed/artist/" + artist.spotifyId + "?utm_source=generator&theme=0"}
                        width="100%"
                        height="80"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="rounded-lg"
                      />
                    </div>
                  ) : null}
                  <div className="mt-auto pt-3 flex flex-col gap-2">
                    {artist.spotifyUrl && (
                      <a href={artist.spotifyUrl} target="_blank" rel="noopener noreferrer"
                        className="w-full text-xs font-semibold text-center py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition">
                        Listen on Spotify
                      </a>
                    )}
                    {artist.ticketUrl && (
                      <a href={artist.ticketUrl} target="_blank" rel="noopener noreferrer"
                        onClick={(e) => handleTicketClick(e, artist)}
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

      {emailModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">Get notified about these artists</h3>
            <p className="text-sm text-gray-600 mb-4">We will email you when new events go on sale for the artists you clicked.</p>
            <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3" />
            <div className="flex gap-2">
              <button onClick={submitEmail} className="flex-1 bg-black text-white py-2 rounded-lg font-semibold">Continue to tickets</button>
              <button onClick={() => { setEmailModalOpen(false); if (pendingTicketUrl) window.open(pendingTicketUrl, "_blank"); }}
                className="px-4 py-2 text-sm text-gray-600">Skip</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
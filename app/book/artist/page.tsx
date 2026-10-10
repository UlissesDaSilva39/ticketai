"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Music,
  Users,
  Sparkles,
  Check,
} from "lucide-react";
import BookingRequestModal from "@/components/booking/BookingRequestModal";

type Match = {
  id: string;
  slug: string;
  name: string;
  genre: string | null;
  secondary_genres: string[] | null;
  city: string | null;
  country: string | null;
  avatar_url: string | null;
  verified: boolean;
  artist_type: string | null;
  match: number;
  reasons: string[];
};

export default function BookArtistPage() {
  const [location, setLocation] = useState("London");
  const [date, setDate] = useState("");
  const [genre, setGenre] = useState("");
  const [capacity, setCapacity] = useState("");

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [openModal, setOpenModal] = useState<Match | null>(null);

  async function findArtists(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch("/api/book/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location,
          date,
          genre,
          capacity: capacity ? Number(capacity) : 0,
        }),
      });
      const data = await res.json();
      setMatches(data.matches || []);
    } catch {
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h1 className="text-2xl font-bold text-gray-900">Book an artist</h1>
          <p className="mt-1 text-sm text-gray-500">
            Tell us about your event and we will match you with artists.
          </p>

          <form onSubmit={findArtists} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                <MapPin className="inline h-3 w-3 mr-1" />
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="London"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                <Calendar className="inline h-3 w-3 mr-1" />
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                <Music className="inline h-3 w-3 mr-1" />
                Genre
              </label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="House"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                <Users className="inline h-3 w-3 mr-1" />
                Venue capacity
              </label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="800"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-50 transition"
              >
                {loading ? "Searching..." : "Find artists"}
              </button>
            </div>
          </form>
        </div>

        {searched && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-fuchsia-500" />
              <span className="text-xs font-semibold tracking-wider text-gray-500">
                AI MATCHES {matches.length > 0 ? `(${matches.length})` : ""}
              </span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 rounded-2xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : matches.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
                <Sparkles className="mx-auto h-8 w-8 text-gray-400" />
                <div className="mt-3 text-sm font-medium text-gray-900">
                  No matching artists
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Try broadening the genre or location.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-2xl border border-gray-200 bg-white p-5"
                  >
                    <div className="flex items-start gap-4">
                      {m.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={m.avatar_url}
                          alt={m.name}
                          className="h-14 w-14 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="grid h-14 w-14 place-items-center rounded-full bg-black text-sm font-bold text-white flex-shrink-0">
                          {m.name[0]}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`/artist/${m.slug}`}
                            className="text-base font-bold text-gray-900 hover:underline"
                          >
                            {m.name}
                          </Link>
                          {m.verified && (
                            <span className="rounded-full bg-black text-white px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold">
                              Verified
                            </span>
                          )}
                        </div>

                        <div className="mt-1 text-xs text-gray-500">
                          {[m.artist_type, m.genre, m.city].filter(Boolean).join(" · ")}
                        </div>

                        {m.reasons.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {m.reasons.map((r) => (
                              <span
                                key={r}
                                className="inline-flex items-center gap-1 rounded-full bg-green-50 text-green-700 px-2 py-0.5 text-[10px] font-medium"
                              >
                                <Check className="h-2.5 w-2.5" />
                                {r}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold text-gray-900">
                          {m.match}%
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-gray-400">
                          match
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link
                        href={`/artist/${m.slug}`}
                        className="rounded-full border border-gray-300 px-4 py-1.5 text-xs font-medium hover:bg-gray-50 transition"
                      >
                        View Profile
                      </Link>
                      <button
                        onClick={() => setOpenModal(m)}
                        className="rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white hover:bg-gray-900 transition"
                      >
                        Request Booking
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {openModal && (
        <BookingRequestModal
          artist={{ slug: openModal.slug, name: openModal.name }}
          query={{
            date,
            genre,
            capacity: capacity ? Number(capacity) : undefined,
          }}
          onClose={() => setOpenModal(null)}
        />
      )}
    </main>
  );
}

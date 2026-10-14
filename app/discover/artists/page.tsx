import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import { Search, MapPin, Mic, Check, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Discover Artists",
  description:
    "Browse every artist on GRID. Filter by genre, city, and availability. Book DJs, producers, vocalists, and bands.",
};

export const dynamic = "force-dynamic";

type Artist = {
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
};

const ARTIST_TYPES = [
  { key: "all", label: "All" },
  { key: "dj", label: "DJs" },
  { key: "producer", label: "Producers" },
  { key: "vocalist", label: "Vocalists" },
  { key: "band", label: "Bands" },
];

const GENRES = ["House", "Techno", "Hip-Hop", "Jazz", "Electronic", "Afrobeats"];
const CITIES = ["London", "Manchester", "Berlin", "Paris", "New York"];

function buildUrl(params: Record<string, string | undefined>) {
  const qs = Object.entries(params)
    .filter(([, v]) => v && v !== "all")
    .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
    .join("&");
  return "/discover/artists" + (qs ? `?${qs}` : "");
}

export default async function DiscoverArtistsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    type?: string;
    genre?: string;
    city?: string;
    available?: string;
  }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const type = params.type || "all";
  const genre = params.genre || "";
  const city = params.city || "";
  const available = params.available || "";

  const supabase = await createServerSupabase();

  let query = supabase
    .from("artists")
    .select(
      "id, slug, name, genre, secondary_genres, city, country, avatar_url, verified, artist_type"
    )
    .eq("status", "active")
    .order("verified", { ascending: false })
    .order("name", { ascending: true })
    .limit(60);

  if (q) {
    query = query.or(`name.ilike.%${q}%,genre.ilike.%${q}%,city.ilike.%${q}%`);
  }
  if (type && type !== "all") {
    query = query.eq("artist_type", type);
  }
  if (genre) {
    query = query.or(`genre.ilike.%${genre}%,secondary_genres.cs.{${genre}}`);
  }
  if (city) {
    query = query.ilike("city", `%${city}%`);
  }
  if (available === "1") {
    query = query.neq("available_for_bookings", false);
  }

  const { data: artists } = await query;
  const list = (artists ?? []) as Artist[];

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 py-10">
        {/* HEADER */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-fuchsia-500" />
            Discover
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">
            Discover artists
          </h1>
          <p className="mt-2 text-gray-500 max-w-2xl">
            Browse every artist on GRID. Filter by genre, city, and availability.
            Book DJs, producers, vocalists, and bands for your next event.
          </p>
        </div>

        {/* SEARCH + FILTERS */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <form
            action="/discover/artists"
            method="get"
            className="flex items-center rounded-full border border-gray-300 bg-white px-4 py-2 focus-within:border-black"
          >
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search by name, genre, or city..."
              className="flex-1 bg-transparent outline-none text-sm ml-2"
            />
            {genre && <input type="hidden" name="genre" value={genre} />}
            {city && <input type="hidden" name="city" value={city} />}
            {type !== "all" && <input type="hidden" name="type" value={type} />}
            <button
              type="submit"
              className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-900 transition"
            >
              Search
            </button>
          </form>

          {/* Type chips */}
          <div className="mt-5">
            <div className="text-xs font-semibold tracking-wider text-gray-500 mb-2">
              TYPE
            </div>
            <div className="flex flex-wrap gap-2">
              {ARTIST_TYPES.map((t) => (
                <Link
                  key={t.key}
                  href={buildUrl({ q, type: t.key === "all" ? undefined : t.key, genre, city, available })}
                  className={
                    "rounded-full px-4 py-1.5 text-xs font-medium transition " +
                    (type === t.key || (t.key === "all" && type === "all")
                      ? "bg-black text-white"
                      : "border border-gray-200 hover:bg-gray-50")
                  }
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Genre chips */}
          <div className="mt-5">
            <div className="text-xs font-semibold tracking-wider text-gray-500 mb-2">
              GENRES
            </div>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <Link
                  key={g}
                  href={buildUrl({ q, type, genre: genre === g ? undefined : g, city, available })}
                  className={
                    "rounded-full px-4 py-1.5 text-xs font-medium transition " +
                    (genre === g
                      ? "bg-black text-white"
                      : "border border-gray-200 hover:bg-gray-50")
                  }
                >
                  {g}
                </Link>
              ))}
            </div>
          </div>

          {/* City chips */}
          <div className="mt-5">
            <div className="text-xs font-semibold tracking-wider text-gray-500 mb-2">
              CITIES
            </div>
            <div className="flex flex-wrap gap-2">
              {CITIES.map((c) => (
                <Link
                  key={c}
                  href={buildUrl({ q, type, genre, city: city === c ? undefined : c, available })}
                  className={
                    "rounded-full px-4 py-1.5 text-xs font-medium transition " +
                    (city === c
                      ? "bg-black text-white"
                      : "border border-gray-200 hover:bg-gray-50")
                  }
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>

          {/* Available toggle */}
          <div className="mt-5">
            <Link
              href={buildUrl({ q, type, genre, city, available: available === "1" ? undefined : "1" })}
              className={
                "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition " +
                (available === "1"
                  ? "bg-green-600 text-white"
                  : "border border-gray-200 hover:bg-gray-50")
              }
            >
              <Check className="h-3.5 w-3.5" />
              Available for booking
            </Link>
          </div>

          {/* Clear */}
          {(q || type !== "all" || genre || city || available) && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <Link
                href="/discover/artists"
                className="text-xs font-medium text-gray-500 hover:text-black"
              >
                Clear all filters
              </Link>
            </div>
          )}
        </div>

        {/* RESULTS */}
        <div className="mb-4 text-sm text-gray-500">
          {list.length === 0 ? "No artists found" : `${list.length} ${list.length === 1 ? "artist" : "artists"} found`}
        </div>

        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <Mic className="mx-auto h-8 w-8 text-gray-400" />
            <div className="mt-3 text-sm font-medium text-gray-900">
              No artists match your filters
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Try broadening your search or clearing filters.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Link
                href="/discover/artists"
                className="rounded-full border border-gray-300 px-4 py-2 text-xs font-medium hover:bg-gray-50 transition"
              >
                Clear filters
              </Link>
              <Link
                href="/opportunities"
                className="rounded-full bg-black px-4 py-2 text-xs font-medium text-white hover:bg-gray-900 transition"
              >
                Post an opportunity
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {list.map((a) => (
              <div
                key={a.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-black transition"
              >
                <div className="flex items-start gap-3 mb-3">
                  {a.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.avatar_url}
                      alt={a.name}
                      className="h-14 w-14 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="grid h-14 w-14 place-items-center rounded-full bg-black text-sm font-bold text-white flex-shrink-0">
                      {a.name[0]}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Link
                        href={`/artist/${a.slug}`}
                        className="text-sm font-bold text-gray-900 hover:underline truncate"
                      >
                        {a.name}
                      </Link>
                      {a.verified && (
                        <span className="rounded-full bg-black text-white px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-semibold">
                          âœ“
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-xs text-gray-500 truncate">
                      {[a.artist_type, a.genre].filter(Boolean).join(" · ")}
                    </div>
                    {a.city && (
                      <div className="mt-0.5 inline-flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        {a.city}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/artist/${a.slug}`}
                    className="flex-1 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium text-center hover:bg-gray-50 transition"
                  >
                    View
                  </Link>
                  <Link
                    href={`/book/artist?artist=${a.slug}`}
                    className="flex-1 rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white text-center hover:bg-gray-900 transition"
                  >
                    Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <div className="text-sm font-medium text-gray-900">
            Can&apos;t find who you need?
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Post an opportunity and artists will apply.
          </p>
          <Link
            href="/opportunities"
            className="mt-4 inline-block rounded-full bg-black px-5 py-2 text-xs font-medium text-white hover:bg-gray-900 transition"
          >
            Post opportunity
          </Link>
        </div>
      </div>
    </main>
  );
}

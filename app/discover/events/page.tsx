import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import { Search, MapPin, Calendar, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Discover Events",
  description:
    "Find your next live experience on GRID. Filter by date, city, genre, and price. Buy tickets for events near you.",
};

export const dynamic = "force-dynamic";

type TicketType = { name: string; price: number };

type EventRow = {
  id: string;
  title: string;
  start_date: string;
  hero_image: string | null;
  ticket_types: TicketType[] | null;
  venue_id: string | null;
  venues: {
    name: string | null;
    city: string | null;
  } | null;
};

const WHEN_OPTIONS = [
  { key: "tonight", label: "Tonight" },
  { key: "weekend", label: "This Weekend" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
];

const CITIES = ["London", "Manchester", "Birmingham", "Berlin", "Paris", "New York"];

const GENRES = ["House", "Techno", "Hip-Hop", "Jazz", "Electronic", "Afrobeats"];

const PRICE_OPTIONS = [
  { key: "free", label: "Free" },
  { key: "under20", label: "Under £20" },
  { key: "mid", label: "£20-£50" },
  { key: "high", label: "£50+" },
];

function buildUrl(params: Record<string, string | undefined>) {
  const qs = Object.entries(params)
    .filter(([, v]) => v && v !== "all")
    .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
    .join("&");
  return "/discover/events" + (qs ? `?${qs}` : "");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function minPrice(ticketTypes: TicketType[] | null): number | null {
  if (!ticketTypes || ticketTypes.length === 0) return null;
  const prices = ticketTypes.map((t) => t.price).filter((p) => typeof p === "number");
  if (prices.length === 0) return null;
  return Math.min(...prices);
}

export default async function DiscoverEventsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    when?: string;
    city?: string;
    genre?: string;
    price?: string;
  }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const when = params.when || "";
  const city = params.city || "";
  const genre = params.genre || "";
  const price = params.price || "";

  const supabase = await createServerSupabase();

  const now = new Date();
  const in2Days = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  // Join with venues to get city + name
  let query = supabase
    .from("events")
    .select(
      `
      id, title, start_date, hero_image, ticket_types, venue_id,
      venues!events_venue_id_fkey(name, city)
    `
    )
    .eq("status", "published")
    .gte("start_date", now.toISOString())
    .order("start_date", { ascending: true })
    .limit(60);

  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  }
  if (when === "tonight") {
    query = query.lte("start_date", in2Days.toISOString());
  } else if (when === "weekend" || when === "week") {
    query = query.lte("start_date", in7Days.toISOString());
  } else if (when === "month") {
    query = query.lte("start_date", in30Days.toISOString());
  }

  const { data: events, error } = await query;
  let list = (events ?? []) as unknown as EventRow[];

  // Client-side filter for city (requires joining)
  if (city) {
    list = list.filter((e) =>
      e.venues?.city?.toLowerCase().includes(city.toLowerCase())
    );
  }

  // Client-side filter for genre (title/description)
  if (genre) {
    const gl = genre.toLowerCase();
    list = list.filter((e) => e.title.toLowerCase().includes(gl));
  }

  // Client-side filter for price
  if (price) {
    list = list.filter((e) => {
      const min = minPrice(e.ticket_types);
      if (price === "free") return min === 0 || min === null;
      if (price === "under20") return min !== null && min < 20 && min > 0;
      if (price === "mid") return min !== null && min >= 20 && min < 50;
      if (price === "high") return min !== null && min >= 50;
      return true;
    });
  }

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
            Discover events
          </h1>
          <p className="mt-2 text-gray-500 max-w-2xl">
            Find your next live experience. Filter by date, city, genre, and price.
          </p>
        </div>

        {/* FILTERS */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <form
            action="/discover/events"
            method="get"
            className="flex items-center rounded-full border border-gray-300 bg-white px-4 py-2 focus-within:border-black"
          >
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search by event, artist, or venue..."
              className="flex-1 bg-transparent outline-none text-sm ml-2"
            />
            {when && <input type="hidden" name="when" value={when} />}
            {city && <input type="hidden" name="city" value={city} />}
            {genre && <input type="hidden" name="genre" value={genre} />}
            {price && <input type="hidden" name="price" value={price} />}
            <button
              type="submit"
              className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-900 transition"
            >
              Search
            </button>
          </form>

          {/* When chips */}
          <div className="mt-5">
            <div className="text-xs font-semibold tracking-wider text-gray-500 mb-2">
              WHEN
            </div>
            <div className="flex flex-wrap gap-2">
              {WHEN_OPTIONS.map((w) => (
                <Link
                  key={w.key}
                  href={buildUrl({ q, when: when === w.key ? undefined : w.key, city, genre, price })}
                  className={
                    "rounded-full px-4 py-1.5 text-xs font-medium transition " +
                    (when === w.key
                      ? "bg-black text-white"
                      : "border border-gray-200 hover:bg-gray-50")
                  }
                >
                  {w.label}
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
                  href={buildUrl({ q, when, city: city === c ? undefined : c, genre, price })}
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

          {/* Genre chips */}
          <div className="mt-5">
            <div className="text-xs font-semibold tracking-wider text-gray-500 mb-2">
              GENRES
            </div>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <Link
                  key={g}
                  href={buildUrl({ q, when, city, genre: genre === g ? undefined : g, price })}
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

          {/* Price chips */}
          <div className="mt-5">
            <div className="text-xs font-semibold tracking-wider text-gray-500 mb-2">
              PRICE
            </div>
            <div className="flex flex-wrap gap-2">
              {PRICE_OPTIONS.map((p) => (
                <Link
                  key={p.key}
                  href={buildUrl({ q, when, city, genre, price: price === p.key ? undefined : p.key })}
                  className={
                    "rounded-full px-4 py-1.5 text-xs font-medium transition " +
                    (price === p.key
                      ? "bg-black text-white"
                      : "border border-gray-200 hover:bg-gray-50")
                  }
                >
                  {p.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Clear */}
          {(q || when || city || genre || price) && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <Link
                href="/discover/events"
                className="text-xs font-medium text-gray-500 hover:text-black"
              >
                Clear all filters
              </Link>
            </div>
          )}
        </div>

        {/* RESULTS */}
        <div className="mb-4 text-sm text-gray-500">
          {list.length === 0
            ? "No events found"
            : `${list.length} ${list.length === 1 ? "event" : "events"} found`}
        </div>

        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <Calendar className="mx-auto h-8 w-8 text-gray-400" />
            <div className="mt-3 text-sm font-medium text-gray-900">
              No events match your filters
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Try broadening your search or clearing filters.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Link
                href="/discover/events"
                className="rounded-full border border-gray-300 px-4 py-2 text-xs font-medium hover:bg-gray-50 transition"
              >
                Clear filters
              </Link>
              <Link
                href="/for-promoters"
                className="rounded-full bg-black px-4 py-2 text-xs font-medium text-white hover:bg-gray-900 transition"
              >
                Promote your event
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {list.map((e) => {
              const min = minPrice(e.ticket_types);
              return (
                <Link
                  key={e.id}
                  href={`/event/${e.id}`}
                  className="group rounded-2xl border border-gray-200 bg-white overflow-hidden hover:border-black transition"
                >
                  <div className="relative h-40 bg-gradient-to-br from-fuchsia-500 to-cyan-400">
                    {e.hero_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={e.hero_image}
                        alt={e.title}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-white text-2xl font-black">
                        {e.title[0]}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-sm font-bold text-gray-900 truncate">
                      {e.title}
                    </div>

                    <div className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {formatDate(e.start_date)} · {formatTime(e.start_date)}
                    </div>

                    {(e.venues?.city || e.venues?.name) && (
                      <div className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        {[e.venues?.city, e.venues?.name].filter(Boolean).join(" · ")}
                      </div>
                    )}

                    {min !== null && (
                      <div className="mt-2 text-sm font-medium text-gray-900">
                        {min === 0 ? "Free" : `From £${min.toFixed(2)}`}
                      </div>
                    )}

                    <div className="mt-3 rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white text-center group-hover:bg-gray-900 transition">
                      Get tickets
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <div className="text-sm font-medium text-gray-900">
            Running an event?
          </div>
          <p className="mt-1 text-xs text-gray-500">
            List it on GRID to sell tickets and reach the audience.
          </p>
          <Link
            href="/for-promoters"
            className="mt-4 inline-block rounded-full bg-black px-5 py-2 text-xs font-medium text-white hover:bg-gray-900 transition"
          >
            List your event
          </Link>
        </div>
      </div>
    </main>
  );
}

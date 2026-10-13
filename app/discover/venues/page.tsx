import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import { Search, MapPin, Building2, Users, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Discover Venues",
  description:
    "Browse every venue on GRID. Filter by city, capacity, and genre. Find the perfect space for your next event.",
};

export const dynamic = "force-dynamic";

type Venue = {
  id: string;
  slug: string;
  name: string;
  venue_type: string | null;
  city: string | null;
  country: string | null;
  capacity: number | null;
  hero_image: string | null;
};

const VENUE_TYPES = [
  { key: "all", label: "All" },
  { key: "nightclub", label: "Nightclubs" },
  { key: "pub", label: "Pubs" },
  { key: "bar", label: "Bars" },
  { key: "theatre", label: "Theatres" },
  { key: "festival", label: "Festivals" },
  { key: "warehouse", label: "Warehouses" },
];

const CITIES = ["London", "Manchester", "Berlin", "Paris", "New York"];

const CAPACITIES = [
  { key: "small", label: "Under 200" },
  { key: "medium", label: "200-500" },
  { key: "large", label: "500-1500" },
  { key: "huge", label: "1500+" },
];

function buildUrl(params: Record<string, string | undefined>) {
  const qs = Object.entries(params)
    .filter(([, v]) => v && v !== "all")
    .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
    .join("&");
  return "/discover/venues" + (qs ? `?${qs}` : "");
}

function formatCapacity(n: number | null) {
  if (!n) return "—";
  return n.toLocaleString("en-GB");
}

export default async function DiscoverVenuesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    type?: string;
    city?: string;
    capacity?: string;
  }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const type = params.type || "all";
  const city = params.city || "";
  const capacity = params.capacity || "";

  const supabase = await createServerSupabase();

  let query = supabase
    .from("venues")
    .select("id, slug, name, venue_type, city, country, capacity, hero_image")
    .eq("status", "published")
    .order("name", { ascending: true })
    .limit(60);

  if (q) {
    query = query.or(`name.ilike.%${q}%,city.ilike.%${q}%,venue_type.ilike.%${q}%`);
  }
  if (type && type !== "all") {
    query = query.eq("venue_type", type);
  }
  if (city) {
    query = query.ilike("city", `%${city}%`);
  }
  if (capacity === "small") {
    query = query.lt("capacity", 200).gt("capacity", 0);
  } else if (capacity === "medium") {
    query = query.gte("capacity", 200).lt("capacity", 500);
  } else if (capacity === "large") {
    query = query.gte("capacity", 500).lt("capacity", 1500);
  } else if (capacity === "huge") {
    query = query.gte("capacity", 1500);
  }

  const { data: venues } = await query;
  const list = (venues ?? []) as Venue[];

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
            Discover venues
          </h1>
          <p className="mt-2 text-gray-500 max-w-2xl">
            Browse every venue on GRID. Filter by city, capacity, and venue type.
            Find the perfect space for your next event.
          </p>
        </div>

        {/* FILTERS */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <form
            action="/discover/venues"
            method="get"
            className="flex items-center rounded-full border border-gray-300 bg-white px-4 py-2 focus-within:border-black"
          >
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search by name, city, or type..."
              className="flex-1 bg-transparent outline-none text-sm ml-2"
            />
            {type !== "all" && <input type="hidden" name="type" value={type} />}
            {city && <input type="hidden" name="city" value={city} />}
            {capacity && <input type="hidden" name="capacity" value={capacity} />}
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
              VENUE TYPE
            </div>
            <div className="flex flex-wrap gap-2">
              {VENUE_TYPES.map((t) => (
                <Link
                  key={t.key}
                  href={buildUrl({ q, type: t.key === "all" ? undefined : t.key, city, capacity })}
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

          {/* Capacity chips */}
          <div className="mt-5">
            <div className="text-xs font-semibold tracking-wider text-gray-500 mb-2">
              CAPACITY
            </div>
            <div className="flex flex-wrap gap-2">
              {CAPACITIES.map((c) => (
                <Link
                  key={c.key}
                  href={buildUrl({ q, type, city, capacity: capacity === c.key ? undefined : c.key })}
                  className={
                    "rounded-full px-4 py-1.5 text-xs font-medium transition " +
                    (capacity === c.key
                      ? "bg-black text-white"
                      : "border border-gray-200 hover:bg-gray-50")
                  }
                >
                  {c.label}
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
                  href={buildUrl({ q, type, city: city === c ? undefined : c, capacity })}
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

          {/* Clear */}
          {(q || type !== "all" || city || capacity) && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <Link
                href="/discover/venues"
                className="text-xs font-medium text-gray-500 hover:text-black"
              >
                Clear all filters
              </Link>
            </div>
          )}
        </div>

        {/* RESULTS */}
        <div className="mb-4 text-sm text-gray-500">
          {list.length === 0 ? "No venues found" : `${list.length} ${list.length === 1 ? "venue" : "venues"} found`}
        </div>

        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <Building2 className="mx-auto h-8 w-8 text-gray-400" />
            <div className="mt-3 text-sm font-medium text-gray-900">
              No venues match your filters
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Try broadening your search or clearing filters.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Link
                href="/discover/venues"
                className="rounded-full border border-gray-300 px-4 py-2 text-xs font-medium hover:bg-gray-50 transition"
              >
                Clear filters
              </Link>
              <Link
                href="/venues/join"
                className="rounded-full bg-black px-4 py-2 text-xs font-medium text-white hover:bg-gray-900 transition"
              >
                List your venue
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {list.map((v) => (
              <div
                key={v.id}
                className="rounded-2xl border border-gray-200 bg-white overflow-hidden hover:border-black transition"
              >
                <div className="relative h-32 bg-gradient-to-br from-fuchsia-500 to-cyan-400">
                  {v.hero_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={v.hero_image}
                      alt={v.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-white text-2xl font-black">
                      {v.name[0]}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <Link
                    href={`/venue/${v.slug}`}
                    className="text-sm font-bold text-gray-900 hover:underline block truncate"
                  >
                    {v.name}
                  </Link>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    {v.venue_type && (
                      <span className="capitalize">{v.venue_type}</span>
                    )}
                    {v.city && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {v.city}
                      </span>
                    )}
                  </div>

                  {v.capacity && (
                    <div className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500">
                      <Users className="h-3 w-3" />
                      {formatCapacity(v.capacity)} capacity
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/venue/${v.slug}`}
                      className="flex-1 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium text-center hover:bg-gray-50 transition"
                    >
                      View
                    </Link>
                    <Link
                      href={`/venue/${v.slug}#enquire`}
                      className="flex-1 rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white text-center hover:bg-gray-900 transition"
                    >
                      Enquire
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <div className="text-sm font-medium text-gray-900">
            Run a venue?
          </div>
          <p className="mt-1 text-xs text-gray-500">
            List it on GRID to receive booking enquiries from promoters.
          </p>
          <Link
            href="/venues/join"
            className="mt-4 inline-block rounded-full bg-black px-5 py-2 text-xs font-medium text-white hover:bg-gray-900 transition"
          >
            List your venue
          </Link>
        </div>
      </div>
    </main>
  );
}

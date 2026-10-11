import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import { Search, MapPin, Mic, Check, Sparkles, Users, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Discover Promoters",
  description:
    "Browse every promoter on GRID. Filter by city and discover who's booking artists and running events.",
};

export const dynamic = "force-dynamic";

type Promoter = {
  id: string;
  display_name: string | null;
  bio: string | null;
  city: string | null;
  verified: boolean;
  commission_rate: number | null;
};

const CITIES = ["London", "Manchester", "Birmingham", "Berlin", "Paris", "New York"];

function buildUrl(params: Record<string, string | undefined>) {
  const qs = Object.entries(params)
    .filter(([, v]) => v && v !== "all")
    .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
    .join("&");
  return "/discover/promoters" + (qs ? `?${qs}` : "");
}

export default async function DiscoverPromotersPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    city?: string;
    verified?: string;
  }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const city = params.city || "";
  const verified = params.verified || "";

  const supabase = await createServerSupabase();

  let query = supabase
    .from("promoters")
    .select("id, display_name, bio, city, verified, commission_rate")
    .order("verified", { ascending: false })
    .order("display_name", { ascending: true })
    .limit(60);

  if (q) {
    query = query.or(`display_name.ilike.%${q}%,city.ilike.%${q}%,bio.ilike.%${q}%`);
  }
  if (city) {
    query = query.ilike("city", `%${city}%`);
  }
  if (verified === "1") {
    query = query.eq("verified", true);
  }

  const { data: promoters } = await query;
  const list = (promoters ?? []) as Promoter[];

  // Enrich with event counts
  const promoterIds = list.map((p) => p.id);
  const eventCountMap: Record<string, number> = {};

  if (promoterIds.length > 0) {
    const { data: promoterEvents } = await supabase
      .from("promoter_events")
      .select("promoter_id")
      .in("promoter_id", promoterIds);

    (promoterEvents ?? []).forEach((pe: any) => {
      eventCountMap[pe.promoter_id] = (eventCountMap[pe.promoter_id] || 0) + 1;
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
            Discover promoters
          </h1>
          <p className="mt-2 text-gray-500 max-w-2xl">
            Browse every promoter on GRID. Filter by city and discover who&apos;s
            actively booking artists and running events.
          </p>
        </div>

        {/* FILTERS */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <form
            action="/discover/promoters"
            method="get"
            className="flex items-center rounded-full border border-gray-300 bg-white px-4 py-2 focus-within:border-black"
          >
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search by name, city, or event focus..."
              className="flex-1 bg-transparent outline-none text-sm ml-2"
            />
            {city && <input type="hidden" name="city" value={city} />}
            {verified && <input type="hidden" name="verified" value={verified} />}
            <button
              type="submit"
              className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-900 transition"
            >
              Search
            </button>
          </form>

          {/* City chips */}
          <div className="mt-5">
            <div className="text-xs font-semibold tracking-wider text-gray-500 mb-2">
              CITIES
            </div>
            <div className="flex flex-wrap gap-2">
              {CITIES.map((c) => (
                <Link
                  key={c}
                  href={buildUrl({ q, city: city === c ? undefined : c, verified })}
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

          {/* Verified toggle */}
          <div className="mt-5">
            <Link
              href={buildUrl({ q, city, verified: verified === "1" ? undefined : "1" })}
              className={
                "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition " +
                (verified === "1"
                  ? "bg-green-600 text-white"
                  : "border border-gray-200 hover:bg-gray-50")
              }
            >
              <Check className="h-3.5 w-3.5" />
              Verified promoters only
            </Link>
          </div>

          {/* Clear */}
          {(q || city || verified) && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <Link
                href="/discover/promoters"
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
            ? "No promoters found"
            : `${list.length} ${list.length === 1 ? "promoter" : "promoters"} found`}
        </div>

        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <Mic className="mx-auto h-8 w-8 text-gray-400" />
            <div className="mt-3 text-sm font-medium text-gray-900">
              No promoters match your filters
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Try broadening your search or clearing filters.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Link
                href="/discover/promoters"
                className="rounded-full border border-gray-300 px-4 py-2 text-xs font-medium hover:bg-gray-50 transition"
              >
                Clear filters
              </Link>
              <Link
                href="/promoters/join"
                className="rounded-full bg-black px-4 py-2 text-xs font-medium text-white hover:bg-gray-900 transition"
              >
                Become a promoter
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {list.map((p) => {
              const name = p.display_name || "Unnamed promoter";
              const eventCount = eventCountMap[p.id] || 0;
              const initials = name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={p.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-black transition"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-black text-sm font-bold text-white flex-shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Link
                          href={`/promoters/${p.id}`}
                          className="text-sm font-bold text-gray-900 hover:underline truncate"
                        >
                          {name}
                        </Link>
                        {p.verified && (
                          <span className="rounded-full bg-black text-white px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-semibold">
                            ✓
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        {p.city && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {p.city}
                          </span>
                        )}
                        {eventCount > 0 && (
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {eventCount} {eventCount === 1 ? "event" : "events"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {p.bio && (
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                      {p.bio}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Link
                      href={`/promoters/${p.id}`}
                      className="flex-1 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium text-center hover:bg-gray-50 transition"
                    >
                      View
                    </Link>
                    <Link
                      href={`/promoters/${p.id}`}
                      className="flex-1 rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white text-center hover:bg-gray-900 transition"
                    >
                      Follow
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <div className="text-sm font-medium text-gray-900">
            Run events?
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Create your promoter profile on GRID to be found by artists and venues.
          </p>
          <Link
            href="/promoters/join"
            className="mt-4 inline-block rounded-full bg-black px-5 py-2 text-xs font-medium text-white hover:bg-gray-900 transition"
          >
            Create promoter profile
          </Link>
        </div>
      </div>
    </main>
  );
}

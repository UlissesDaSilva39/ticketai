import { createServerSupabase } from "@/lib/supabase/server";
import { EventCard } from "@/components/EventCard";
import Link from "next/link";
import { Suspense } from "react";
import type { Event } from "@/lib/types";
import SearchFilters from "@/components/SearchFilters";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; sort?: string; city?: string; when?: string; price?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const type = params.type || "all";
  const sort = params.sort || "upcoming";
  const city = params.city || "";
  const when = params.when || "";
  const price = params.price || "";

  const supabase = await createServerSupabase();

  let query = supabase.from("events").select("*").eq("status", "published");

  if (q) {
    query = query.or("title.ilike.%" + q + "%,description.ilike.%" + q + "%");
  }
  if (type !== "all") {
    query = query.eq("event_type", type);
  }

  // City filter â€” via venue lookup
  if (city) {
    const { data: venueRows } = await supabase
      .from("venues")
      .select("id")
      .ilike("city", city);
    const venueIds = (venueRows || []).map((v) => v.id);
    if (venueIds.length > 0) {
      query = query.in("venue_id", venueIds);
    } else {
      // No venues match â€” force no results
      query = query.eq("id", "00000000-0000-0000-0000-000000000000");
    }
  }

  // When filter
  if (when === "7days" || when === "weekend") {
    const end = new Date();
    end.setDate(end.getDate() + (when === "weekend" ? 3 : 7));
    query = query
      .gte("start_date", new Date().toISOString())
      .lte("start_date", end.toISOString());
  } else if (when === "30days") {
    const end = new Date();
    end.setDate(end.getDate() + 30);
    query = query
      .gte("start_date", new Date().toISOString())
      .lte("start_date", end.toISOString());
  }

  if (sort === "newest") {
    query = query.order("created_at", { ascending: false });
  } else if (sort === "popular") {
    query = query.order("views", { ascending: false });
  } else {
    query = query.order("start_date", { ascending: true });
  }

  const { data: events } = await query;

  let artistQuery = supabase
    .from("artists")
    .select("slug, name, handle, genre, city, country, avatar_url, artist_type")
    .eq("status", "active");
  if (q) {
    artistQuery = artistQuery.or("name.ilike.%" + q + "%,handle.ilike.%" + q + "%,genre.ilike.%" + q + "%,city.ilike.%" + q + "%");
  }
  if (city) {
    artistQuery = artistQuery.ilike("city", city);
  }
  artistQuery = artistQuery.order("name", { ascending: true }).limit(12);
  const { data: artists } = await artistQuery;
  let eventList = (events as Event[]) || [];

  // Price filter â€” post-fetch because ticket_types is JSON
  if (price) {
    const priceOf = (e: Event): number => {
      const types = Array.isArray(e.ticket_types) ? e.ticket_types : [];
      if (types.length === 0) return 0;
      return Math.min(...types.map((t) => Number(t.price || 0)));
    };
    eventList = eventList.filter((e) => {
      const p = priceOf(e);
      if (price === "free") return p === 0;
      if (price === "under20") return p > 0 && p < 20;
      if (price === "20-50") return p >= 20 && p <= 50;
      if (price === "50plus") return p > 50;
      return true;
    });
  }
  const eventIds = eventList.map((e) => e.id);

  const soldMap: Record<string, number> = {};
  if (eventIds.length > 0) {
    const { data: tickets } = await supabase
      .from("tickets")
      .select("event_id")
      .in("event_id", eventIds)
      .neq("status", "cancelled");
    for (const t of tickets || []) {
      soldMap[t.event_id] = (soldMap[t.event_id] || 0) + 1;
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-black">â† Back to Home</Link>
      </div>
      <h1 className="text-5xl md:text-6xl font-bold mb-8 uppercase" style={{ fontFamily: "var(--font-antonio)" }}>
        SEARCH EVENTS
      </h1>
      <Suspense fallback={<div className="h-32 bg-gray-50 rounded-lg mb-8" />}>
        <SearchFilters />
      </Suspense>
      <div className="mb-6">
        <p className="text-gray-500">
          {eventList.length} {eventList.length === 1 ? "event" : "events"} found
        </p>
      </div>
      {artists && artists.length > 0 && (
        <section className="mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-lg font-bold">Artists ({artists.length})</h2>
            <Link href="/artists" className="text-xs text-gray-500 hover:text-black">See all</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {artists.map((a) => (
              <Link key={a.slug} href={"/artist/" + a.slug} className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-black transition flex items-center gap-3">
                {a.avatar_url ? (
                  <img src={a.avatar_url} alt={a.name} className="w-12 h-12 rounded-full object-cover border border-gray-200 flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-black text-white grid place-items-center font-bold text-sm flex-shrink-0">
                    {(a.name || "?").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">{a.name}</div>
                  <div className="text-xs text-gray-500 truncate">{a.genre}{a.city ? " · " + a.city : ""}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {eventList.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-16 text-center">
          <p className="text-lg text-gray-500 mb-4">No events match your search.</p>
          <Link href="/search" className="text-sm underline">Clear filters</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {eventList.map((event) => (
            <EventCard key={event.id} event={event} soldCount={soldMap[event.id] || 0} />
          ))}
        </div>
      )}
    </div>
  );
}


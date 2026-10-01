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
  searchParams: Promise<{ q?: string; type?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const type = params.type || "all";
  const sort = params.sort || "upcoming";

  const supabase = await createServerSupabase();

  let query = supabase.from("events").select("*").eq("status", "published");

  if (q) {
    query = query.or("title.ilike.%" + q + "%,description.ilike.%" + q + "%");
  }
  if (type !== "all") {
    query = query.eq("event_type", type);
  }

  if (sort === "newest") {
    query = query.order("created_at", { ascending: false });
  } else if (sort === "popular") {
    query = query.order("views", { ascending: false });
  } else {
    query = query.order("start_date", { ascending: true });
  }

  const { data: events } = await query;
  const eventList = (events as Event[]) || [];
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
        <Link href="/" className="text-sm text-gray-500 hover:text-black">← Back to Home</Link>
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


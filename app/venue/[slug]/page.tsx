import { createClient } from "@/lib/supabase/server";
import { EventCard } from "@/components/EventCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Venue, Event } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: venue } = await supabase
    .from("venues")
    .select("name, description, hero_image, city")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!venue) return { title: "Venue not found" };
  const desc = venue.description || ("Events at " + venue.name + (venue.city ? ", " + venue.city : "") + ".");

  return {
    title: venue.name,
    description: desc,
    openGraph: {
      title: venue.name,
      description: desc,
      type: "website",
      images: venue.hero_image ? [{ url: venue.hero_image, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: venue.name,
      description: desc,
      images: venue.hero_image ? [venue.hero_image] : [],
    },
  };
}

export default async function VenuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: venue } = await supabase
    .from("venues")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!venue) return notFound();
  const v = venue as Venue;

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("venue_id", v.id)
    .eq("status", "published")
    .order("start_date", { ascending: true });

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
    <div>
      <div className="relative h-[50vh] bg-gray-200">
        {v.hero_image && (
          <img src={v.hero_image} alt="" aria-hidden="true" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold text-white leading-none uppercase" style={{ fontFamily: "var(--font-antonio)" }}>
            {v.name}
          </h1>
          <p className="text-white/80 mt-3 text-lg">
            {v.city}
            {v.capacity ? " · " + v.capacity + " capacity" : ""}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-4 uppercase" style={{ fontFamily: "var(--font-antonio)" }}>About</h2>
            <p className="text-gray-700 leading-relaxed">{v.description || "No description yet."}</p>
          </div>
          <div className="space-y-4 text-sm">
            {v.address_line1 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Address</p>
                <p>{v.address_line1}</p>
                {v.address_line2 && <p>{v.address_line2}</p>}
                <p>{v.city}{v.postcode ? ", " + v.postcode : ""}</p>
                {v.country && <p>{v.country}</p>}
              </div>
            )}
            {v.venue_type && (
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Type</p>
                <p className="capitalize">{v.venue_type}</p>
              </div>
            )}
            {v.capacity && (
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Capacity</p>
                <p>{v.capacity.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mb-8 uppercase" style={{ fontFamily: "var(--font-antonio)" }}>Upcoming Events</h2>

        {eventList.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <p className="text-lg text-gray-500">No upcoming events at this venue yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {eventList.map((event) => (
              <EventCard key={event.id} event={event} soldCount={soldMap[event.id] || 0} likeCount={likeCounts[event.id] || 0} userLiked={userLikes[event.id] || false} followerCount={followerCounts[event.organizer_id] || 0} userFollowing={userFollows[event.organizer_id] || false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { EventCard } from "@/components/EventCard";
import FollowButton from "@/components/FollowButton";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Event } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", id)
    .single();
  return { title: profile?.full_name || "Organizer" };
}

export default async function OrganizerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!profile) return notFound();

  const { data: { user } } = await supabase.auth.getUser();

  const { count: followerCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("organizer_id", id);

  let userFollowing = false;
  if (user && user.id !== id) {
    const { data: follow } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("organizer_id", id)
      .maybeSingle();
    userFollowing = !!follow;
  }

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", id)
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

  const initials = (profile.full_name || "Organizer")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-black">← Back to Home</Link>
      </div>

      <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
        <div className="w-32 h-32 rounded-full bg-black text-white flex items-center justify-center text-5xl font-bold flex-shrink-0" style={{ fontFamily: "var(--font-antonio)" }}>
          {initials}
        </div>
        <div className="flex-1">
          <h1 className="text-5xl md:text-6xl font-bold mb-3 uppercase" style={{ fontFamily: "var(--font-antonio)" }}>
            {profile.full_name || "Organizer"}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-4">
            {profile.city && <span>📍 {profile.city}</span>}
            <span>👥 {followerCount || 0} followers</span>
            <span>🎟️ {eventList.length} events</span>
          </div>
          {profile.bio && (
            <p className="text-gray-700 leading-relaxed max-w-2xl mb-6">{profile.bio}</p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            {user && user.id !== id && (
              <FollowButton
                organizerId={id}
                initialFollowing={userFollowing}
                initialCount={followerCount || 0}
              />
            )}
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 border-2 border-gray-300 text-sm font-medium rounded-full hover:border-black">
                Website
              </a>
            )}
            {profile.instagram && (
              <a href={"https://instagram.com/" + profile.instagram} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 border-2 border-gray-300 text-sm font-medium rounded-full hover:border-black">
                Instagram
              </a>
            )}
            {profile.twitter && (
              <a href={"https://twitter.com/" + profile.twitter} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 border-2 border-gray-300 text-sm font-medium rounded-full hover:border-black">
                X
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 uppercase" style={{ fontFamily: "var(--font-antonio)" }}>
          EVENTS
        </h2>
        {eventList.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <p className="text-gray-500">This organizer has no upcoming events yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {eventList.map((event) => (
              <EventCard key={event.id} event={event} soldCount={soldMap[event.id] || 0} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { createServerSupabase } from "@/lib/supabase/server";
import { EventCard } from "@/components/EventCard";
import FriendButton from "@/components/FriendButton";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Event } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createServerSupabase();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .ilike("username", username)
    .eq("is_public", true)
    .maybeSingle();

  if (!profile) return notFound();

  const { data: { user } } = await supabase.auth.getUser();
  const isOwnProfile = user?.id === profile.id;

  let friendship: string | null = null;
  let friendshipIsIncoming = false;
  if (user && !isOwnProfile) {
    const { data: f } = await supabase
      .from("friendships")
      .select("status, user_id")
      .or("and(user_id.eq." + user.id + ",friend_id.eq." + profile.id + "),and(user_id.eq." + profile.id + ",friend_id.eq." + user.id + ")")
      .maybeSingle();
    if (f) {
      friendship = f.status;
      friendshipIsIncoming = f.user_id !== user.id;
    }
  }

  const { data: interestRows } = await supabase
    .from("event_interest")
    .select("event_id, status")
    .eq("user_id", profile.id);

  const goingIds = (interestRows || [])
    .filter((i) => i.status === "going")
    .map((i) => i.event_id);
  const interestedIds = (interestRows || [])
    .filter((i) => i.status === "interested")
    .map((i) => i.event_id);

  const allIds = [...goingIds, ...interestedIds];
  let events: Event[] = [];
  if (allIds.length > 0) {
    const { data: ev } = await supabase
      .from("events")
      .select("*")
      .in("id", allIds);
    events = (ev as Event[]) || [];
  }

  const initials = (profile.full_name || "?")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
        <div
          className="w-32 h-32 rounded-full bg-black text-white flex items-center justify-center text-5xl font-bold flex-shrink-0"
          style={{ fontFamily: "var(--font-antonio)" }}
        >
          {initials}
        </div>
        <div className="flex-1">
          <h1
            className="text-5xl md:text-6xl font-bold mb-3 uppercase"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            {profile.full_name || profile.username}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-4">
            {profile.username && <span>@{profile.username}</span>}
            {profile.city && <span>{profile.city}</span>}
            <span>{goingIds.length} going</span>
            <span>{interestedIds.length} interested</span>
          </div>
          {profile.bio && (
            <p className="text-gray-700 leading-relaxed max-w-2xl mb-6">
              {profile.bio}
            </p>
          )}
          {!isOwnProfile && user && (
            <FriendButton
              friendId={profile.id}
              initialStatus={
                friendship === "pending" && friendshipIsIncoming
                  ? null
                  : friendship
              }
            />
          )}
          {isOwnProfile &&
            (profile.role === "promoter" || profile.role === "admin") && (
              <Link
                href="/organizer/profile"
                className="inline-block px-5 py-2.5 border-2 border-black text-sm font-medium rounded-full hover:bg-gray-50"
              >
                Edit Profile
              </Link>
            )}
        </div>
      </div>

      {goingIds.length > 0 && (
        <div className="mb-12">
          <h2
            className="text-4xl font-bold mb-6 uppercase"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            GOING TO
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {events
              .filter((e) => goingIds.includes(e.id))
              .map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
          </div>
        </div>
      )}

      {interestedIds.length > 0 && (
        <div className="mb-12">
          <h2
            className="text-4xl font-bold mb-6 uppercase"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            INTERESTED IN
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {events
              .filter((e) => interestedIds.includes(e.id))
              .map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
          </div>
        </div>
      )}

      {events.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-500">No public activity yet.</p>
        </div>
      )}
    </div>
  );
}
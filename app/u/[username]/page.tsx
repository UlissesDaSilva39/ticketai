import { createServerSupabase } from "@/lib/supabase/server";
import { PUBLIC_PROFILE_COLUMNS } from "@/lib/db/public-columns";
import { createAdminClient } from "@/lib/supabase/admin";
import { EventCard } from "@/components/EventCard";
import FriendButton from "@/components/FriendButton";
import MessageButton from "@/components/MessageButton";
import TipButton from "@/components/coins/TipButton";
import PromoteButton from "@/components/promote/PromoteButton";
import { Crown } from "lucide-react";
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

  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select(PUBLIC_PROFILE_COLUMNS)
    .ilike("username", username)
    .maybeSingle();

  // Private profiles are only visible to their owner.
  if (!profile || (!profile.is_public && profile.id !== user?.id)) return notFound();

  // Backstage (fan memberships): show "Join" when the artist has opened it.
  const { data: backstageTiers } = await createAdminClient().from("backstage_tiers").select("price_pence").eq("artist_id", profile.id).eq("active", true);
  const backstageFrom = backstageTiers?.length ? Math.min(...backstageTiers.map((t) => t.price_pence)) : null;
  const displayName = profile.full_name && !profile.full_name.includes("@") ? profile.full_name : profile.username;

  const isOwnProfile = user?.id === profile.id;

  // Record the visit for "Who viewed your profile" (logged-in visitors only,
  // once per viewer per day; never blocks the page).
  if (user && !isOwnProfile) {
    await createAdminClient()
      .from("profile_views")
      .upsert({ viewer_id: user.id, viewed_id: profile.id }, { onConflict: "viewer_id,viewed_id,viewed_on", ignoreDuplicates: true })
      .then(({ error }) => error && console.error("[profile_views]", error.message), () => undefined);
  }

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
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
            {profile.username && <span>@{profile.username}</span>}
            {profile.city && <span>{profile.city}</span>}
            <span>{goingIds.length} going</span>
            <span>{interestedIds.length} interested</span>
          </div>
          {profile.bio && (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl mb-6">
              {profile.bio}
            </p>
          )}
          {!isOwnProfile && user && (
            <div className="flex flex-wrap gap-3">
              <FriendButton
                friendId={profile.id}
                initialStatus={
                  friendship === "pending" && friendshipIsIncoming
                    ? null
                    : friendship
                }
              />
              <MessageButton otherUserId={profile.id} />
              {backstageFrom !== null && (
                <Link href={`/backstage/${profile.username}`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors">
                  <Crown className="w-4 h-4" aria-hidden="true" /> Join Backstage · from £{(backstageFrom / 100).toFixed(0)}/mo
                </Link>
              )}
              <TipButton targetType="profile" targetId={profile.id} creatorName={displayName ?? "this artist"} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors" />
            </div>
          )}
          {isOwnProfile && (
            <Link
              href="/profile/edit"
              className="inline-block px-5 py-2.5 border-2 border-black text-sm font-medium rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Edit Profile
            </Link>
          )}
          {isOwnProfile && (
            <div className="flex flex-wrap gap-3 mt-3">
              <PromoteButton kind="profile" refId={profile.id} label="Boost my profile" />
              <Link href="/backstage" className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-bold border border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                <Crown className="w-4 h-4" aria-hidden="true" /> {backstageFrom !== null ? "Manage Backstage" : "Start Backstage"}
              </Link>
            </div>
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
                <EventCard
              key={e.id} event={e}
              artists={e.artists || []}
              venue={e.venue || null}
              promoter={e.organizer ? { slug: e.organizer.slug ?? '', name: e.organizer.name ?? '' } : null}
            />
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
                <EventCard
              key={e.id} event={e}
              artists={e.artists || []}
              venue={e.venue || null}
              promoter={e.organizer ? { slug: e.organizer.slug ?? '', name: e.organizer.name ?? '' } : null}
            />
              ))}
          </div>
        </div>
      )}

      {events.length === 0 && (
        <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">No public activity yet.</p>
        </div>
      )}
    </div>
  );
}

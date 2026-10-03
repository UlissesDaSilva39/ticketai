import { createServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import FriendButton from "@/components/FriendButton";

export const dynamic = "force-dynamic";

export default async function AttendeesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  const { data: event } = await supabase
    .from("events")
    .select("id, title")
    .eq("id", id)
    .maybeSingle();

  if (!event) return notFound();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: going } = await supabase
    .from("event_interest")
    .select("user_id")
    .eq("event_id", id)
    .eq("status", "going");

  const userIds = (going || []).map((g) => g.user_id);

  let profiles: Array<{
    id: string;
    full_name: string | null;
    username: string | null;
  }> = [];

  if (userIds.length > 0) {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, username")
      .in("id", userIds);
    profiles = data || [];
  }

  let friendIds: string[] = [];
  if (user) {
    const { data: friendships } = await supabase
      .from("friendships")
      .select("user_id, friend_id")
      .eq("status", "accepted")
      .or("user_id.eq." + user.id + ",friend_id.eq." + user.id);
    friendIds = (friendships || []).map((f) =>
      f.user_id === user.id ? f.friend_id : f.user_id
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link
        href={`/event/${event.id}`}
        className="text-sm text-gray-500 hover:underline"
      >
        ← Back to event
      </Link>

      <h1
        className="text-5xl font-bold uppercase mt-4 mb-8"
        style={{ fontFamily: "var(--font-antonio)" }}
      >
        Going to {event.title}
      </h1>

      {profiles.length === 0 ? (
        <p className="text-gray-500">
          No one has marked themselves as going yet.
        </p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {profiles.map((p) => {
            const isSelf = user?.id === p.id;
            const isFriend = friendIds.includes(p.id);
            const displayName = (p.full_name && p.full_name.trim()) || p.username || "Someone";
            const initials = displayName.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";

            return (
              <li key={p.id} className="py-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={p.username ? `/u/${p.username}` : "#"}
                    className="font-medium hover:underline"
                  >
                    {p.full_name || p.username || "Someone"}
                  </Link>
                  {p.username && (
                    <p className="text-sm text-gray-500">@{p.username}</p>
                  )}
                </div>
                {!isSelf && user && (
                  <FriendButton
                    friendId={p.id}
                    initialStatus={isFriend ? "accepted" : null}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
import { createServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import FriendButton from "@/components/FriendButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

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

  const { data: tickets } = await supabase
    .from("tickets")
    .select("user_id")
    .eq("event_id", id)
    .in("status", ["valid", "used"]);

  const userIdSet = new Set<string>();
  for (const t of tickets || []) userIdSet.add(t.user_id);

  const { data: going } = await supabase
    .from("event_interest")
    .select("user_id")
    .eq("event_id", id)
    .eq("status", "going");

  for (const g of going || []) userIdSet.add(g.user_id);

  const userIds = Array.from(userIdSet);

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

  const others = profiles.filter((p) => p.id !== user?.id);
  const totalGoing = profiles.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link
        href={"/event/" + event.id}
        className="text-sm text-gray-500 hover:underline"
      >
        Back to event
      </Link>

      <h1 className="text-4xl font-bold mt-4 mb-2">Who is going</h1>
      <p className="text-gray-600 mb-8">
        {totalGoing} {totalGoing === 1 ? "person is" : "people are"} attending{" "}
        <span className="font-medium text-gray-900">{event.title}</span>
      </p>

      {others.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-12 text-center">
          <p className="text-gray-900 font-medium mb-1">
            {totalGoing === 0
              ? "No one has registered yet"
              : "You are the only one going so far"}
          </p>
          <p className="text-gray-600 text-sm">
            {totalGoing === 0
              ? "Be the first to grab a ticket."
              : "Invite friends - more will show up soon."}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 border border-gray-200 rounded-2xl overflow-hidden">
          {others.map((p) => {
            const name = p.full_name || p.username || "Someone";
            const initials = name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();
            const isFriend = friendIds.includes(p.id);
            return (
              <li key={p.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold flex-shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={p.username ? "/u/" + p.username : "#"}
                    className="font-medium hover:underline"
                  >
                    {name}
                  </Link>
                  {p.username && (
                    <p className="text-sm text-gray-500">@{p.username}</p>
                  )}
                </div>
                {user && (
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

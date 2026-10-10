import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import FriendButton from "@/components/FriendButton";

export const dynamic = "force-dynamic";

export default async function FriendsPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: friendships } = await supabase
    .from("friendships")
    .select("user_id, friend_id, status")
    .eq("status", "accepted")
    .or("user_id.eq." + user.id + ",friend_id.eq." + user.id);

  const friendIds = (friendships || []).map((f) =>
    f.user_id === user.id ? f.friend_id : f.user_id
  );

  let friends: Array<{ id: string; full_name: string | null; username: string | null }> = [];
  if (friendIds.length > 0) {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, username")
      .in("id", friendIds);
    friends = data || [];
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-5xl font-bold uppercase"
          style={{ fontFamily: "var(--font-antonio)" }}
        >
          Friends
        </h1>
        {friends.length > 0 && (
          <Link
            href="/people"
            className="text-sm text-gray-600 hover:text-black"
          >
            Find more people →
          </Link>
        )}
      </div>

      {friends.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-12 text-center">
          <p className="text-2xl mb-2">👥</p>
          <p className="text-gray-900 font-medium mb-2">No friends yet</p>
          <p className="text-gray-600 text-sm mb-6 max-w-sm mx-auto">
            Browse attendees on event pages, or find people by name and username.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/people"
              className="inline-block px-6 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800"
            >
              Find people
            </Link>
            <Link
              href="/people"
              className="inline-block px-6 py-3 bg-white border-2 border-black text-black rounded-full text-sm font-medium hover:bg-gray-50"
            >
              Browse events
            </Link>
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 border border-gray-200 rounded-2xl overflow-hidden">
          {friends.map((f) => {
            const name = f.full_name || f.username || "Someone";
            const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
            return (
              <li key={f.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold flex-shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={f.username ? "/u/" + f.username : "#"}
                    className="font-medium hover:underline"
                  >
                    {name}
                  </Link>
                  {f.username && (
                    <p className="text-sm text-gray-500">@{f.username}</p>
                  )}
                </div>
                <FriendButton friendId={f.id} initialStatus="accepted" />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
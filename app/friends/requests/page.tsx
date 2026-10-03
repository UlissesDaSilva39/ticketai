import { createServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function FriendRequestsPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <p>Please <Link href="/login" className="underline">sign in</Link>.</p>
      </div>
    );
  }

  const { data: requests } = await supabase
    .from("friendships")
    .select("id, user_id")
    .eq("friend_id", user.id)
    .eq("status", "pending");

  const senderIds = (requests || []).map((r) => r.user_id);
  let senders: Array<{ id: string; full_name: string | null; username: string | null }> = [];
  if (senderIds.length > 0) {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, username")
      .in("id", senderIds);
    senders = data || [];
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 uppercase" style={{ fontFamily: "var(--font-antonio)" }}>
        Friend Requests
      </h1>
      {senders.length === 0 ? (
        <p className="text-gray-500">No pending requests.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {senders.map((s) => (
            <li key={s.id} className="py-4 flex items-center justify-between gap-4">
              <Link href={s.username ? `/u/${s.username}` : "#"} className="font-medium hover:underline">
                {s.full_name || s.username || "Someone"}
              </Link>
              <form action={`/api/friends/accept`} method="POST">
                <input type="hidden" name="senderId" value={s.id} />
                <button className="px-4 py-2 bg-black text-white text-sm rounded-full">
                  Accept
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
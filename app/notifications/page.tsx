import { createServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: requests } = await supabase
    .from("friendships")
    .select("id, user_id, created_at")
    .eq("friend_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

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
      <h1
        className="text-5xl font-bold uppercase mb-8"
        style={{ fontFamily: "var(--font-antonio)" }}
      >
        Notifications
      </h1>

      {senders.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-500">You have no new notifications.</p>
        </div>
      ) : (
        <div>
          <h2 className="text-sm uppercase tracking-wide text-gray-500 mb-3">
            Friend requests
          </h2>
          <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
            {senders.map((s) => {
              const name = s.full_name || s.username || "Someone";
              const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
              return (
                <li key={s.id} className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">
                      <Link
                        href={s.username ? "/u/" + s.username : "#"}
                        className="hover:underline"
                      >
                        {name}
                      </Link>
                      <span className="text-gray-500 font-normal"> wants to be your friend</span>
                    </p>
                    {s.username && (
                      <p className="text-sm text-gray-500">@{s.username}</p>
                    )}
                  </div>
                  <form action="/api/friends/accept" method="POST">
                    <input type="hidden" name="senderId" value={s.id} />
                    <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800">
                      Accept
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

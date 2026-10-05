import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type FriendActivity = {
  id: string;
  type: "going" | "interested" | "review" | "new_event";
  user_id: string;
  user_name: string;
  user_username: string | null;
  created_at: string;
  event_id: string | null;
  event_title: string | null;
  event_date: string | null;
  event_image: string | null;
  rating?: number;
  comment?: string | null;
};

type SuggestedUser = {
  id: string;
  name: string;
  username: string | null;
  sharedEvents: number;
};

function formatDate(v: string | null) {
  if (!v) return "TBC";
  return new Date(v).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

function groupLabel(iso: string): string {
  const now = new Date();
  const d = new Date(iso);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const that = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round((today.getTime() - that.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7) return "This week";
  return "Earlier";
}

export default async function FeedPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: friendships } = await supabase
    .from("friendships")
    .select("user_id, friend_id")
    .eq("status", "accepted")
    .or("user_id.eq." + user.id + ",friend_id.eq." + user.id);

  const friendIds = (friendships || []).map((f) =>
    f.user_id === user.id ? f.friend_id : f.user_id
  );

  const activities: FriendActivity[] = [];

  if (friendIds.length > 0) {
    const { data: interestRows } = await supabase
      .from("event_interest")
      .select("id, user_id, event_id, status, created_at")
      .in("user_id", friendIds)
      .order("created_at", { ascending: false })
      .limit(50);

    const eventIds = [...new Set((interestRows || []).map((r) => r.event_id))];

    const { data: events } = eventIds.length
      ? await supabase.from("events").select("id, title, start_date, hero_image").in("id", eventIds)
      : { data: [] };
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, username")
      .in("id", friendIds);

    const eventById: Record<string, { title: string; start_date: string | null; hero_image: string | null }> = {};
    for (const ev of events || []) {
      eventById[ev.id] = { title: ev.title, start_date: ev.start_date, hero_image: ev.hero_image };
    }
    const profileById: Record<string, { name: string; username: string | null }> = {};
    for (const p of profiles || []) {
      profileById[p.id] = { name: p.full_name || p.username || "Someone", username: p.username };
    }

    for (const row of interestRows || []) {
      if (row.status !== "going" && row.status !== "interested") continue;
      const ev = eventById[row.event_id];
      const pr = profileById[row.user_id];
      if (!ev || !pr) continue;
      activities.push({
        id: "interest-" + row.id,
        type: row.status,
        user_id: row.user_id,
        user_name: pr.name,
        user_username: pr.username,
        created_at: row.created_at,
        event_id: row.event_id,
        event_title: ev.title,
        event_date: ev.start_date,
        event_image: ev.hero_image,
      });
    }

    const { data: reviews } = await supabase
      .from("event_reviews")
      .select("id, user_id, event_id, rating, comment, created_at")
      .in("user_id", friendIds)
      .order("created_at", { ascending: false })
      .limit(30);

    for (const r of reviews || []) {
      const ev = eventById[r.event_id];
      const pr = profileById[r.user_id];
      if (!ev || !pr) continue;
      activities.push({
        id: "review-" + r.id,
        type: "review",
        user_id: r.user_id,
        user_name: pr.name,
        user_username: pr.username,
        created_at: r.created_at,
        event_id: r.event_id,
        event_title: ev.title,
        event_date: ev.start_date,
        event_image: ev.hero_image,
        rating: r.rating,
        comment: r.comment,
      });
    }
  }

  // Events from organizers the user follows
  const { data: followsRows } = await supabase
    .from("follows")
    .select("target_type, target_id")
    .eq("follower_id", user.id)
    .eq("target_type", "promoter");

  if (followsRows && followsRows.length > 0) {
    const promoterRowIds = followsRows.map((r) => r.target_id);
    const { data: promoterRows } = await supabase
      .from("promoters")
      .select("id, user_id, display_name")
      .in("id", promoterRowIds);

    const organizerIds = (promoterRows || []).map((p) => p.user_id).filter(Boolean) as string[];
    const promoterNameByUserId: Record<string, string> = {};
    for (const p of promoterRows || []) {
      if (p.user_id) promoterNameByUserId[p.user_id] = p.display_name || "Promoter";
    }

    if (organizerIds.length > 0) {
      const { data: newEvents } = await supabase
        .from("events")
        .select("id, title, start_date, hero_image, organizer_id, created_at")
        .in("organizer_id", organizerIds)
        .eq("status", "published")
        .gte("start_date", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(20);

      for (const ev of newEvents || []) {
        activities.push({
          id: "new-" + ev.id,
          type: "new_event",
          user_id: ev.organizer_id,
          user_name: promoterNameByUserId[ev.organizer_id] || "Promoter",
          user_username: null,
          created_at: ev.created_at,
          event_id: ev.id,
          event_title: ev.title,
          event_date: ev.start_date,
          event_image: ev.hero_image,
        });
      }
    }
  }

  activities.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  const shown = activities.slice(0, 40);

  // Group by day label
  const groups: Record<string, FriendActivity[]> = {};
  const groupOrder: string[] = [];
  for (const a of shown) {
    const label = groupLabel(a.created_at);
    if (!groups[label]) {
      groups[label] = [];
      groupOrder.push(label);
    }
    groups[label].push(a);
  }

  // Suggested users (people at events you are going to, not already friends)
  const suggestedUsers: SuggestedUser[] = [];
  const { data: myGoing } = await supabase
    .from("event_interest")
    .select("event_id")
    .eq("user_id", user.id)
    .eq("status", "going");

  const myEventIds = (myGoing || []).map((r) => r.event_id);
  if (myEventIds.length > 0) {
    const { data: othersGoing } = await supabase
      .from("event_interest")
      .select("user_id, event_id")
      .in("event_id", myEventIds)
      .eq("status", "going")
      .neq("user_id", user.id);

    const sharedCount: Record<string, number> = {};
    for (const row of othersGoing || []) {
      if (friendIds.includes(row.user_id)) continue;
      sharedCount[row.user_id] = (sharedCount[row.user_id] || 0) + 1;
    }

    const candidateIds = Object.keys(sharedCount)
      .sort((a, b) => sharedCount[b] - sharedCount[a])
      .slice(0, 3);

    if (candidateIds.length > 0) {
      const { data: candidateProfiles } = await supabase
        .from("profiles")
        .select("id, full_name, username")
        .in("id", candidateIds);

      for (const c of candidateProfiles || []) {
        suggestedUsers.push({
          id: c.id,
          name: c.full_name || c.username || "Someone",
          username: c.username,
          sharedEvents: sharedCount[c.id],
        });
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1
        className="text-5xl font-bold uppercase mb-8"
        style={{ fontFamily: "var(--font-antonio)" }}
      >
        Feed
      </h1>

      {shown.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-12 text-center mb-12">
          <p className="text-gray-600 mb-4">No activity from your friends yet.</p>
          <Link href="/search" className="inline-block px-6 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800">
            Find events
          </Link>
        </div>
      ) : (
        <div className="mb-12">
          {groupOrder.map((label) => (
            <section key={label} className="mb-8">
              <h2
                className="text-xl font-bold uppercase mb-3 text-gray-500"
                style={{ fontFamily: "var(--font-antonio)" }}
              >
                {label}
              </h2>
              <ul className="space-y-4">
                {groups[label].map((a) => {
                  const initials = a.user_name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
                  return (
                    <li key={a.id} className="rounded-2xl border border-gray-200 overflow-hidden">
                      <div className="flex items-start gap-4 p-4">
                        <Link
                          href={a.user_username ? "/u/" + a.user_username : "#"}
                          className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold flex-shrink-0"
                        >
                          {initials}
                        </Link>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">
                            <Link href={a.user_username ? "/u/" + a.user_username : "#"} className="font-medium hover:underline">
                              {a.user_name}
                            </Link>
                            {a.type === "going" && <span className="text-gray-600"> is going to </span>}
                            {a.type === "interested" && <span className="text-gray-600"> is interested in </span>}
                            {a.type === "review" && <span className="text-gray-600"> reviewed </span>}
                            {a.type === "new_event" && <span className="text-gray-600"> announced a new event </span>}
                            {a.event_id && (
                              <Link href={"/event/" + a.event_id} className="font-medium hover:underline">
                                {a.event_title}
                              </Link>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{formatDate(a.event_date)}</p>
                          {a.type === "review" && a.rating !== undefined && (
                            <div className="mt-2">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <span key={n} className={n <= (a.rating || 0) ? "text-yellow-500" : "text-gray-300"}>
                                    {"\u2605"}
                                  </span>
                                ))}
                              </div>
                              {a.comment && <p className="text-sm text-gray-700 mt-1">{a.comment}</p>}
                            </div>
                          )}
                        </div>
                        {a.event_image && (
                          <Link href={a.event_id ? "/event/" + a.event_id : "#"} className="flex-shrink-0">
                            <img src={a.event_image} alt={a.event_title || ""} className="w-20 h-20 rounded-xl object-cover bg-gray-100" />
                          </Link>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}

      {suggestedUsers.length > 0 && (
        <section className="mb-12">
          <h2
            className="text-xl font-bold uppercase mb-4 text-gray-500"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            People at your events
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {suggestedUsers.map((s) => {
              const initials = s.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
              return (
                <div key={s.id} className="rounded-2xl border border-gray-200 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={s.username ? "/u/" + s.username : "#"} className="font-medium hover:underline truncate block">
                      {s.name}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {s.sharedEvents} shared {s.sharedEvents === 1 ? "event" : "events"}
                    </p>
                  </div>
                  {s.username && (
                    <Link href={"/u/" + s.username} className="text-xs font-medium underline underline-offset-4 flex-shrink-0">
                      View
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
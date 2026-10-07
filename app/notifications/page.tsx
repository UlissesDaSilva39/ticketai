import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type NotificationItem = {
  id: string;
  kind: "request" | "message" | "follow" | "attendee";
  actor_id: string;
  actor_name: string;
  actor_username: string | null;
  preview: string | null;
  created_at: string;
  href: string;
};

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return Math.floor(diff / 60) + "m";
  if (diff < 86400) return Math.floor(diff / 3600) + "h";
  if (diff < 604800) return Math.floor(diff / 86400) + "d";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default async function NotificationsPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const items: NotificationItem[] = [];

  // 1. Friend requests
  const { data: requests } = await supabase
    .from("friendships")
    .select("id, user_id, created_at")
    .eq("friend_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const requestSenderIds = (requests || []).map((r) => r.user_id);

  // 2. Unread messages — last 10 across all conversations
  const { data: convs } = await supabase
    .from("conversations")
    .select("id, participant_a, participant_b")
    .or("participant_a.eq." + user.id + ",participant_b.eq." + user.id);
  const myConvIds = (convs || []).map((c) => c.id);
  const otherByConv: Record<string, string> = {};
  for (const c of convs || []) {
    otherByConv[c.id] = c.participant_a === user.id ? c.participant_b : c.participant_a;
  }

  let unreadMessages: Array<{ id: string; conversation_id: string; sender_id: string; body: string; created_at: string }> = [];
  if (myConvIds.length > 0) {
    const { data: msgs } = await supabase
      .from("messages")
      .select("id, conversation_id, sender_id, body, created_at")
      .in("conversation_id", myConvIds)
      .neq("sender_id", user.id)
      .is("read_at", null)
      .order("created_at", { ascending: false })
      .limit(10);
    unreadMessages = msgs || [];
  }

  // 3. New followers — last 10 people who followed me (as promoter)
  const { data: promoterRow } = await supabase
    .from("promoters")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  let follows: Array<{ id: string; follower_id: string; created_at: string }> = [];
  if (promoterRow) {
    const { data: fr } = await supabase
      .from("follows")
      .select("id, follower_id, created_at")
      .eq("target_type", "promoter")
      .eq("target_id", promoterRow.id)
      .order("created_at", { ascending: false })
      .limit(10);
    follows = fr || [];
  }

  // 4. Recent attendees on my events — last 10
  const { data: myEvents } = await supabase
    .from("events")
    .select("id, title")
    .eq("organizer_id", user.id);
  const myEventIds = (myEvents || []).map((e) => e.id);
  const eventTitleById: Record<string, string> = {};
  for (const e of myEvents || []) eventTitleById[e.id] = e.title;

  let attendeeRows: Array<{ id: string; user_id: string; event_id: string; created_at: string }> = [];
  if (myEventIds.length > 0) {
    const { data: ar } = await supabase
      .from("event_interest")
      .select("id, user_id, event_id, created_at")
      .in("event_id", myEventIds)
      .eq("status", "going")
      .neq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);
    attendeeRows = ar || [];
  }

  // Gather actor ids
  const allActorIds = [...new Set([
    ...requestSenderIds,
    ...unreadMessages.map((m) => m.sender_id),
    ...follows.map((f) => f.follower_id),
    ...attendeeRows.map((a) => a.user_id),
  ])];

  const profileById: Record<string, { name: string; username: string | null }> = {};
  if (allActorIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, username")
      .in("id", allActorIds);
    for (const p of profiles || []) {
      profileById[p.id] = { name: p.full_name || p.username || "Someone", username: p.username };
    }
  }

  const nameOf = (id: string) => profileById[id]?.name || "Someone";
  const userOf = (id: string) => profileById[id]?.username || null;

  // Build items
  for (const r of requests || []) {
    items.push({
      id: "req-" + r.id,
      kind: "request",
      actor_id: r.user_id,
      actor_name: nameOf(r.user_id),
      actor_username: userOf(r.user_id),
      preview: "wants to be your friend",
      created_at: r.created_at,
      href: "/notifications",
    });
  }

  for (const m of unreadMessages) {
    items.push({
      id: "msg-" + m.id,
      kind: "message",
      actor_id: m.sender_id,
      actor_name: nameOf(m.sender_id),
      actor_username: userOf(m.sender_id),
      preview: "sent you a message: " + (m.body.length > 60 ? m.body.slice(0, 60) + "…" : m.body),
      created_at: m.created_at,
      href: "/messages/" + m.conversation_id,
    });
  }

  for (const f of follows) {
    items.push({
      id: "fol-" + f.id,
      kind: "follow",
      actor_id: f.follower_id,
      actor_name: nameOf(f.follower_id),
      actor_username: userOf(f.follower_id),
      preview: "started following you",
      created_at: f.created_at,
      href: userOf(f.follower_id) ? "/u/" + userOf(f.follower_id) : "/",
    });
  }

  for (const a of attendeeRows) {
    items.push({
      id: "att-" + a.id,
      kind: "attendee",
      actor_id: a.user_id,
      actor_name: nameOf(a.user_id),
      actor_username: userOf(a.user_id),
      preview: "is going to " + (eventTitleById[a.event_id] || "your event"),
      created_at: a.created_at,
      href: "/event/" + a.event_id,
    });
  }

  items.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1
        className="text-5xl font-bold uppercase mb-8"
        style={{ fontFamily: "var(--font-antonio)" }}
      >
        Notifications
      </h1>

      {items.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-12 text-center">
          <p className="text-gray-500">You have no new notifications.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 border border-gray-200 rounded-2xl">
          {items.map((n) => {
            const initials = n.actor_name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
            return (
              <li key={n.id} className="p-4 flex items-center gap-4">
                <Link
                  href={n.actor_username ? "/u/" + n.actor_username : "#"}
                  className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold flex-shrink-0"
                >
                  {initials}
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <Link
                      href={n.actor_username ? "/u/" + n.actor_username : "#"}
                      className="font-medium hover:underline"
                    >
                      {n.actor_name}
                    </Link>
                    {" "}
                    <span className="text-gray-600">{n.preview}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{timeAgo(n.created_at)}</p>
                </div>
                <Link
                  href={n.href}
                  className="text-xs font-medium underline underline-offset-4 flex-shrink-0"
                >
                  View
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
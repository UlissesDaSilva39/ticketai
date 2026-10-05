import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Conversation = {
  id: string;
  participant_a: string;
  participant_b: string;
  last_message_at: string;
};

type ProfileMap = Record<string, { name: string; username: string | null }>;

function timeAgo(iso: string) {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return Math.floor(diff / 60) + "m";
  if (diff < 86400) return Math.floor(diff / 3600) + "h";
  if (diff < 604800) return Math.floor(diff / 86400) + "d";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default async function MessagesPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, participant_a, participant_b, last_message_at")
    .or("participant_a.eq." + user.id + ",participant_b.eq." + user.id)
    .order("last_message_at", { ascending: false });

  const convs = (conversations || []) as Conversation[];
  const otherIds = convs.map((c) => (c.participant_a === user.id ? c.participant_b : c.participant_a));

  const profileMap: ProfileMap = {};
  if (otherIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, username")
      .in("id", otherIds);
    for (const p of profiles || []) {
      profileMap[p.id] = { name: p.full_name || p.username || "Someone", username: p.username };
    }
  }

  const lastMessages: Record<string, { body: string; sender_id: string }> = {};
  if (convs.length > 0) {
    const { data: msgs } = await supabase
      .from("messages")
      .select("conversation_id, body, sender_id, created_at")
      .in("conversation_id", convs.map((c) => c.id))
      .order("created_at", { ascending: false })
      .limit(200);
    for (const m of msgs || []) {
      if (!lastMessages[m.conversation_id]) {
        lastMessages[m.conversation_id] = { body: m.body, sender_id: m.sender_id };
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1
        className="text-5xl font-bold uppercase mb-8"
        style={{ fontFamily: "var(--font-antonio)" }}
      >
        Messages
      </h1>

      {convs.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-12 text-center">
          <p className="text-gray-600 mb-4">No conversations yet.</p>
          <Link href="/people" className="inline-block px-6 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800">
            Find people
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 border border-gray-200 rounded-2xl">
          {convs.map((c) => {
            const otherId = c.participant_a === user.id ? c.participant_b : c.participant_a;
            const p = profileMap[otherId];
            const name = p?.name || "Someone";
            const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
            const last = lastMessages[c.id];
            const preview = last ? (last.sender_id === user.id ? "You: " : "") + last.body : "";
            return (
              <li key={c.id}>
                <Link href={"/messages/" + c.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-medium truncate">{name}</p>
                      <p className="text-xs text-gray-400 flex-shrink-0">{timeAgo(c.last_message_at)}</p>
                    </div>
                    {preview && (
                      <p className="text-sm text-gray-500 truncate">{preview}</p>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
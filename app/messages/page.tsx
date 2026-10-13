import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Messages" };
export const dynamic = "force-dynamic";

function timeAgoShort(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "now";
  if (s < 3600) return Math.floor(s / 60) + "m";
  if (s < 86400) return Math.floor(s / 3600) + "h";
  if (s < 604800) return Math.floor(s / 86400) + "d";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "Europe/London",
  });
}

export default async function MessagesInboxPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/messages");

  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, participant_a, participant_b, last_message_at")
    .or("participant_a.eq." + user.id + ",participant_b.eq." + user.id)
    .order("last_message_at", { ascending: false })
    .limit(50);

  const convs = conversations ?? [];
  const otherIds = Array.from(
    new Set(
      convs.map((c) => (c.participant_a === user.id ? c.participant_b : c.participant_a))
    )
  );

  let profiles: Record<string, { name: string; avatar_url: string | null }> = {};
  if (otherIds.length > 0) {
    const { data: profs } = await supabase
      .from("profiles")
      .select("id, full_name, username, avatar_url")
      .in("id", otherIds);
    for (const p of profs ?? []) {
      profiles[p.id] = {
        name: p.full_name || p.username || "User",
        avatar_url: p.avatar_url ?? null,
      };
    }
  }

  // Preview last message per conversation
  const previews: Record<string, string> = {};
  if (convs.length > 0) {
    const ids = convs.map((c) => c.id);
    const { data: msgs } = await supabase
      .from("messages")
      .select("conversation_id, body, created_at")
      .in("conversation_id", ids)
      .order("created_at", { ascending: false });
    for (const m of msgs ?? []) {
      if (!previews[m.conversation_id]) previews[m.conversation_id] = m.body;
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1
          className="text-4xl font-bold tracking-tight mb-2"
          style={{ fontFamily: "var(--font-antonio)" }}
          data-testid="messages-heading"
        >
          Messages
        </h1>
        <p className="text-gray-600 mb-8">Direct conversations on GRID.</p>

        {convs.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-500 text-sm">
            No conversations yet. Message a promoter, venue, or artist from their
            profile to start one.
          </div>
        ) : (
          <ul className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100">
            {convs.map((c) => {
              const otherId =
                c.participant_a === user.id ? c.participant_b : c.participant_a;
              const other = profiles[otherId];
              const preview = previews[c.id] ?? "No messages yet";
              return (
                <li key={c.id}>
                  <Link
                    href={"/messages/" + c.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
                    data-testid="conversation-row"
                  >
                    {other?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={other.avatar_url}
                        alt={other.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                        {(other?.name || "?").slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-medium text-sm truncate">
                          {other?.name ?? "User"}
                        </span>
                        <span className="text-[11px] text-gray-400 whitespace-nowrap">
                          {timeAgoShort(c.last_message_at)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{preview}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

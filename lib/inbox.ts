// Server-side: the member's conversation list for the inbox (used by app/messages/layout.tsx).
import type { SupabaseClient } from "@supabase/supabase-js";

export type InboxRow = {
  id: string;
  otherId: string;
  name: string;
  username: string | null;
  avatar: string | null;
  lastBody: string;
  lastAt: string;
  lastFromMe: boolean;
  unread: boolean;
  isApplication: boolean;
};

type Conv = {
  id: string;
  participant_a: string;
  participant_b: string;
  participant_a_last_read: string | null;
  participant_b_last_read: string | null;
};

export async function getInbox(supabase: SupabaseClient, userId: string): Promise<InboxRow[]> {
  const { data: convs } = await supabase
    .from("conversations")
    .select("id, participant_a, participant_b, participant_a_last_read, participant_b_last_read")
    .or(`participant_a.eq.${userId},participant_b.eq.${userId}`)
    .limit(100);

  const list = (convs ?? []) as Conv[];
  if (list.length === 0) return [];
  const otherIds = [...new Set(list.map((c) => (c.participant_a === userId ? c.participant_b : c.participant_a)))];

  const [{ data: people }, lasts] = await Promise.all([
    supabase.from("profiles").select("id, full_name, username, avatar_url").in("id", otherIds),
    Promise.all(
      list.map((c) =>
        supabase
          .from("messages")
          .select("body, sender_id, created_at")
          .eq("conversation_id", c.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()
          .then((r) => [c.id, r.data] as const)
      )
    ),
  ]);

  const byId = Object.fromEntries((people ?? []).map((p) => [p.id, p]));
  const lastById = Object.fromEntries(lasts);

  return list
    .map((c): InboxRow | null => {
      const last = lastById[c.id];
      if (!last) return null; // hide empty conversations
      const otherId = c.participant_a === userId ? c.participant_b : c.participant_a;
      const p = byId[otherId];
      const name = (p?.full_name && !p.full_name.includes("@") ? p.full_name : p?.username) || "GRID member";
      const myLastRead = c.participant_a === userId ? c.participant_a_last_read : c.participant_b_last_read;
      const fromMe = last.sender_id === userId;
      const body = (last.body || "").replace(/\s+/g, " ").trim();
      return {
        id: c.id,
        otherId,
        name,
        username: p?.username ?? null,
        avatar: p?.avatar_url ?? null,
        lastBody: body || "Attachment",
        lastAt: last.created_at,
        lastFromMe: fromMe,
        unread: !fromMe && (!myLastRead || new Date(last.created_at) > new Date(myLastRead)),
        isApplication: body.startsWith("📩 Application"),
      };
    })
    .filter((r): r is InboxRow => r !== null)
    .sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime());
}

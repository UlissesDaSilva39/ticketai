import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";

// Real inbox: the member's conversations (tables conversations + messages).
// Replaces a hard-coded mock-up (fake "LinkedIn"/"Euronext" messages).

export const metadata: Metadata = { title: "Messages" };
export const dynamic = "force-dynamic";

type Conv = {
  id: string;
  participant_a: string;
  participant_b: string;
  participant_a_last_read: string | null;
  participant_b_last_read: string | null;
};

function when(iso: string) {
  const d = new Date(iso);
  const diffH = (Date.now() - d.getTime()) / 3_600_000;
  if (diffH < 24) return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  if (diffH < 24 * 7) return d.toLocaleDateString("en-GB", { weekday: "short" });
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default async function MessagesPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/messages");

  const { data: convs } = await supabase
    .from("conversations")
    .select("id, participant_a, participant_b, participant_a_last_read, participant_b_last_read")
    .or(`participant_a.eq.${user.id},participant_b.eq.${user.id}`)
    .limit(100);

  const list = (convs ?? []) as Conv[];
  const otherIds = [...new Set(list.map((c) => (c.participant_a === user.id ? c.participant_b : c.participant_a)))];

  const [{ data: people }, lastMessages] = await Promise.all([
    otherIds.length
      ? supabase.from("profiles").select("id, full_name, username, avatar_url").in("id", otherIds)
      : Promise.resolve({ data: [] as { id: string; full_name: string | null; username: string | null; avatar_url: string | null }[] }),
    // Latest message per conversation.
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
  const lastById = Object.fromEntries(lastMessages);

  const rows = list
    .map((c) => {
      const otherId = c.participant_a === user.id ? c.participant_b : c.participant_a;
      const p = byId[otherId];
      const name = (p?.full_name && !p.full_name.includes("@") ? p.full_name : p?.username) || "GRID member";
      const last = lastById[c.id];
      const myLastRead = c.participant_a === user.id ? c.participant_a_last_read : c.participant_b_last_read;
      const unread = !!last && last.sender_id !== user.id && (!myLastRead || new Date(last.created_at) > new Date(myLastRead));
      return { id: c.id, name, avatar: p?.avatar_url ?? null, last, unread };
    })
    .filter((r) => r.last) // hide empty conversations
    .sort((a, b) => new Date(b.last!.created_at).getTime() - new Date(a.last!.created_at).getTime());

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-[calc(100vh-56px)]">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Messages</h1>
            <span className="text-xs text-gray-500">{rows.filter((r) => r.unread).length} unread</span>
          </div>

          {rows.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-semibold text-gray-900 dark:text-white">No messages yet</p>
              <p className="mt-1 text-sm text-gray-500">
                Start a conversation from someone&apos;s profile, or apply to an opportunity on your{" "}
                <Link href="/home" className="text-emerald-700 font-semibold hover:underline">home page</Link>.
              </p>
            </div>
          ) : (
            <ul>
              {rows.map((r) => (
                <li key={r.id} className="border-b last:border-b-0 border-gray-100 dark:border-zinc-800">
                  <Link
                    href={`/messages/${r.id}`}
                    className={`flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/60 ${r.unread ? "bg-emerald-50/60 dark:bg-emerald-900/10" : ""}`}
                  >
                    {r.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.avatar} alt="" className="h-11 w-11 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-emerald-700 font-bold text-white">
                        {r.name.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className={`truncate text-sm ${r.unread ? "font-bold text-gray-900 dark:text-white" : "font-semibold text-gray-800 dark:text-gray-200"}`}>
                          {r.name}
                        </span>
                        <span className="flex-shrink-0 text-xs text-gray-500">{when(r.last!.created_at)}</span>
                      </span>
                      <span className={`mt-0.5 block truncate text-sm ${r.unread ? "text-gray-900 dark:text-white" : "text-gray-500"}`}>
                        {r.last!.sender_id === user.id ? "You: " : ""}
                        {(r.last!.body || "").replace(/\s+/g, " ").trim() || "Attachment"}
                      </span>
                    </span>
                    {r.unread && <span aria-label="Unread" className="mt-2 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-emerald-600" />}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

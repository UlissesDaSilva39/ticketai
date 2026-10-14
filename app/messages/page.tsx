import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar/Sidebar";
import MessageComposer from "@/components/messages/MessageComposer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Messages",
  description: "Your private messages on GRID.",
};

type SearchParams = Promise<{ to?: string }>;

type Conversation = {
  id: string;
  participant_a: string;
  participant_b: string;
  last_message_at: string | null;
};

type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
};

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { to } = await searchParams;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen pb-32">
        <div className="mx-auto max-w-[1400px] px-6 py-6 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-3">
            <Sidebar />
          </div>
          <main className="col-span-12 lg:col-span-9 min-w-0">
            <h1
              className="text-4xl md:text-5xl font-bold uppercase mb-6"
              style={{ fontFamily: "var(--font-antonio)" }}
            >
              Messages
            </h1>
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <p className="text-gray-900 font-medium mb-3">
                Log in to see your messages
              </p>
              <Link
                href="/login?next=/messages"
                className="inline-block rounded-full bg-black text-white text-sm font-semibold px-6 py-2 hover:bg-gray-800"
              >
                Log in
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  let prefillRecipientId: string | null = null;
  let prefillRecipientName: string | null = null;

  if (to) {
    const { data: recipient } = await supabase
      .from("profiles")
      .select("id, username, full_name")
      .or("username.eq." + to + ",id.eq." + to)
      .maybeSingle();

    if (recipient) {
      prefillRecipientId = recipient.id;
      prefillRecipientName = recipient.full_name || recipient.username || "User";
    }
  }

  const { data: convsRaw } = await supabase
    .from("conversations")
    .select("id, participant_a, participant_b, last_message_at")
    .or("participant_a.eq." + user.id + ",participant_b.eq." + user.id)
    .order("last_message_at", { ascending: false, nullsFirst: false })
    .limit(50);

  const convs: Conversation[] = (convsRaw as Conversation[]) || [];

  const otherIds = new Set<string>();
  for (const c of convs) {
    otherIds.add(c.participant_a === user.id ? c.participant_b : c.participant_a);
  }

  let profileMap: Record<string, Profile> = {};
  if (otherIds.size > 0) {
    const { data: profs } = await supabase
      .from("profiles")
      .select("id, username, full_name, avatar_url")
      .in("id", Array.from(otherIds));
    for (const p of (profs as Profile[]) || []) {
      profileMap[p.id] = p;
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      <div className="mx-auto max-w-[1400px] px-6 py-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <Sidebar />
        </div>
        <main className="col-span-12 lg:col-span-9 min-w-0">
          <header className="mb-6">
            <h1
              className="text-4xl md:text-5xl font-bold uppercase"
              style={{ fontFamily: "var(--font-antonio)" }}
            >
              Messages
            </h1>
            <p className="text-gray-600 mt-2">Your private conversations.</p>
          </header>

          {prefillRecipientId && prefillRecipientName ? (
            <div className="mb-6">
              <MessageComposer
                recipientId={prefillRecipientId}
                recipientName={prefillRecipientName}
                currentUserId={user.id}
              />
            </div>
          ) : null}

          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">
            {"Conversations (" + convs.length + ")"}
          </h2>

          {convs.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <p className="text-gray-900 font-medium mb-1">No conversations yet</p>
              <p className="text-gray-600 text-sm">
                Message someone from their profile to start chatting.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100">
              {convs.map((c) => {
                const otherId =
                  c.participant_a === user.id ? c.participant_b : c.participant_a;
                const other = profileMap[otherId];
                const name = other?.full_name || other?.username || "Unknown";
                return (
                  <Link
                    key={c.id}
                    href={"/messages/" + c.id}
                    className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">{name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {c.last_message_at
                          ? new Date(c.last_message_at).toLocaleString("en-GB")
                          : "No messages yet"}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}


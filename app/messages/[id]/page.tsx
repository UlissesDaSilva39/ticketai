import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import MessageThread from "@/components/messages/MessageThread";
import RefreshUnread from "@/components/messages/RefreshUnread";
import { initials, roleLabel } from "@/lib/display";

// Right-hand panel: one conversation (the list on the left comes from ../layout.tsx).

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "Conversation" };
export const dynamic = "force-dynamic";

export default async function ConversationPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  // The layout already sends logged-out visitors to /login.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: conv } = await supabase
    .from("conversations")
    .select("id, participant_a, participant_b")
    .eq("id", id)
    .maybeSingle();

  if (!conv) notFound();
  if (conv.participant_a !== user.id && conv.participant_b !== user.id) notFound();

  const otherId = conv.participant_a === user.id ? conv.participant_b : conv.participant_a;
  const lastReadColumn = conv.participant_a === user.id ? "participant_a_last_read" : "participant_b_last_read";

  const [{ data: other }, { data: messages }] = await Promise.all([
    supabase.from("profiles").select("full_name, username, avatar_url, role, genre, city").eq("id", otherId).maybeSingle(),
    supabase
      .from("messages")
      .select("id, conversation_id, sender_id, body, read_at, created_at")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true })
      .limit(500),
    // Opening the conversation marks it as read.
    supabase.from("conversations").update({ [lastReadColumn]: new Date().toISOString() }).eq("id", id),
  ]);

  // Never show an email address as a name.
  const realName = other?.full_name && !other.full_name.includes("@") ? other.full_name : null;
  const otherName = realName || other?.username || "GRID member";
  const profileHref = other?.username ? `/u/${other.username}` : null;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center gap-3 border-b border-gray-200 dark:border-zinc-800 px-4 py-3">
        <Link href="/messages" aria-label="Back to messages" className="md:hidden -ml-1 grid h-8 w-8 place-items-center rounded-full text-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-800">
          &larr;
        </Link>
        {other?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={other.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-700 text-sm font-bold text-white">{initials(otherName)}</span>
        )}
        <div className="min-w-0 flex-1">
          {profileHref ? (
            <Link href={profileHref} className="block truncate font-semibold text-gray-900 dark:text-white hover:underline" data-testid="thread-heading">
              {otherName}
            </Link>
          ) : (
            <p className="truncate font-semibold text-gray-900 dark:text-white" data-testid="thread-heading">{otherName}</p>
          )}
          <p className="truncate text-xs text-gray-500">
            {roleLabel(other?.role, other?.genre)}
            {other?.city ? ` · ${other.city}` : ""}
          </p>
        </div>
        {profileHref && (
          <Link href={profileHref} className="hidden sm:inline-block rounded-full border border-gray-300 dark:border-zinc-700 px-3 py-1 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:border-gray-800">
            View profile
          </Link>
        )}
      </header>

      <MessageThread conversationId={id} currentUserId={user.id} otherName={otherName} initialMessages={messages ?? []} />
      <RefreshUnread conversationId={id} />
    </div>
  );
}

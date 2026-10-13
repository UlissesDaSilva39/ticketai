import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import MessageThread from "@/components/messages/MessageThread";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "Conversation" };
export const dynamic = "force-dynamic";

export default async function ConversationPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/messages/" + id);

  const { data: conv } = await supabase
    .from("conversations")
    .select("id, participant_a, participant_b")
    .eq("id", id)
    .maybeSingle();

  if (!conv) notFound();
  if (conv.participant_a !== user.id && conv.participant_b !== user.id) notFound();

  const otherId =
    conv.participant_a === user.id ? conv.participant_b : conv.participant_a;

  const { data: other } = await supabase
    .from("profiles")
    .select("full_name, username, avatar_url")
    .eq("id", otherId)
    .maybeSingle();

  const otherName = other?.full_name || other?.username || "User";

  const { data: messages } = await supabase
    .from("messages")
    .select("id, conversation_id, sender_id, body, read_at, created_at")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true })
    .limit(500);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/messages"
            className="text-sm text-gray-500 hover:text-black"
            data-testid="back-to-inbox"
          >
            ← Inbox
          </Link>
        </div>
        <div className="flex items-center gap-3 mb-6">
          {other?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={other.avatar_url}
              alt={otherName}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600">
              {otherName.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-antonio)" }}
              data-testid="thread-heading"
            >
              {otherName}
            </h1>
            <p className="text-xs text-gray-500">Direct message</p>
          </div>
        </div>

        <MessageThread
          conversationId={id}
          currentUserId={user.id}
          otherName={otherName}
          initialMessages={messages ?? []}
        />
      </div>
    </div>
  );
}

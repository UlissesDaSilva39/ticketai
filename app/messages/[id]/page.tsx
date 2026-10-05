import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import MessageThread from "@/components/MessageThread";

export const dynamic = "force-dynamic";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, participant_a, participant_b")
    .eq("id", id)
    .maybeSingle();

  if (!conversation) return notFound();
  if (conversation.participant_a !== user.id && conversation.participant_b !== user.id) {
    return notFound();
  }

  const otherId = conversation.participant_a === user.id ? conversation.participant_b : conversation.participant_a;

  const { data: other } = await supabase
    .from("profiles")
    .select("id, full_name, username")
    .eq("id", otherId)
    .maybeSingle();

  const { data: messages } = await supabase
    .from("messages")
    .select("id, sender_id, body, created_at")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true });

  const otherName = other?.full_name || other?.username || "Someone";

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <Link href="/messages" className="text-sm text-gray-500 hover:underline">
        ← Back to messages
      </Link>

      <div className="mt-4 mb-6 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold">
          {otherName.charAt(0).toUpperCase()}
        </div>
        <div>
          <Link href={other?.username ? "/u/" + other.username : "#"} className="font-medium text-lg hover:underline">
            {otherName}
          </Link>
          {other?.username && <p className="text-sm text-gray-500">@{other.username}</p>}
        </div>
      </div>

      <MessageThread
        conversationId={id}
        currentUserId={user.id}
        initialMessages={(messages || []) as Array<{ id: string; sender_id: string; body: string; created_at: string }>}
      />
    </div>
  );
}
"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function MessageComposer({
  recipientId,
  recipientName,
  currentUserId,
}: {
  recipientId: string;
  recipientName: string;
  currentUserId: string;
}) {
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const send = async () => {
    setError(null);
    if (!body.trim()) return;
    setBusy(true);
    try {
      const supabase = createClient();

      const { data: existing } = await supabase
        .from("conversations")
        .select("id")
        .or(
          "and(participant_a.eq." +
            currentUserId +
            ",participant_b.eq." +
            recipientId +
            "),and(participant_a.eq." +
            recipientId +
            ",participant_b.eq." +
            currentUserId +
            ")"
        )
        .maybeSingle();

      let conversationId = existing?.id;

      if (!conversationId) {
        const { data: created, error: createErr } = await supabase
          .from("conversations")
          .insert({
            participant_a: currentUserId,
            participant_b: recipientId,
            last_message_at: new Date().toISOString(),
          })
          .select("id")
          .single();
        if (createErr) throw createErr;
        conversationId = created.id;
      }

      const { error: msgErr } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: currentUserId,
        body: body.trim(),
      });
      if (msgErr) throw msgErr;

      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);

      setBody("");
      router.push("/messages/" + conversationId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4">
      <p className="text-sm font-semibold mb-2">
        Send a message to {recipientName}
      </p>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={"Write to " + recipientName + "..."}
        rows={3}
        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-black focus:outline-none resize-none text-sm"
      />
      {error ? (
        <p className="text-xs text-red-600 mt-2" role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex justify-end mt-3">
        <button
          type="button"
          onClick={send}
          disabled={busy || !body.trim()}
          className="rounded-full bg-black text-white text-sm font-medium px-5 py-2 hover:bg-gray-800 disabled:opacity-50"
        >
          {busy ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}


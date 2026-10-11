"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Mail, AlertCircle } from "lucide-react";

type Props = {
  email: string;
  name?: string;
};

export default function ReplyOnGridButton({ email, name }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [notOnGrid, setNotOnGrid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startConversation() {
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/messages/start-by-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.status === 404) {
        setNotOnGrid(true);
        return;
      }

      if (!res.ok) {
        setError(data.error || "Could not start conversation");
        return;
      }

      router.push(`/messages/${data.conversationId}`);
    } catch (e: any) {
      setError(e?.message || "Network error");
    } finally {
      setBusy(false);
    }
  }

  // Recipient is not on GRID — offer email fallback
  if (notOnGrid) {
    return (
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 rounded-lg px-2 py-1">
          <AlertCircle className="h-3 w-3" />
          Not on GRID yet — send an email instead
        </div>
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-4 py-1.5 text-xs font-medium hover:bg-gray-50 transition"
        >
          <Mail className="h-3.5 w-3.5" />
          Reply via email
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={startConversation}
        disabled={busy}
        className="inline-flex items-center gap-1.5 rounded-full border border-gray-900 bg-white text-gray-900 px-4 py-1.5 text-xs font-medium hover:bg-gray-900 hover:text-white disabled:opacity-50 transition"
      >
        <MessageCircle className="h-3.5 w-3.5" />
        {busy ? "Opening…" : "Reply on GRID"}
      </button>
      {error && (
        <div className="rounded-lg bg-red-50 p-2 text-xs text-red-700">{error}</div>
      )}
    </div>
  );
}

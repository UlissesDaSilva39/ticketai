"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// "Message" on a profile: starts (or reopens) a real conversation and opens it.
// Replaces a fake chat window that auto-replied without sending anything.
export default function MessageButton({ otherUserId, targetUserId }: { otherUserId?: string; targetUserId?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgrade, setUpgrade] = useState(false);
  const id = otherUserId ?? targetUserId;

  async function start() {
    if (!id) return;
    setBusy(true);
    setError(null);
    setUpgrade(false);
    try {
      const res = await fetch("/api/messages/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ otherUserId: id }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.status === 401) return router.push("/login");
      if (!res.ok || !d.conversationId) {
        setUpgrade(res.status === 402);
        throw new Error(d.error || "Could not start the conversation.");
      }
      router.push(`/messages/${d.conversationId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start the conversation.");
      setBusy(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={start}
        disabled={busy}
        className="rounded-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-1.5 text-[13px] font-semibold text-gray-900 dark:text-white hover:border-gray-900 disabled:opacity-60"
      >
        {busy ? "Opening…" : "Message"}
      </button>
      {error && (
        <span role="alert" className="max-w-xs text-xs text-red-600">
          {error}{" "}
          {upgrade && (
            <Link href="/pro" className="font-semibold underline">
              See plans
            </Link>
          )}
        </span>
      )}
    </span>
  );
}

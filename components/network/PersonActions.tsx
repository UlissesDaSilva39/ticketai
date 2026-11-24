"use client";

import { useState } from "react";

export type Connection = "none" | "sent" | "received" | "connected";

/** Connect / Pending / Accept + Follow buttons for a person card. */
export default function PersonActions({
  personId,
  connection: initialConnection,
  following: initialFollowing,
  compact = false,
}: {
  personId: string;
  connection: Connection;
  following: boolean;
  compact?: boolean;
}) {
  const [connection, setConnection] = useState<Connection>(initialConnection);
  const [following, setFollowing] = useState(initialFollowing);
  const [busy, setBusy] = useState(false);

  async function connect() {
    setBusy(true);
    const prev = connection;
    // toggle: none -> sent, sent -> none (withdraw)
    setConnection(prev === "sent" ? "none" : "sent");
    try {
      const res = await fetch("/api/friends/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ friendId: personId }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setConnection(prev);
    } finally {
      setBusy(false);
    }
  }

  async function accept() {
    setBusy(true);
    try {
      const res = await fetch("/api/connections/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ senderId: personId, action: "accept" }),
      });
      if (res.ok) setConnection("connected");
    } finally {
      setBusy(false);
    }
  }

  async function follow() {
    const next = !following;
    setFollowing(next);
    try {
      const res = await fetch("/api/follows/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ targetType: "user", targetId: personId, following: next }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setFollowing(!next);
    }
  }

  const pill = "rounded-full px-4 py-1.5 text-[13px] font-semibold disabled:opacity-60";
  return (
    <div className={`flex ${compact ? "flex-col" : "flex-wrap"} gap-2`}>
      {connection === "connected" ? (
        <span className={`${pill} bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 text-center`}>✓ Connected</span>
      ) : connection === "received" ? (
        <button type="button" onClick={accept} disabled={busy} className={`${pill} bg-emerald-600 text-white hover:bg-emerald-700`}>
          Accept
        </button>
      ) : (
        <button
          type="button"
          onClick={connect}
          disabled={busy}
          className={`${pill} ${connection === "sent" ? "border border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-gray-300" : "border border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-zinc-800"}`}
          title={connection === "sent" ? "Click to withdraw the request" : undefined}
        >
          {connection === "sent" ? "Pending" : "+ Connect"}
        </button>
      )}
      <button
        type="button"
        onClick={follow}
        aria-pressed={following}
        className={`${pill} ${following ? "bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-gray-200" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"}`}
      >
        {following ? "Following" : "Follow"}
      </button>
    </div>
  );
}

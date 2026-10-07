"use client";

import { useState } from "react";

export default function FriendButton({
  friendId,
  initialStatus,
}: {
  friendId: string;
  initialStatus: string | null;
}) {
  const [status, setStatus] = useState<string | null>(initialStatus);
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/friends/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendId }),
      });
      const data = await res.json();
      setStatus(data.status);
    } finally {
      setBusy(false);
    }
  };

  const label =
    status === "accepted"
      ? "Friends"
      : status === "pending"
      ? "Request Sent"
      : "+ Add Friend";

  const style =
    status === "accepted"
      ? "bg-white border-2 border-black text-black hover:bg-gray-50"
      : status === "pending"
      ? "bg-gray-200 border-2 border-gray-400 text-gray-600 cursor-default"
      : "bg-black text-white hover:bg-gray-800";

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy || status === "pending"}
      className={"px-5 py-2.5 text-sm font-medium rounded-full transition-colors " + style}
    >
      {busy ? "…" : label}
    </button>
  );
}
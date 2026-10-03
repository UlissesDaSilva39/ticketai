"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function InterestButtons({
  eventId,
  initialStatus,
  isSignedIn,
}: {
  eventId: string;
  initialStatus: "interested" | "going" | null;
  isSignedIn: boolean;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  const toggle = async (next: "interested" | "going") => {
    if (!isSignedIn) {
      window.location.href = "/login";
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/event-interest/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, status: status === next ? null : next }),
      });
      const data = await res.json();
      setStatus(data.status);
      startTransition(() => {
        router.refresh();
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => toggle("interested")}
        disabled={busy}
        className={
          "px-6 py-3 rounded-full font-medium transition-colors " +
          (status === "interested"
            ? "bg-[#00FF87] text-black"
            : "border-2 border-white text-white hover:bg-white/10")
        }
      >
        {status === "interested" ? "Interested" : "I am Interested"}
      </button>
      <button
        onClick={() => toggle("going")}
        disabled={busy}
        className={
          "px-6 py-3 rounded-full font-medium transition-colors " +
          (status === "going"
            ? "bg-black text-white border-2 border-black"
            : "border-2 border-white text-white hover:bg-white/10")
        }
      >
        {status === "going" ? "Going" : "I am Going"}
      </button>
    </div>
  );
}
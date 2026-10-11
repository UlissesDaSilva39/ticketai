"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";

type Props = {
  bookingId: string;
  initialStatus: string;
};

export default function BookingResponseButtons({
  bookingId,
  initialStatus,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function respond(next: "accepted" | "declined") {
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/book/respond", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: bookingId, status: next }),
      });

      let data: any = null;
      const text = await res.text();
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = { error: text || "Invalid JSON response" };
      }

      if (!res.ok) {
        setError(data?.error || "Request failed (" + res.status + ")");
        return;
      }

      setStatus(next);
      router.refresh();
    } catch (e: any) {
      setError(e?.message || "Network error");
    } finally {
      setBusy(false);
    }
  }

  if (status === "accepted") {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-green-50 text-green-700 px-3 py-1 text-xs font-medium">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Accepted
      </div>
    );
  }

  if (status === "declined") {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 text-gray-600 px-3 py-1 text-xs font-medium">
        <XCircle className="h-3.5 w-3.5" />
        Declined
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => respond("accepted")}
          disabled={busy}
          className="inline-flex items-center gap-1 rounded-full bg-black text-white px-4 py-1.5 text-xs font-medium hover:bg-gray-900 disabled:opacity-50 transition"
        >
          {busy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Check className="h-3.5 w-3.5" />
          )}
          Accept
        </button>
        <button
          type="button"
          onClick={() => respond("declined")}
          disabled={busy}
          className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-4 py-1.5 text-xs font-medium hover:bg-gray-50 disabled:opacity-50 transition"
        >
          <X className="h-3.5 w-3.5" />
          Decline
        </button>
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 px-3 py-1 text-xs font-medium">
          <Clock className="h-3.5 w-3.5" />
          Pending
        </span>
      </div>
      {error && (
        <div className="rounded-lg bg-red-50 p-2 text-xs text-red-700 max-w-md">
          {error}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";

export default function ReturnButton({ ticketId }: { ticketId: string }) {
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const returnTicket = async () => {
    if (!confirm("Return this ticket to the waitlist? You will get a refund only if someone else claims it.")) return;
    setProcessing(true);
    setError("");
    try {
      const res = await fetch("/api/tickets/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setProcessing(false);
    }
  };

  if (done) {
    return (
      <span className="inline-block px-5 py-2 bg-[#00FF87] text-black text-sm font-medium rounded-full">
        Returned to waitlist
      </span>
    );
  }

  return (
    <div>
      <button
        onClick={returnTicket}
        disabled={processing}
        className="px-5 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-200 disabled:opacity-50"
      >
        {processing ? "Returning..." : "Return to Waitlist"}
      </button>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}

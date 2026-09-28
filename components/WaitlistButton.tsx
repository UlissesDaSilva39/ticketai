"use client";

import { useState } from "react";

export default function WaitlistButton({ eventId }: { eventId: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const join = async () => {
    if (!email.trim()) return;
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/waitlist/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setStatus("success");
      setMessage("You are on the waitlist. We will email you when tickets become available.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Failed");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-[#00FF87] rounded-lg p-6">
        <p className="font-bold text-lg mb-1" style={{ fontFamily: "var(--font-antonio)" }}>
          YOU ARE ON THE LIST
        </p>
        <p className="text-sm">{message}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
        Sold Out
      </p>
      <p className="font-bold text-2xl mb-4" style={{ fontFamily: "var(--font-antonio)" }}>
        JOIN WAITLIST
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") join(); }}
        placeholder="your@email.com"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none mb-3 text-sm"
      />
      <button
        onClick={join}
        disabled={status === "sending" || !email.trim()}
        className="w-full py-4 bg-black text-white font-medium rounded-full hover:bg-gray-800 disabled:opacity-50"
      >
        {status === "sending" ? "Joining..." : "Notify Me"}
      </button>
      {status === "error" && message && (
        <p className="text-sm text-red-600 mt-3">{message}</p>
      )}
      <p className="text-xs text-gray-500 mt-3">
        We will email you the moment a ticket becomes available.
      </p>
    </div>
  );
}

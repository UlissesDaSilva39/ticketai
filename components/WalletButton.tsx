"use client";

import { useState } from "react";

export default function WalletButton({ ticketId }: { ticketId: string }) {
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState<{ apple: string; google: string } | null>(null);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/wallet/create-pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUrls({ apple: data.applePass, google: data.googleSaveUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  if (urls) {
    return (
      <div className="flex flex-wrap gap-2">
        <a
          href={"data:application/vnd.apple.pkpass;base64," + urls.apple}
          download="ticket.pkpass"
          className="px-4 py-2 bg-black text-white text-sm rounded-full hover:bg-gray-800"
        >
          Add to Apple Wallet
        </a>
        <a
          href={urls.google}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 border border-black text-sm rounded-full hover:bg-gray-50"
        >
          Add to Google Wallet
        </a>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={generate}
        disabled={loading}
        className="px-5 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? "Generating..." : "Add to Wallet"}
      </button>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}

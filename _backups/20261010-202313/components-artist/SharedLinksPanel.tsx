"use client";

import { useEffect, useState } from "react";

type Share = {
  token: string;
  created_at: string;
  expires_at: string;
};

type Props = {
  artistSlug: string;
};

export default function SharedLinksPanel({ artistSlug }: Props) {
  const [shares, setShares] = useState<Share[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [revokingToken, setRevokingToken] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/artists/" + artistSlug + "/analytics-share", {
        method: "GET",
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed to load shares");
      setShares(data.shares ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artistSlug]);

  const handleCopy = async (token: string) => {
    const url = window.location.origin + "/share/analytics/" + token;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    } catch {
      setError("Failed to copy");
    }
  };

  const handleRevoke = async (token: string) => {
    if (!confirm("Revoke this link? Anyone using it will lose access.")) return;
    setRevokingToken(token);
    setError(null);
    try {
      const res = await fetch("/api/artists/" + artistSlug + "/analytics-share", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed to revoke");
      setShares((prev) => prev.filter((s) => s.token !== token));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setRevokingToken(null);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Shared links</h2>
        <button
          type="button"
          onClick={load}
          className="text-xs text-gray-500 hover:text-black"
        >
          Refresh
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : shares.length === 0 ? (
        <p className="text-sm text-gray-500">
          No active share links. Click <strong>Share</strong> to create one.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {shares.map((s) => (
            <li key={s.token} className="py-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs text-gray-500">
                  Created {new Date(s.created_at).toLocaleDateString("en-GB")} · Expires{" "}
                  {new Date(s.expires_at).toLocaleDateString("en-GB")}
                </p>
                <p className="text-xs text-gray-400 font-mono truncate mt-0.5">
                  {s.token.slice(0, 16)}...
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(s.token)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  {copiedToken === s.token ? "Copied" : "Copy"}
                </button>
                <button
                  type="button"
                  onClick={() => handleRevoke(s.token)}
                  disabled={revokingToken === s.token}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  {revokingToken === s.token ? "Revoking..." : "Revoke"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
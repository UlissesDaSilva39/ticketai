"use client";

import { useState } from "react";

type Props = {
  artistSlug: string;
};

export default function ShareAnalyticsButton({ artistSlug }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState<7 | 30 | 90>(30);

  const handleShare = async () => {
    if (shareUrl) {
      setOpen(true);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "/api/artists/" + artistSlug + "/analytics-share?days=" + days,
        { method: "POST" }
      );
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Failed to create share link");
        setOpen(true);
        return;
      }
      const url = window.location.origin + "/share/analytics/" + data.token;
      setShareUrl(url);
      setExpiresAt(data.expiresAt);
      setOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy");
    }
  };

  return (
    <>
      <select
        value={days}
        onChange={(e) => setDays(Number(e.target.value) as 7 | 30 | 90)}
        className="text-sm text-gray-700 border border-gray-300 rounded-lg px-2 py-1 mr-2"
        aria-label="Expiration days"
      >
        <option value={7}>7 days</option>
        <option value={30}>30 days</option>
        <option value={90}>90 days</option>
      </select>
      <button
        type="button"
        onClick={handleShare}
        disabled={loading}
        className="text-sm text-gray-500 hover:text-black whitespace-nowrap disabled:opacity-50"
      >
        {loading ? "Loading..." : "Share"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Share analytics</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-black text-xl leading-none"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {error ? (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Anyone with this link can view a read-only snapshot of your analytics.
                </p>

                {shareUrl && (
                  <>
                    <div className="flex gap-2 mb-3">
                      <input
                        readOnly
                        value={shareUrl}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="px-4 py-2 bg-black text-white rounded-lg text-xs font-medium hover:bg-gray-800"
                      >
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>

                    {expiresAt && (
                      <p className="text-xs text-gray-500">
                        Expires {new Date(expiresAt).toLocaleDateString("en-GB")}
                      </p>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
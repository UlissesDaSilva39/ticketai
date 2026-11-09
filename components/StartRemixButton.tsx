"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = { artistSlug: string; trackId?: string };

export function StartRemixButton({ artistSlug, trackId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [originalPct, setOriginalPct] = useState(30);
  const [remixerPct, setRemixerPct] = useState(60);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const platformPct = 100 - originalPct - remixerPct;
  const valid = platformPct >= 0 && originalPct > 0 && remixerPct > 0;

  async function submit() {
    setError(null);
    if (!valid) { setError("Splits must total 100% with all positive"); return; }
    setBusy(true);
    try {
      const res = await fetch("/api/remix/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          original_artist_slug: artistSlug,
          original_track_id: trackId,
          proposed_split: {
            original_pct: originalPct,
            remixer_pct: remixerPct,
            platform_pct: platformPct,
          },
          message,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Failed");
      setOpen(false);
      router.push("/remix/" + body.request.id);
    } catch (e: any) {
      setError(e.message || "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-black text-white px-5 py-3 text-sm font-medium"
      >
        Start Remix
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 space-y-4">
            <h3 className="text-xl font-bold">Propose a remix</h3>
            <p className="text-sm text-gray-600">
              Agree on the split before you start. The contract is created the
              moment you send this, and both sides see the same numbers on their EPK.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Original artist %</label>
                <input type="number" min={0} max={100} value={originalPct}
                  onChange={(e) => setOriginalPct(Number(e.target.value))}
                  className="w-full border rounded-xl px-3 py-2" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">You (remixer) %</label>
                <input type="number" min={0} max={100} value={remixerPct}
                  onChange={(e) => setRemixerPct(Number(e.target.value))}
                  className="w-full border rounded-xl px-3 py-2" />
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Platform: <strong>{platformPct}%</strong>{" "}
              {!valid && <span className="text-red-600">— splits must total 100%</span>}
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Say what you plan to do with the remix..."
              className="w-full border rounded-xl px-3 py-2 text-sm h-24"
            />

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)}
                className="rounded-full border px-4 py-2 text-sm">Cancel</button>
              <button type="button" onClick={submit} disabled={busy || !valid}
                className="rounded-full bg-black text-white px-4 py-2 text-sm disabled:opacity-50">
                {busy ? "Sending…" : "Send proposal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
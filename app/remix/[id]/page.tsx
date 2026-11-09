"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Split = { original_pct: number; remixer_pct: number; platform_pct: number };
type Req = {
  id: string;
  original_artist_slug: string;
  remixer_name: string;
  proposed_split: Split;
  message: string | null;
  status: string;
  created_at: string;
};

export default function RemixRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [req, setReq] = useState<Req | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/remix/" + id);
      if (!r.ok) throw new Error("Not found");
      const j = await r.json();
      setReq(j.request);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, [id]);

  async function setStatus(status: string) {
    setBusy(true);
    try {
      const r = await fetch("/api/remix/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!r.ok) {
        const b = await r.json().catch(() => ({}));
        throw new Error(b.error || "Failed");
      }
      await load();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <main className="p-16">Loading…</main>;
  if (err) return <main className="p-16 text-red-600">{err}</main>;
  if (!req) return <main className="p-16">Not found</main>;

  const s = req.proposed_split;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
        Remix proposal
      </p>
      <h1 className="text-3xl font-bold mb-2">
        {req.remixer_name} → {req.original_artist_slug}
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Status: <strong>{req.status}</strong>
      </p>

      <div className="rounded-2xl border p-6 space-y-3 mb-6">
        <h2 className="font-semibold mb-2">Proposed split</h2>
        <div className="flex justify-between text-sm">
          <span>Original artist</span><strong>{s.original_pct}%</strong>
        </div>
        <div className="flex justify-between text-sm">
          <span>Remixer</span><strong>{s.remixer_pct}%</strong>
        </div>
        <div className="flex justify-between text-sm">
          <span>Platform</span><strong>{s.platform_pct}%</strong>
        </div>
      </div>

      {req.message && (
        <div className="rounded-2xl border p-6 mb-6">
          <h2 className="font-semibold mb-2">Message</h2>
          <p className="text-sm whitespace-pre-wrap">{req.message}</p>
        </div>
      )}

      <div className="flex gap-3">
        {req.status === "pending" && (
          <>
            <button disabled={busy} onClick={() => setStatus("accepted")}
              className="rounded-full bg-black text-white px-5 py-3 text-sm">
              Accept split
            </button>
            <button disabled={busy} onClick={() => setStatus("rejected")}
              className="rounded-full border px-5 py-3 text-sm">
              Reject
            </button>
          </>
        )}
        {req.status === "accepted" && (
          <button disabled={busy} onClick={() => setStatus("in_progress")}
            className="rounded-full bg-black text-white px-5 py-3 text-sm">
            Start working
          </button>
        )}
        {req.status === "in_progress" && (
          <button disabled={busy} onClick={() => setStatus("released")}
            className="rounded-full bg-black text-white px-5 py-3 text-sm">
            Mark as released
          </button>
        )}
        <button onClick={() => router.push("/messages")}
          className="rounded-full border px-5 py-3 text-sm">
          Back to messages
        </button>
      </div>
    </main>
  );
}
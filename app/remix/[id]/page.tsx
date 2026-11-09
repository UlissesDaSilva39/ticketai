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

  // Revenue logging state
  const [revAmount, setRevAmount] = useState("");
  const [revSource, setRevSource] = useState("stream");
  const [revNotes, setRevNotes] = useState("");
  const [revBusy, setRevBusy] = useState(false);
  const [revSuccess, setRevSuccess] = useState(false);

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

  async function logRevenue(e: React.FormEvent) {
    e.preventDefault();
    if (!revAmount || isNaN(Number(revAmount))) return;
    setRevBusy(true);
    setErr(null);
    try {
      const cents = Math.round(Number(revAmount) * 100);
      const r = await fetch(`/api/remix/${id}/revenue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount_cents: cents,
          source: revSource,
          notes: revNotes
        }),
      });
      if (!r.ok) {
        const b = await r.json().catch(() => ({}));
        throw new Error(b.error || "Failed to log revenue");
      }
      setRevSuccess(true);
      setRevAmount("");
      setRevNotes("");
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setRevBusy(false);
    }
  }

  if (loading) return <main className="p-16">Loading…</main>;
  if (err && !req) return <main className="p-16 text-red-600">{err}</main>;
  if (!req) return <main className="p-16">Not found</main>;

  const s = req.proposed_split;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
        Remix Proposal
      </p>
      <h1 className="text-3xl font-bold mb-2">
        {req.remixer_name} → {req.original_artist_slug}
      </h1>
      
      <div className="flex items-center gap-3 mb-8">
        <span className="text-sm text-gray-500">Status:</span>
        <strong className="uppercase tracking-wide text-sm">{req.status}</strong>
      </div>

      <div className="rounded-2xl border p-6 space-y-3 mb-8">
        <h2 className="font-semibold mb-2 border-b pb-2">Proposed Split</h2>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Original artist</span><strong>{s.original_pct}%</strong>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Remixer</span><strong>{s.remixer_pct}%</strong>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Platform</span><strong>{s.platform_pct}%</strong>
        </div>
      </div>

      {req.message && (
        <div className="rounded-2xl bg-gray-50 border p-6 mb-8">
          <h2 className="font-semibold mb-2 text-sm text-gray-500 uppercase tracking-wider">Message</h2>
          <p className="text-sm whitespace-pre-wrap">{req.message}</p>
        </div>
      )}

      <div className="flex gap-3 mb-12">
        {req.status === "pending" && (
          <>
            <button disabled={busy} onClick={() => setStatus("accepted")}
              className="rounded-full bg-black text-white px-5 py-3 text-sm font-medium">
              Accept Split
            </button>
            <button disabled={busy} onClick={() => setStatus("rejected")}
              className="rounded-full border px-5 py-3 text-sm font-medium hover:bg-gray-50">
              Reject
            </button>
          </>
        )}
        {req.status === "accepted" && (
          <button disabled={busy} onClick={() => setStatus("in_progress")}
            className="rounded-full bg-black text-white px-5 py-3 text-sm font-medium">
            Start Working
          </button>
        )}
        {req.status === "in_progress" && (
          <button disabled={busy} onClick={() => setStatus("released")}
            className="rounded-full bg-black text-white px-5 py-3 text-sm font-medium">
            Mark as Released
          </button>
        )}
        <button onClick={() => router.push("/epk")}
          className="rounded-full border px-5 py-3 text-sm font-medium hover:bg-gray-50">
          Go to EPK
        </button>
      </div>

      {/* Revenue Ledger Section */}
      {req.status === "released" && (
        <div className="border-t pt-8 mt-8">
          <h2 className="text-xl font-bold mb-2">Log Revenue</h2>
          <p className="text-sm text-gray-500 mb-6">
            Record income generated by this remix. The system will automatically split it
            between you and your collaborator based on the agreed percentages.
          </p>
          
          {revSuccess && (
            <div className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-xl text-sm mb-4">
              Revenue logged successfully. Split calculations applied.
            </div>
          )}

          <form onSubmit={logRevenue} className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">Amount ($)</label>
                <input type="number" step="0.01" min="0.01" required
                  value={revAmount} onChange={e => setRevAmount(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="e.g. 50.00" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Source</label>
                <select value={revSource} onChange={e => setRevSource(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 text-sm">
                  <option value="stream">Streaming</option>
                  <option value="sale">Beat Sale</option>
                  <option value="sync">Sync / License</option>
                  <option value="live">Live Show</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Notes (optional)</label>
              <input type="text" value={revNotes} onChange={e => setRevNotes(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="e.g. Q3 streaming royalties" />
            </div>
            {err && <p className="text-xs text-red-600">{err}</p>}
            <button type="submit" disabled={revBusy}
              className="w-full rounded-full bg-black text-white py-3 text-sm font-medium disabled:opacity-50">
              {revBusy ? "Logging…" : "Log Revenue & Calculate Split"}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
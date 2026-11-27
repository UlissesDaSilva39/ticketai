"use client";

import { useState } from "react";

type Row = { id: string; plan: string; headline: string; body: string | null; image_url: string | null; link_url: string; amount_pence: number; status: string; days: number; paid_at: string | null; impressions: number; clicks: number; ends_at: string | null };

export default function AdReview({ rows: initial }: { rows: Row[] }) {
  const [rows, setRows] = useState(initial);
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState("");

  async function act(id: string, action: "approve" | "reject") {
    const note = action === "reject" ? prompt("Reason shown to the advertiser (optional)") ?? "" : "";
    setBusy(id);
    const r = await fetch(`/api/admin/ads/${id}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action, note }) });
    const d = await r.json().catch(() => ({}));
    setBusy("");
    if (!r.ok) return setMsg(d.error || "Failed.");
    setMsg(action === "approve" ? "Approved: the ad is live." : "Rejected and refunded.");
    setRows((x) => (action === "approve" ? x.map((y) => (y.id === id ? { ...y, status: "active" } : y)) : x.filter((y) => y.id !== id)));
  }

  if (!rows.length) return <p className="mt-6 text-gray-600 dark:text-gray-400">Nothing to review.</p>;
  return (
    <>
      {msg && <p role="status" className="mt-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-200 px-4 py-2 text-sm font-semibold">{msg}</p>}
      <ul className="mt-6 space-y-4">
        {rows.map((r) => (
          <li key={r.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 flex flex-col sm:flex-row gap-4">
            {r.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.image_url} alt="" className="w-full sm:w-48 aspect-video object-cover rounded-lg" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold uppercase text-gray-500">{r.plan} · £{(r.amount_pence / 100).toFixed(2)} · {r.days} days · {r.status.replace("_", " ")}</p>
              <p className="font-bold text-gray-900 dark:text-white mt-1">{r.headline}</p>
              {r.body && <p className="text-sm text-gray-600 dark:text-gray-400">{r.body}</p>}
              <a href={r.link_url} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-700 dark:text-emerald-400 underline break-all">{r.link_url}</a>
              {r.status === "active" && <p className="text-xs text-gray-500 mt-1">{r.impressions} views · {r.clicks} clicks</p>}
              {r.status === "in_review" && (
                <div className="flex gap-2 mt-3">
                  <button type="button" disabled={busy === r.id} onClick={() => act(r.id, "approve")} className="px-4 py-2 rounded-full text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60">Approve</button>
                  <button type="button" disabled={busy === r.id} onClick={() => act(r.id, "reject")} className="px-4 py-2 rounded-full text-sm font-bold border border-red-300 text-red-700 dark:text-red-400 disabled:opacity-60">Reject & refund</button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

"use client";

import { useState } from "react";

type Row = { id: string; seller_id: string; amount_pence: number; created_at: string; name: string; username: string | null; connected: boolean };

export default function WithdrawalList({ rows: initial }: { rows: Row[] }) {
  const [rows, setRows] = useState(initial);
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState("");

  async function act(id: string, action: "stripe" | "manual" | "reject") {
    const note = action === "reject" ? prompt("Reason (shown to the member)") ?? "" : action === "manual" ? prompt("Reference for your bank transfer (optional)") ?? "" : "";
    setBusy(id);
    const r = await fetch(`/api/admin/withdrawals/${id}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action, note }) });
    const d = await r.json().catch(() => ({}));
    setBusy("");
    if (!r.ok) return setMsg(d.error || "Failed.");
    setMsg(action === "reject" ? "Declined." : "Marked as paid.");
    setRows((x) => x.filter((y) => y.id !== id));
  }

  if (!rows.length) return <p className="mt-6 text-gray-600 dark:text-gray-400">Nobody is waiting to be paid.</p>;
  return (
    <>
      {msg && <p role="status" className="mt-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-200 px-4 py-2 text-sm font-semibold">{msg}</p>}
      <ul className="mt-6 space-y-3">
        {rows.map((r) => (
          <li key={r.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 dark:text-white">£{(r.amount_pence / 100).toFixed(2)} · {r.name}{r.username ? ` (@${r.username})` : ""}</p>
              <p className="text-xs text-gray-500">Requested {new Date(r.created_at).toLocaleString("en-GB")} · {r.connected ? "Bank connected with Stripe" : "No Stripe bank: pay by hand"}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {r.connected && <button type="button" disabled={busy === r.id} onClick={() => act(r.id, "stripe")} className="px-4 py-2 rounded-full text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60">Pay with Stripe</button>}
              <button type="button" disabled={busy === r.id} onClick={() => act(r.id, "manual")} className="px-4 py-2 rounded-full text-sm font-bold border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-200 disabled:opacity-60">Mark paid</button>
              <button type="button" disabled={busy === r.id} onClick={() => act(r.id, "reject")} className="px-4 py-2 rounded-full text-sm font-bold border border-red-300 text-red-700 dark:text-red-400 disabled:opacity-60">Decline</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

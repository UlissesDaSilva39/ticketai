"use client";

import { useState } from "react";
import { Check, HandCoins, X } from "lucide-react";
import { CoinIcon } from "@/components/live/icons";
import { COIN_PACKS, HOST_SHARE, formatGbp } from "@/lib/live/catalog";
import { TIP_AMOUNTS } from "@/lib/tips";

/** Tip a post or a profile with GRID coins (creator keeps 70%). */
export default function TipButton({ targetType, targetId, creatorName, className, label = "Tip" }: { targetType: "post" | "profile"; targetId: string; creatorName: string; className?: string; label?: string }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(100);
  const [balance, setBalance] = useState<number | null>(null);
  const [needCoins, setNeedCoins] = useState(false);
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function openModal() {
    setOpen(true);
    setMsg(null);
    setNeedCoins(false);
    const r = await fetch("/api/coins", { cache: "no-store" });
    if (r.status === 401) return void (window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`);
    const d = await r.json().catch(() => ({}));
    setBalance(d.balance ?? 0);
  }

  async function send() {
    if (balance !== null && balance < amount) return setNeedCoins(true);
    setBusy("tip");
    const r = await fetch("/api/tips", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ targetType, targetId, coins: amount }) });
    const d = await r.json().catch(() => ({}));
    setBusy("");
    if (r.ok) {
      setBalance(d.balance);
      setMsg({ ok: true, text: `Sent! ${creatorName} gets ${formatGbp(Math.floor(amount * HOST_SHARE))}.` });
    } else if (d.code === "insufficient_coins") setNeedCoins(true);
    else setMsg({ ok: false, text: d.error || "Couldn't send the tip." });
  }

  async function buy(packId: string) {
    setBusy(packId);
    const r = await fetch("/api/coins/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ packId, returnTo: window.location.pathname }) });
    const d = await r.json().catch(() => ({}));
    if (r.ok && d.url) return void (window.location.href = d.url);
    setBusy("");
    setMsg({ ok: false, text: d.error || "Couldn't start checkout." });
  }

  return (
    <>
      <button type="button" onClick={openModal} className={className ?? "inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-emerald-600 transition-colors"}>
        <HandCoins className="w-5 h-5" aria-hidden="true" /> {label}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="tip-title" onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
          <div className="bg-white dark:bg-zinc-900 w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-6 text-left">
            <div className="flex items-start justify-between gap-4">
              <h2 id="tip-title" className="text-lg font-bold text-gray-900 dark:text-white">Tip {creatorName}</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800"><X className="w-5 h-5" aria-hidden="true" /></button>
            </div>
            <p className="text-sm text-gray-500 mt-1 inline-flex items-center gap-1.5">
              Your balance: <CoinIcon className="w-4 h-4" /> {balance === null ? "…" : balance.toLocaleString("en-GB")}
            </p>

            {!needCoins ? (
              <>
                <div className="grid grid-cols-5 gap-2 mt-4" role="radiogroup" aria-label="Tip amount">
                  {TIP_AMOUNTS.map((a) => (
                    <button key={a} type="button" role="radio" aria-checked={amount === a} onClick={() => setAmount(a)} className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-colors ${amount === a ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300" : "border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300"}`}>
                      {a >= 1000 ? `${a / 1000}k` : a}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">{amount.toLocaleString("en-GB")} coins · {creatorName} receives {formatGbp(Math.floor(amount * HOST_SHARE))}</p>
                {msg && <p role={msg.ok ? "status" : "alert"} className={`mt-3 text-sm font-semibold flex items-center gap-1.5 ${msg.ok ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>{msg.ok && <Check className="w-4 h-4" aria-hidden="true" />} {msg.text}</p>}
                <button type="button" disabled={!!busy} onClick={send} className="mt-4 w-full py-3 rounded-full font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 inline-flex items-center justify-center gap-2">
                  <CoinIcon className="w-5 h-5" /> {busy === "tip" ? "Sending…" : `Send ${amount.toLocaleString("en-GB")} coins`}
                </button>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-4">Get coins to send this tip</p>
                <ul className="mt-2 space-y-2">
                  {COIN_PACKS.slice(0, 4).map((p) => (
                    <li key={p.id}>
                      <button type="button" disabled={!!busy} onClick={() => buy(p.id)} className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl border-2 hover:border-emerald-500 disabled:opacity-60 ${p.label === "Most popular" ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" : "border-gray-200 dark:border-zinc-700"}`}>
                        <span className="flex items-center gap-2 font-bold text-gray-900 dark:text-white"><CoinIcon className="w-5 h-5" /> {p.coins.toLocaleString("en-GB")}</span>
                        <span className="px-3 py-1 rounded-full text-sm font-bold text-white bg-emerald-600">{busy === p.id ? "…" : formatGbp(p.pence)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => setNeedCoins(false)} className="mt-3 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:underline">Back</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

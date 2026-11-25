"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PlayIcon, NoteIcon, MarketIcon, BookmarkIcon, UsersIcon, CalendarSVG } from "@/components/MusicIcons";
import { useMe, displayName, initials, roleLabel, compactNumber } from "@/lib/hooks/useMe";
import SellModal, { TYPE_LABEL, gbp, type Kind } from "@/components/marketplace/SellModal";

// Seller Dashboard: the member's real marketplace products, sales, revenue,
// balance and withdrawals. Same layout as before.

const WalletIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
);
const UploadIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
);
const ChartIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
);

type Product = {
  id: string;
  kind: Kind;
  title: string;
  description: string | null;
  pricePence: number;
  payWhatYouWant: boolean;
  coverUrl: string | null;
  status: "active" | "paused";
  sales: number;
  revenuePence: number;
  downloadable: boolean;
};
type Payout = { id: string; amount_pence: number; status: string; created_at: string; paid_at: string | null };
type Dashboard = {
  products: Product[];
  balance: {
    totalPence: number;
    pendingPence: number;
    availablePence: number;
    nextClearAt: string | null;
    thisMonthPence: number;
    lastMonthPence: number;
    holdDays: number;
    minPayoutPence: number;
  };
  payouts: Payout[];
  connections: number;
};

function trendText(b: Dashboard["balance"]) {
  if (!b.thisMonthPence && !b.lastMonthPence) return { text: "No sales yet", cls: "text-gray-500" };
  if (!b.lastMonthPence) return { text: `${gbp(b.thisMonthPence)} this month`, cls: "text-green-600" };
  const pct = Math.round(((b.thisMonthPence - b.lastMonthPence) / b.lastMonthPence) * 100);
  return pct >= 0 ? { text: `↑ ${pct}% vs last month`, cls: "text-green-600" } : { text: `↓ ${Math.abs(pct)}% vs last month`, cls: "text-amber-600" };
}

function clearsText(b: Dashboard["balance"]) {
  if (!b.pendingPence || !b.nextClearAt) return `Sales clear after ${b.holdDays} days`;
  const days = Math.max(1, Math.ceil((new Date(b.nextClearAt).getTime() - Date.now()) / 86_400_000));
  return `Next clears in ${days} day${days === 1 ? "" : "s"}`;
}

export default function SellerDashboard() {
  const { me } = useMe();
  const myName = displayName(me?.profile, me?.user.email);
  const [isPlaying, setIsPlaying] = useState(false);
  const trackRef = useRef<HTMLAudioElement | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const load = useCallback(() => {
    fetch("/api/marketplace/seller", { credentials: "include", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        setData(d);
        setError(null);
      })
      .catch(() => setError("Could not load your seller dashboard."));
  }, []);
  useEffect(load, [load]);

  function toggleTrack() {
    const a = trackRef.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => undefined);
    else a.pause();
  }

  const b = data?.balance;
  const trend = b ? trendText(b) : null;
  const liveCount = data?.products.filter((p) => p.status === "active").length ?? 0;
  const openPayout = data?.payouts.find((p) => p.status === "requested");

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen">
      <div className="mx-auto max-w-[1280px] px-4 py-6 grid grid-cols-12 gap-6">

        {/* LEFT COLUMN */}
        <aside className="col-span-12 lg:col-span-3 space-y-3">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-emerald-600 to-emerald-500" />
            <div className="p-5 -mt-10 text-center relative">
              {me?.profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={me.profile.avatar_url} alt={myName} className="w-20 h-20 mx-auto rounded-full object-cover ring-4 ring-white dark:ring-zinc-900 mb-3 bg-emerald-800" />
              ) : (
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-800 text-white grid place-items-center font-bold text-2xl ring-4 ring-white dark:ring-zinc-900 mb-3">{me ? initials(myName) : ""}</div>
              )}
              <p className="font-bold text-gray-900 dark:text-white text-lg">{me ? myName : " "}</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{me ? roleLabel(me.profile.role, me.profile.genre) : " "}</p>
              {me?.profile.city && <p className="text-xs text-gray-500 mt-1">{me.profile.city}</p>}
              <div className="mt-5 space-y-2">
                {me?.latestTrack ? (
                  <>
                    <button type="button" onClick={toggleTrack} aria-pressed={isPlaying} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 rounded-full transition-colors flex items-center justify-center gap-2">
                      <PlayIcon className="w-3.5 h-3.5" /> {isPlaying ? "Pause Track" : "Play Latest Track"}
                    </button>
                    <audio ref={trackRef} src={me.latestTrack.url} preload="none" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={() => setIsPlaying(false)} />
                  </>
                ) : (
                  <Link href="/home" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 rounded-full transition-colors flex items-center justify-center gap-2">
                    <PlayIcon className="w-3.5 h-3.5" /> Share your first track
                  </Link>
                )}
                <Link href="/epk" className="w-full border-2 border-emerald-600 text-emerald-700 dark:text-emerald-400 text-sm font-bold py-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors block text-center">View EPK</Link>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-6 pt-5 border-t border-gray-100 dark:border-zinc-800 text-center">
                <div><p className="font-bold text-gray-900 dark:text-white text-base">{data ? compactNumber(data.connections) : "–"}</p><p className="text-[11px] text-gray-500 uppercase tracking-wide">Connections</p></div>
                <div><p className="font-bold text-gray-900 dark:text-white text-base">{me ? compactNumber(me.counts.followers) : "–"}</p><p className="text-[11px] text-gray-500 uppercase tracking-wide">Followers</p></div>
              </div>
            </div>
            <div className="border-t border-gray-100 dark:border-zinc-800 p-4">
              <ul className="space-y-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <li><Link href="/marketplace" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><MarketIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Marketplace</span></Link></li>
                <li><Link href="/saved" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><BookmarkIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Saved Items</span></Link></li>
                <li><Link href="/groups" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><UsersIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Groups</span></Link></li>
                <li><Link href="/events" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><CalendarSVG className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Events</span></Link></li>
              </ul>
            </div>
          </div>
        </aside>

        {/* MAIN COLUMN */}
        <main className="col-span-12 lg:col-span-9 space-y-4">

          {/* HEADER */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white text-2xl flex items-center gap-2">
                <ChartIcon className="w-6 h-6 text-emerald-600" /> Seller Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">Manage your products, track revenue, and withdraw earnings.</p>
            </div>
            <button type="button" onClick={() => setShowUploadModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
              <UploadIcon /> Upload New Product
            </button>
          </div>

          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                <ChartIcon className="w-4 h-4 text-emerald-600" /> Total Revenue
              </div>
              <p className="font-bold text-gray-900 dark:text-white text-3xl">{b ? gbp(b.totalPence) : "–"}</p>
              <p className={`text-xs mt-1 font-semibold ${trend?.cls ?? "text-gray-500"}`}>{trend?.text ?? " "}</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                <WalletIcon className="w-4 h-4 text-amber-600" /> Pending Payouts
              </div>
              <p className="font-bold text-gray-900 dark:text-white text-3xl">{b ? gbp(b.pendingPence) : "–"}</p>
              <p className="text-xs text-gray-500 mt-1 font-semibold">{b ? clearsText(b) : " "}</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 p-5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">
                <WalletIcon className="w-4 h-4" /> Available Balance
              </div>
              <p className="font-bold text-gray-900 dark:text-white text-3xl">{b ? gbp(b.availablePence) : "–"}</p>
              <button type="button" onClick={() => setWithdrawOpen(true)} disabled={!data} className="mt-2 inline-block bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                {openPayout ? "Withdrawal requested" : "Withdraw →"}
              </button>
            </div>
          </div>

          {/* PRODUCTS LIST */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">Your Products</h2>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">{liveCount} live</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-zinc-800/50 text-gray-500 font-semibold border-b border-gray-100 dark:border-zinc-800">
                  <tr>
                    <th className="px-5 py-3">Product</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Price</th>
                    <th className="px-5 py-3">Sales</th>
                    <th className="px-5 py-3">Revenue</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-gray-700 dark:text-gray-300">
                  {!data ? (
                    <tr><td colSpan={7} className="px-5 py-8"><div className="h-6 rounded bg-gray-100 dark:bg-zinc-800 animate-pulse" /></td></tr>
                  ) : data.products.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-10 text-center">
                        <p className="font-semibold text-gray-900 dark:text-white">No products yet</p>
                        <p className="text-sm text-gray-500 mt-1">Upload a beat, sample pack, service or merch to start selling.</p>
                        <button type="button" onClick={() => setShowUploadModal(true)} className="mt-3 text-emerald-600 hover:underline font-semibold text-sm">Upload your first product</button>
                      </td>
                    </tr>
                  ) : (
                    data.products.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {p.coverUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={p.coverUrl} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                <NoteIcon className="w-5 h-5" />
                              </div>
                            )}
                            <span className="font-semibold text-gray-900 dark:text-white">{p.title}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">{TYPE_LABEL[p.kind]}</td>
                        <td className="px-5 py-4 font-semibold">{gbp(p.pricePence)}{p.payWhatYouWant ? "+" : ""}</td>
                        <td className="px-5 py-4">{p.sales}</td>
                        <td className="px-5 py-4 font-bold text-emerald-600">{gbp(p.revenuePence)}</td>
                        <td className="px-5 py-4">
                          {p.status === "active" ? (
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold px-2 py-1 rounded-full">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Live
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400 text-xs font-bold px-2 py-1 rounded-full">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span> Paused
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button type="button" onClick={() => setEditing(p)} className="text-emerald-600 hover:underline font-semibold text-xs">Edit</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <SellModal
          onClose={() => setShowUploadModal(false)}
          onCreated={() => {
            setShowUploadModal(false);
            load();
          }}
        />
      )}

      {editing && (
        <EditModal
          product={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}

      {withdrawOpen && data && (
        <WithdrawModal
          data={data}
          onClose={() => setWithdrawOpen(false)}
          onRequested={() => {
            load();
          }}
        />
      )}
    </div>
  );
}

const inputCls = "w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500";

function EditModal({ product, onClose, onSaved }: { product: Product; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState(product.title);
  const [description, setDescription] = useState(product.description ?? "");
  const [price, setPrice] = useState((product.pricePence / 100).toFixed(2));
  const [pwyw, setPwyw] = useState(product.payWhatYouWant);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(patch: Record<string, unknown>) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/marketplace/listings/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(patch),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Could not save.");
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save.");
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Product</h2>
          <button type="button" aria-label="Close" onClick={onClose} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">&times;</button>
        </div>
        <div className="space-y-3 mb-6">
          <input type="text" value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} placeholder="Product Title" aria-label="Product title" className={inputCls} />
          <textarea value={description} maxLength={2000} rows={3} onChange={(e) => setDescription(e.target.value)} placeholder="Description" aria-label="Description" className={inputCls} />
          <input type="number" min="1" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price (£)" aria-label="Price in pounds" className={inputCls} />
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <input type="checkbox" checked={pwyw} onChange={(e) => setPwyw(e.target.checked)} className="h-4 w-4 accent-emerald-600" /> Pay what you want
          </label>
          <div className="flex flex-wrap gap-2 pt-1">
            <button type="button" disabled={busy} onClick={() => save({ status: product.status === "active" ? "paused" : "active" })} className="border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
              {product.status === "active" ? "Pause listing" : "Put back live"}
            </button>
            {confirmDelete ? (
              <button type="button" disabled={busy} onClick={() => save({ status: "deleted" })} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                Yes, remove it
              </button>
            ) : (
              <button type="button" onClick={() => setConfirmDelete(true)} className="text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                Remove listing
              </button>
            )}
          </div>
          {confirmDelete && <p className="text-[11px] text-gray-500">Buyers who already paid keep their downloads.</p>}
        </div>
        {error && <p role="alert" className="text-xs text-red-600 mb-3">{error}</p>}
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
          <button
            type="button"
            disabled={busy}
            onClick={() => save({ title, description, pricePence: Math.round(Number(price) * 100), payWhatYouWant: pwyw })}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            {busy ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function WithdrawModal({ data, onClose, onRequested }: { data: Dashboard; onClose: () => void; onRequested: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const b = data.balance;
  const open = data.payouts.find((p) => p.status === "requested");
  const canWithdraw = !open && b.availablePence >= b.minPayoutPence;

  async function request() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/marketplace/payouts", { method: "POST", credentials: "include" });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Could not request the withdrawal.");
      setDone(true);
      onRequested();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not request the withdrawal.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Withdraw earnings</h2>
          <button type="button" aria-label="Close" onClick={onClose} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">&times;</button>
        </div>

        {done ? (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Withdrawal requested. We&apos;ll email you to arrange the bank transfer and mark it paid here.</p>
        ) : (
          <>
            <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-3 mb-4 space-y-1">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400"><span>Available now:</span><span>{gbp(b.availablePence)}</span></div>
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400"><span>Still clearing ({b.holdDays}-day hold):</span><span>{gbp(b.pendingPence)}</span></div>
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400"><span>Minimum withdrawal:</span><span>{gbp(b.minPayoutPence)}</span></div>
            </div>
            {open && <p className="text-xs text-amber-700 dark:text-amber-400 mb-3">You have a withdrawal of {gbp(open.amount_pence)} in progress.</p>}
            {error && <p role="alert" className="text-xs text-red-600 mb-3">{error}</p>}
            <button type="button" onClick={request} disabled={!canWithdraw || busy} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors">
              {busy ? "Requesting…" : canWithdraw ? `Withdraw ${gbp(b.availablePence)}` : "Nothing to withdraw yet"}
            </button>
          </>
        )}

        {data.payouts.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Withdrawal history</p>
            <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              {data.payouts.slice(0, 5).map((p) => (
                <li key={p.id} className="flex justify-between">
                  <span>{new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                  <span>{gbp(p.amount_pence)} · {p.status === "requested" ? "In progress" : p.status === "paid" ? "Paid" : "Rejected"}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

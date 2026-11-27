"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { COIN_PACKS, GIFTS, HOST_SHARE, coinsLabel, formatGbp, giftById, liveCategoryLabel, playerSrc, watchUrl } from "@/lib/live/catalog";

type Stream = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  provider: "youtube" | "twitch";
  providerRef: string;
  status: "scheduled" | "live" | "ended";
  scheduledFor: string | null;
  goalCoins: number | null;
  goalLabel: string | null;
};
type Product = { id: string; kind: string; refId: string | null; url: string | null; title: string; pricePence: number | null; imageUrl: string | null; pinned: boolean };
type Msg = { id: number; kind: "chat" | "gift" | "purchase" | "system"; body: string; giftId: string | null; coins: number | null; name: string | null; at: string };
type Burst = { key: number; emoji: string; text: string };

const card = "bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800";

export default function LiveRoom({
  stream,
  host,
  products,
  viewer,
}: {
  stream: Stream;
  host: { name: string; username: string | null; avatarUrl: string | null; headline: string | null };
  products: Product[];
  viewer: { signedIn: boolean; isHost: boolean };
}) {
  const router = useRouter();
  const [status, setStatus] = useState(stream.status);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [raised, setRaised] = useState(0);
  const [supporters, setSupporters] = useState<{ name: string; coins: number }[]>([]);
  const [pinnedId, setPinnedId] = useState<string | null>(products.find((p) => p.pinned)?.id ?? null);
  const [balance, setBalance] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState("");
  const [toast, setToast] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [coinsOpen, setCoinsOpen] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [host_, setHostOrigin] = useState("");
  const lastId = useRef(0);
  const polling = useRef(false);
  const chatEnd = useRef<HTMLDivElement>(null);
  const loginHref = `/login?redirect=${encodeURIComponent(`/live/${stream.id}`)}`;

  const flash = (kind: "ok" | "error", t: string) => {
    setToast({ kind, text: t });
    setTimeout(() => setToast(null), 4000);
  };

  // ---------- polling feed ----------
  const poll = useCallback(async () => {
    // One request at a time, so overlapping polls can't add the same messages twice.
    if (polling.current) return;
    polling.current = true;
    try {
      const res = await fetch(`/api/live/${stream.id}/feed?after=${lastId.current}`, { cache: "no-store" });
      if (!res.ok) return;
      const d = await res.json();
      setStatus(d.status);
      setRaised(d.raisedCoins ?? 0);
      setSupporters(d.supporters ?? []);
      setPinnedId(d.pinnedId ?? null);
      const fresh: Msg[] = d.messages ?? [];
      if (fresh.length) {
        const first = lastId.current === 0;
        lastId.current = fresh[fresh.length - 1].id;
        setMessages((m) => {
          const seen = new Set(m.map((x) => x.id));
          return [...m, ...fresh.filter((x) => !seen.has(x.id))].slice(-150);
        });
        // Gift animations for gifts that arrive while watching (not the backlog).
        if (!first) {
          const gifts = fresh.filter((x) => x.kind === "gift");
          if (gifts.length) {
            setBursts((b) => [
              ...b,
              ...gifts.slice(-3).map((g, i) => ({ key: Date.now() + i, emoji: giftById(g.giftId ?? "")?.emoji ?? "🎁", text: g.body })),
            ]);
          }
        }
      }
    } catch {
      /* offline: try again next tick */
    } finally {
      polling.current = false;
    }
  }, [stream.id]);

  useEffect(() => {
    setHostOrigin(window.location.hostname);
    poll();
    const t = setInterval(() => {
      if (document.visibilityState === "visible") poll();
    }, 2000);
    return () => clearInterval(t);
  }, [poll]);

  useEffect(() => {
    if (!bursts.length) return;
    const t = setTimeout(() => setBursts((b) => b.slice(1)), 3200);
    return () => clearTimeout(t);
  }, [bursts]);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);

  // ---------- coins: balance + returning from Stripe ----------
  useEffect(() => {
    if (!viewer.signedIn) return;
    const sp = new URLSearchParams(window.location.search);
    const sessionId = sp.get("session_id");
    const clean = () => router.replace(`/live/${stream.id}`, { scroll: false });
    (async () => {
      if (sp.get("coins") === "success" && sessionId) {
        const r = await fetch("/api/coins/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sessionId }) });
        const d = await r.json().catch(() => ({}));
        if (r.ok) {
          setBalance(d.balance);
          flash("ok", "Coins added. Send a gift! 🎁");
        }
        clean();
        return;
      }
      if (sp.get("purchase") === "success" && sessionId) {
        const r = await fetch("/api/marketplace/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sessionId }) });
        if (r.ok) flash("ok", "Purchase complete. Thank you! Find it in Marketplace → My purchases.");
        clean();
      } else if (sp.get("coins") === "cancelled" || sp.get("purchase") === "cancelled") {
        flash("error", "Payment cancelled. You haven't been charged.");
        clean();
      }
      const b = await fetch("/api/coins", { cache: "no-store" }).then((x) => x.json()).catch(() => null);
      if (b) setBalance(b.balance);
    })();
  }, [viewer.signedIn, stream.id, router]);

  // ---------- actions ----------
  async function sendChat(e: React.FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    setText("");
    const r = await fetch(`/api/live/${stream.id}/chat`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ body }) });
    if (!r.ok) {
      const d = await r.json().catch(() => ({}));
      flash("error", d.error || "Couldn't send.");
      setText(body);
    } else poll();
  }

  async function sendGift(giftId: string) {
    if (!viewer.signedIn) return router.push(loginHref);
    const g = giftById(giftId);
    if (!g) return;
    if (balance !== null && balance < g.coins) {
      setCoinsOpen(true);
      return;
    }
    setBusy(`gift-${giftId}`);
    const r = await fetch(`/api/live/${stream.id}/gift`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ giftId }) });
    const d = await r.json().catch(() => ({}));
    setBusy("");
    if (r.ok) {
      setBalance(d.balance);
      poll();
    } else if (d.code === "insufficient_coins") setCoinsOpen(true);
    else flash("error", d.error || "Couldn't send the gift.");
  }

  async function buyCoins(packId: string) {
    setBusy(`pack-${packId}`);
    const r = await fetch("/api/coins/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ packId, returnTo: `/live/${stream.id}` }) });
    const d = await r.json().catch(() => ({}));
    if (r.ok && d.url) window.location.href = d.url;
    else {
      setBusy("");
      flash("error", d.error || "Couldn't start checkout.");
    }
  }

  async function buyProduct(p: Product) {
    if (p.kind === "link" && p.url) return window.open(p.url, "_blank", "noopener,noreferrer");
    if (p.kind === "licence" && p.refId) return window.open(`/licensing/deal/${p.refId}`, "_blank", "noopener");
    if (!viewer.signedIn) return router.push(loginHref);
    setBusy(`buy-${p.id}`);
    const r = await fetch("/api/marketplace/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ listingId: p.refId, liveStreamId: stream.id }) });
    const d = await r.json().catch(() => ({}));
    if (r.ok && d.url) window.location.href = d.url;
    else {
      setBusy("");
      flash("error", d.error || "Couldn't start checkout.");
    }
  }

  async function hostAction(body: Record<string, unknown>) {
    setBusy("host");
    const r = await fetch(`/api/live/${stream.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const d = await r.json().catch(() => ({}));
    setBusy("");
    if (!r.ok) flash("error", d.error || "Something went wrong.");
    poll();
  }

  async function share() {
    const url = window.location.href.split("?")[0];
    try {
      if (navigator.share) await navigator.share({ title: stream.title, url });
      else {
        await navigator.clipboard.writeText(url);
        flash("ok", "Link copied. Share it with your fans!");
      }
    } catch {
      /* cancelled */
    }
  }

  const pinned = products.find((p) => p.id === pinnedId) ?? null;
  const others = products.filter((p) => p.id !== pinnedId);
  const goalPct = stream.goalCoins ? Math.min(100, Math.round((raised / stream.goalCoins) * 100)) : 0;
  const src = { provider: stream.provider, ref: stream.providerRef };
  const priceLabel = (p: Product) => (p.pricePence == null ? "" : p.kind === "licence" ? `from ${formatGbp(p.pricePence)}` : formatGbp(p.pricePence));
  const buyLabel = (p: Product) => (p.kind === "licence" ? "Licence" : p.kind === "link" ? "Open" : "Buy now");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pb-24 lg:pb-10">
      <div className="max-w-7xl mx-auto px-0 sm:px-4 pt-0 sm:pt-6 grid gap-4 lg:gap-6 lg:grid-cols-[1fr_380px] items-start">
        {/* ===== LEFT: player, info, shop ===== */}
        <div className="min-w-0 space-y-4">
          <div className="relative bg-black sm:rounded-2xl overflow-hidden aspect-video">
            {status === "ended" ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                <p className="text-2xl font-bold">This live has ended</p>
                <p className="text-white/70 mt-1">Thanks for watching. Follow {host.name} so you don&apos;t miss the next one.</p>
              </div>
            ) : status === "scheduled" ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6 bg-gradient-to-br from-emerald-700 to-zinc-900">
                <p className="text-sm font-bold uppercase tracking-widest text-emerald-200">Starting soon</p>
                <p className="text-2xl sm:text-3xl font-bold mt-2">{stream.title}</p>
                {stream.scheduledFor && <p className="text-white/80 mt-2">{new Date(stream.scheduledFor).toLocaleString("en-GB", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</p>}
                <p className="text-white/70 text-sm mt-4">Chat is open. Say hi while you wait.</p>
              </div>
            ) : host_ ? (
              <iframe src={playerSrc(src, host_)} title={`${stream.title} (live player)`} className="absolute inset-0 w-full h-full" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen />
            ) : null}

            {status === "live" && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-red-600 text-white text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" aria-hidden="true" /> LIVE
              </span>
            )}

            {/* Gift animations */}
            <div className="pointer-events-none absolute inset-x-0 bottom-4 flex flex-col items-center gap-2" aria-live="polite">
              {bursts.slice(0, 2).map((b) => (
                <div key={b.key} className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 text-white text-sm font-semibold shadow-lg motion-safe:animate-bounce">
                  <span className="text-3xl" aria-hidden="true">{b.emoji}</span> {b.text}
                </div>
              ))}
            </div>
          </div>

          {/* Goal bar */}
          {stream.goalCoins && (
            <div className={`${card} p-4 mx-3 sm:mx-0`}>
              <div className="flex justify-between gap-3 text-sm">
                <span className="font-bold text-gray-900 dark:text-white">🎯 {stream.goalLabel || "Live goal"}</span>
                <span className="text-gray-600 dark:text-gray-400">{raised.toLocaleString("en-GB")} / {stream.goalCoins.toLocaleString("en-GB")} coins</span>
              </div>
              <div className="h-3 rounded-full bg-gray-100 dark:bg-zinc-800 mt-2 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={goalPct} aria-label="Goal progress">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-700" style={{ width: `${goalPct}%` }} />
              </div>
            </div>
          )}

          {/* Title + host */}
          <div className="px-3 sm:px-0">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">{liveCategoryLabel(stream.category)}</p>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{stream.title}</h1>
            <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-emerald-100 dark:bg-emerald-900/40 overflow-hidden flex items-center justify-center font-bold text-emerald-700">
                  {host.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={host.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    host.name[0]
                  )}
                </div>
                <div>
                  {host.username ? (
                    <Link href={`/u/${host.username}`} className="font-semibold text-gray-900 dark:text-white hover:underline">{host.name}</Link>
                  ) : (
                    <p className="font-semibold text-gray-900 dark:text-white">{host.name}</p>
                  )}
                  {host.headline && <p className="text-xs text-gray-500">{host.headline}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={share} className="px-4 py-2 rounded-full text-sm font-bold border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-200 hover:border-emerald-500">Share</button>
                {status === "live" && (
                  <a href={watchUrl(src)} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full text-sm font-bold border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-200 hover:border-emerald-500">
                    Open on {stream.provider === "youtube" ? "YouTube" : "Twitch"}
                  </a>
                )}
              </div>
            </div>
            {stream.description && <p className="text-gray-600 dark:text-gray-400 mt-3 whitespace-pre-line">{stream.description}</p>}
          </div>

          {/* Host controls */}
          {viewer.isHost && (
            <div className={`${card} p-4 mx-3 sm:mx-0 border-emerald-300 dark:border-emerald-800`}>
              <p className="font-bold text-gray-900 dark:text-white mb-1">Host controls</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Start streaming on {stream.provider === "youtube" ? "YouTube Live" : "Twitch"} first, then press Start. You earn {Math.round(HOST_SHARE * 100)}% of every gift, paid into your seller balance.
              </p>
              <div className="flex flex-wrap gap-2">
                {status === "scheduled" && (
                  <button type="button" disabled={busy === "host"} onClick={() => hostAction({ action: "start" })} className="px-4 py-2 rounded-full text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60">
                    🔴 Start live
                  </button>
                )}
                {status !== "ended" && (
                  <button type="button" disabled={busy === "host"} onClick={() => confirm("End this live for everyone?") && hostAction({ action: "end" })} className="px-4 py-2 rounded-full text-sm font-bold border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-200">
                    End live
                  </button>
                )}
                <Link href="/seller" className="px-4 py-2 rounded-full text-sm font-bold border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-200">My earnings</Link>
              </div>
            </div>
          )}

          {/* Shop */}
          {products.length > 0 && (
            <section aria-label="Shop this live" className="px-3 sm:px-0">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🛍️ Shop this live</h2>
              {pinned && (
                <div className={`${card} p-4 flex items-center gap-4 border-emerald-400 dark:border-emerald-700 mb-3`}>
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-800 flex-none flex items-center justify-center text-white text-2xl">
                    {pinned.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={pinned.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span aria-hidden="true">🛍️</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">📌 PINNED BY {host.name.toUpperCase()}</p>
                    <p className="font-bold text-gray-900 dark:text-white truncate">{pinned.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{priceLabel(pinned)}</p>
                  </div>
                  <button type="button" disabled={busy === `buy-${pinned.id}`} onClick={() => buyProduct(pinned)} className="flex-none px-5 py-2.5 rounded-full font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60">
                    {busy === `buy-${pinned.id}` ? "…" : buyLabel(pinned)}
                  </button>
                </div>
              )}
              {others.length > 0 && (
                <ul className="flex gap-3 overflow-x-auto pb-2">
                  {others.map((p) => (
                    <li key={p.id} className={`${card} p-3 w-48 flex-none flex flex-col`}>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 flex-1">{p.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{priceLabel(p)}</p>
                      <div className="flex gap-2 mt-2">
                        <button type="button" onClick={() => buyProduct(p)} className="flex-1 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700">{buyLabel(p)}</button>
                        {viewer.isHost && (
                          <button type="button" onClick={() => hostAction({ pinProductId: p.id })} className="px-2.5 py-1.5 rounded-full text-xs font-bold border border-gray-300 dark:border-zinc-700" aria-label={`Pin ${p.title}`}>📌</button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>

        {/* ===== RIGHT: supporters, chat, gifts ===== */}
        <aside className="space-y-4 px-3 sm:px-0 lg:sticky lg:top-20">
          {supporters.length > 0 && (
            <div className={`${card} p-4`}>
              <p className="font-bold text-gray-900 dark:text-white mb-2">🏆 Top supporters</p>
              <ol className="space-y-1.5">
                {supporters.map((s, i) => (
                  <li key={s.name + i} className="flex justify-between text-sm">
                    <span className="text-gray-800 dark:text-gray-200 truncate">{["🥇", "🥈", "🥉"][i] ?? `${i + 1}.`} {s.name}</span>
                    <span className="text-gray-500 flex-none">{s.coins.toLocaleString("en-GB")}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className={`${card} flex flex-col h-[440px]`}>
            <p className="px-4 pt-3 pb-2 font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-zinc-800">Live chat</p>
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5 text-sm" role="log" aria-label="Live chat">
              {messages.length === 0 && <p className="text-gray-500 py-6 text-center">Be the first to say hi 👋</p>}
              {messages.map((m) =>
                m.kind === "gift" ? (
                  <p key={m.id} className="rounded-lg bg-amber-50 dark:bg-amber-900/20 px-2 py-1 font-semibold text-amber-900 dark:text-amber-200">🎁 {m.body}</p>
                ) : m.kind === "purchase" ? (
                  <p key={m.id} className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 font-semibold text-emerald-900 dark:text-emerald-200">🛍️ {m.body}</p>
                ) : m.kind === "system" ? (
                  <p key={m.id} className="text-xs text-gray-500 text-center py-1">{m.body}</p>
                ) : (
                  <p key={m.id} className="text-gray-800 dark:text-gray-200 break-words">
                    <span className="font-semibold text-gray-900 dark:text-white">{m.name}</span> {m.body}
                  </p>
                )
              )}
              <div ref={chatEnd} />
            </div>
            {status === "ended" ? (
              <p className="px-4 py-3 text-sm text-gray-500 border-t border-gray-100 dark:border-zinc-800">Chat is closed.</p>
            ) : viewer.signedIn ? (
              <form onSubmit={sendChat} className="p-3 border-t border-gray-100 dark:border-zinc-800 flex gap-2">
                <label htmlFor="chat" className="sr-only">Message</label>
                <input id="chat" value={text} onChange={(e) => setText(e.target.value)} maxLength={300} placeholder="Say something…" className="flex-1 min-w-0 px-3 py-2 rounded-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm" />
                <button type="submit" className="px-4 py-2 rounded-full text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700">Send</button>
              </form>
            ) : (
              <Link href={loginHref} className="m-3 text-center px-4 py-2.5 rounded-full text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700">Log in to chat and send gifts</Link>
            )}
          </div>

          {/* Gifts */}
          {!viewer.isHost && status !== "ended" && (
            <div className={`${card} p-4`}>
              <div className="flex items-center justify-between gap-2 mb-3">
                <p className="font-bold text-gray-900 dark:text-white">Send a gift</p>
                {viewer.signedIn && (
                  <button type="button" onClick={() => setCoinsOpen(true)} className="text-sm font-bold text-amber-700 dark:text-amber-400 hover:underline">
                    🪙 {balance === null ? "…" : balance.toLocaleString("en-GB")} · Get coins
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {GIFTS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    disabled={status !== "live" || busy.startsWith("gift")}
                    onClick={() => sendGift(g.id)}
                    title={status !== "live" ? "Gifts open when the live starts" : `${g.name}: ${coinsLabel(g.coins)}`}
                    className="flex flex-col items-center gap-0.5 p-2 rounded-xl border border-gray-200 dark:border-zinc-700 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 disabled:opacity-40"
                  >
                    <span className="text-2xl" aria-hidden="true">{g.emoji}</span>
                    <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 leading-tight text-center">{g.name}</span>
                    <span className="text-[11px] text-amber-700 dark:text-amber-400">🪙 {g.coins.toLocaleString("en-GB")}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">{host.name} receives {Math.round(HOST_SHARE * 100)}% of every gift.</p>
            </div>
          )}
        </aside>
      </div>

      {/* Toast */}
      {toast && (
        <div role={toast.kind === "error" ? "alert" : "status"} className={`fixed left-1/2 -translate-x-1/2 bottom-6 z-50 px-5 py-3 rounded-full shadow-lg text-sm font-semibold ${toast.kind === "ok" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.text}
        </div>
      )}

      {/* Coin packs */}
      {coinsOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="coins-title" onKeyDown={(e) => e.key === "Escape" && setCoinsOpen(false)}>
          <div className="bg-white dark:bg-zinc-900 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-1">
              <h2 id="coins-title" className="text-xl font-bold text-gray-900 dark:text-white">Get coins 🪙</h2>
              <button type="button" onClick={() => setCoinsOpen(false)} aria-label="Close" className="text-2xl leading-none text-gray-500">×</button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Coins let you send gifts to artists while they&apos;re live. Balance: {balance?.toLocaleString("en-GB") ?? 0} coins.</p>
            <ul className="space-y-2">
              {COIN_PACKS.map((p) => (
                <li key={p.id}>
                  <button type="button" disabled={busy.startsWith("pack")} onClick={() => buyCoins(p.id)} className={`w-full flex items-center justify-between gap-3 p-4 rounded-xl border-2 hover:border-amber-400 disabled:opacity-60 ${p.label === "Most popular" ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20" : "border-gray-200 dark:border-zinc-700"}`}>
                    <span className="text-left">
                      <span className="block font-bold text-gray-900 dark:text-white">🪙 {p.coins.toLocaleString("en-GB")} coins</span>
                      {p.label && <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{p.label}</span>}
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">{busy === `pack-${p.id}` ? "…" : formatGbp(p.pence)}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 mt-4">Secure payment by Stripe. Coins can only be used for gifts on GRID and aren&apos;t refundable once sent.</p>
          </div>
        </div>
      )}

      {/* Mobile quick bar */}
      {!viewer.isHost && status === "live" && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur border-t border-gray-200 dark:border-zinc-800 px-3 py-2 flex gap-2 overflow-x-auto">
          {GIFTS.slice(0, 4).map((g) => (
            <button key={g.id} type="button" onClick={() => sendGift(g.id)} className="flex-none px-3 py-2 rounded-full border border-gray-200 dark:border-zinc-700 text-sm font-semibold" aria-label={`Send ${g.name}, ${g.coins} coins`}>
              {g.emoji} {g.coins}
            </button>
          ))}
          {pinned && (
            <button type="button" onClick={() => buyProduct(pinned)} className="flex-none px-4 py-2 rounded-full text-sm font-bold text-white bg-emerald-600">
              🛍️ {buyLabel(pinned)}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

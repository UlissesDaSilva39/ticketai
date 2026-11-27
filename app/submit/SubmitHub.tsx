"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, CircleCheck, Clock, ExternalLink, Headphones, Inbox, Mail, Music2, Send, ShieldCheck, Star, X } from "lucide-react";
import { REPLY_DAYS, REVIEWER_GENRES, REVIEWER_SHARE, SUBMISSION_PRICE, VERDICTS, type SubmissionKind, type Verdict } from "@/lib/submissions/catalog";

type Reviewer = { id: string; name: string; username: string | null; avatar: string | null; role: string | null; city: string | null; headline: string; genres: string[]; acceptsDemos: boolean; acceptsMessages: boolean; replyRate: number | null; replies: number };
type Item = {
  id: string;
  kind: SubmissionKind;
  title: string | null;
  track_url: string | null;
  message: string;
  status: "sent" | "replied" | "refunded";
  verdict: Verdict | null;
  reply: string | null;
  paid_at: string | null;
  due_at: string | null;
  reviewer_earn_pence?: number;
  amount_pence?: number;
  sender?: { name: string; username: string | null; avatar: string | null };
  reviewer?: { name: string; username: string | null };
};
type Tab = "find" | "sent" | "inbox" | "review";

const gbp = (p: number) => `£${(p / 100).toFixed(2)}`;
const card = "bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800";
const input = "w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500";
const lbl = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5";
const initials = (n: string) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "G";
const daysLeft = (iso: string | null) => (iso ? Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000)) : 0);

function Face({ name, avatar, size = "w-12 h-12" }: { name: string; avatar: string | null; size?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return avatar ? <img src={avatar} alt="" className={`${size} rounded-full object-cover flex-none`} /> : <span className={`${size} rounded-full bg-emerald-700 text-white grid place-items-center font-bold flex-none`}>{initials(name)}</span>;
}

const VERDICT_STYLE: Record<Verdict, string> = {
  love: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  maybe: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  pass: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300",
};

export default function SubmitHub() {
  const router = useRouter();
  const sp = useSearchParams();
  const [tab, setTab] = useState<Tab>(((sp.get("tab") as Tab) || "find") as Tab);
  const [genre, setGenre] = useState("");
  // Results are tagged with what they were loaded for, so switching tabs never shows stale rows.
  const [reviewerData, setReviewerData] = useState<{ genre: string; list: Reviewer[] } | null>(null);
  const [itemData, setItemData] = useState<{ tab: Tab; list: Item[] } | null>(null);
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(() =>
    sp.get("sent") === "cancelled" ? { ok: false, text: "Payment cancelled. Nothing was sent and you haven't been charged." } : null
  );
  const reviewers = reviewerData && reviewerData.genre === genre ? reviewerData.list : null;
  const items = itemData && itemData.tab === tab ? itemData.list : null;
  const [sendTo, setSendTo] = useState<{ r: Reviewer; kind: SubmissionKind } | null>(null);

  // Back from Stripe.
  useEffect(() => {
    const sessionId = sp.get("session_id");
    if (sp.get("sent") === "success" && sessionId) {
      fetch("/api/submit/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sessionId }) }).finally(() => {
        setBanner({ ok: true, text: `Sent! They have ${REPLY_DAYS} days to reply, or you get a full refund.` });
        router.replace("/submit?tab=sent", { scroll: false });
        setTab("sent");
      });
    } else if (sp.get("sent") === "cancelled") {
      router.replace("/submit", { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTab = useCallback(async (t: Tab, g: string) => {
    if (t === "find") {
      const r = await fetch(`/api/submit/reviewers${g ? `?genre=${encodeURIComponent(g)}` : ""}`, { cache: "no-store" });
      const d = await r.json().catch(() => ({}));
      setReviewerData({ genre: g, list: d.reviewers ?? [] });
    } else if (t === "sent" || t === "inbox") {
      const r = await fetch(`/api/submit/${t}`, { cache: "no-store" });
      if (r.status === 401) return router.replace("/login?redirect=/submit");
      const d = await r.json().catch(() => ({}));
      setItemData({ tab: t, list: d.items ?? [] });
    }
  }, [router]);

  useEffect(() => {
    loadTab(tab, genre);
  }, [tab, genre, loadTab]);

  const TABS: { id: Tab; label: string; Icon: typeof Send }[] = [
    { id: "find", label: "Find reviewers", Icon: Send },
    { id: "sent", label: "Sent", Icon: Mail },
    { id: "inbox", label: "Inbox", Icon: Inbox },
    { id: "review", label: "Get paid to review", Icon: Headphones },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 sm:py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <header>
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1.5"><Music2 className="w-3.5 h-3.5" aria-hidden="true" /> Send your track</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-1">Get your music heard by labels, curators and promoters</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-3xl">
            Send a demo for {gbp(SUBMISSION_PRICE.demo)} or a priority message for {gbp(SUBMISSION_PRICE.message)}. Every one gets a real reply within {REPLY_DAYS} days, or your money back automatically.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-sm text-gray-600 dark:text-gray-400">
            {["Guaranteed reply or refund", "Written feedback", "No subscription"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" /> {t}</span>
            ))}
          </div>
        </header>

        {banner && (
          <p role="status" className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${banner.ok ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-200" : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200"}`}>
            {banner.ok && <CircleCheck className="w-5 h-5 flex-none text-emerald-600" aria-hidden="true" />} {banner.text}
          </p>
        )}

        <div role="tablist" aria-label="Send your track" className="flex gap-1 overflow-x-auto border-b border-gray-200 dark:border-zinc-800">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => {
                setTab(id);
                router.replace(id === "find" ? "/submit" : `/submit?tab=${id}`, { scroll: false });
              }}
              className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 -mb-px transition-colors ${tab === id ? "border-emerald-600 text-emerald-700 dark:text-emerald-400" : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
            >
              <Icon className="w-4 h-4" aria-hidden="true" /> {label}
            </button>
          ))}
        </div>

        {tab === "find" && (
          <section aria-label="Reviewers">
            <div className="flex flex-wrap gap-2 mb-4">
              {["", ...REVIEWER_GENRES].map((g) => (
                <button key={g || "all"} type="button" onClick={() => setGenre(g)} className={`px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-colors ${genre === g ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:border-emerald-500"}`}>
                  {g || "All genres"}
                </button>
              ))}
            </div>
            {reviewers === null ? (
              <div className="grid gap-4 md:grid-cols-2">{[0, 1, 2, 3].map((i) => <div key={i} className="h-44 rounded-2xl bg-white dark:bg-zinc-900 animate-pulse" />)}</div>
            ) : reviewers.length === 0 ? (
              <div className={`${card} p-10 text-center`}>
                <p className="font-semibold text-gray-900 dark:text-white">No reviewers here yet.</p>
                <p className="text-sm text-gray-500 mt-1">Are you a label, curator, promoter or A&amp;R? Get paid to listen.</p>
                <button type="button" onClick={() => setTab("review")} className="mt-4 px-5 py-2.5 rounded-full font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700">Become a reviewer</button>
              </div>
            ) : (
              <ul className="grid gap-4 md:grid-cols-2">
                {reviewers.map((r) => (
                  <li key={r.id} className={`${card} p-5 flex flex-col`}>
                    <div className="flex items-start gap-3">
                      <Face name={r.name} avatar={r.avatar} />
                      <div className="min-w-0 flex-1">
                        {r.username ? <Link href={`/u/${r.username}`} className="font-bold text-gray-900 dark:text-white hover:underline">{r.name}</Link> : <p className="font-bold text-gray-900 dark:text-white">{r.name}</p>}
                        <p className="text-xs text-gray-500 capitalize">{[r.role, r.city].filter(Boolean).join(" · ")}</p>
                      </div>
                      {r.replyRate !== null && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold"><Star className="w-3 h-3" aria-hidden="true" /> {r.replyRate}% reply</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-3 flex-1">{r.headline}</p>
                    {r.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">{r.genres.map((g) => <span key={g} className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-xs font-semibold text-gray-600 dark:text-gray-300">{g}</span>)}</div>
                    )}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {r.acceptsDemos && (
                        <button type="button" onClick={() => setSendTo({ r, kind: "demo" })} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors">
                          <Music2 className="w-4 h-4" aria-hidden="true" /> Send demo · {gbp(SUBMISSION_PRICE.demo)}
                        </button>
                      )}
                      {r.acceptsMessages && (
                        <button type="button" onClick={() => setSendTo({ r, kind: "message" })} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold border border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                          <Mail className="w-4 h-4" aria-hidden="true" /> Priority message · {gbp(SUBMISSION_PRICE.message)}
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {(tab === "sent" || tab === "inbox") && <ItemList tab={tab} items={items} onReplied={() => loadTab("inbox", "")} />}
        {tab === "review" && <ReviewerSettings />}
      </div>

      {sendTo && <SendModal reviewer={sendTo.r} kind={sendTo.kind} onClose={() => setSendTo(null)} />}
    </div>
  );
}

function ItemList({ tab, items, onReplied }: { tab: "sent" | "inbox"; items: Item[] | null; onReplied: () => void }) {
  if (items === null) return <div className="h-40 rounded-2xl bg-white dark:bg-zinc-900 animate-pulse" />;
  if (!items.length) {
    return (
      <div className={`${card} p-10 text-center`}>
        <p className="font-semibold text-gray-900 dark:text-white">{tab === "sent" ? "You haven't sent anything yet." : "Nothing in your inbox yet."}</p>
        <p className="text-sm text-gray-500 mt-1">{tab === "sent" ? "Pick a reviewer and send your best track." : "Turn on reviews to start getting paid submissions."}</p>
      </div>
    );
  }
  const earned = tab === "inbox" ? items.filter((i) => i.status === "replied").reduce((s, i) => s + (i.reviewer_earn_pence ?? 0), 0) : 0;
  return (
    <div className="space-y-3">
      {tab === "inbox" && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          You&apos;ve earned <strong className="text-gray-900 dark:text-white">{gbp(earned)}</strong> from replies. It&apos;s in your <Link href="/seller" className="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">GRID balance</Link>.
        </p>
      )}
      <ul className="space-y-3">
        {items.map((it) => <ItemCard key={it.id} it={it} tab={tab} onReplied={onReplied} />)}
      </ul>
    </div>
  );
}

function ItemCard({ it, tab, onReplied }: { it: Item; tab: "sent" | "inbox"; onReplied: () => void }) {
  const [open, setOpen] = useState(false);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const who = tab === "inbox" ? it.sender?.name : it.reviewer?.name;

  async function send() {
    setBusy(true);
    setError("");
    const r = await fetch(`/api/submit/${it.id}/reply`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ verdict, reply }) });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) return setError(d.error || "Couldn't send your reply.");
    onReplied();
  }

  const statusPill =
    it.status === "replied" ? (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"><Check className="w-3 h-3" aria-hidden="true" /> Replied</span>
    ) : it.status === "refunded" ? (
      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300">Refunded</span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"><Clock className="w-3 h-3" aria-hidden="true" /> {daysLeft(it.due_at)} days left</span>
    );

  return (
    <li className={`${card} p-5`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{it.kind === "demo" ? "Demo" : "Priority message"} · {tab === "inbox" ? "from" : "to"} {who}</p>
          <p className="font-bold text-gray-900 dark:text-white">{it.title || it.message.slice(0, 80)}</p>
        </div>
        {statusPill}
      </div>
      {it.track_url && (
        <a href={it.track_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900">
          <Headphones className="w-4 h-4" aria-hidden="true" /> Listen <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      )}
      <p className="text-sm text-gray-700 dark:text-gray-300 mt-3 whitespace-pre-line">{it.message}</p>

      {it.status === "replied" && it.reply && (
        <div className="mt-4 rounded-xl bg-gray-50 dark:bg-zinc-800 p-4">
          {it.verdict && <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${VERDICT_STYLE[it.verdict]}`}>{VERDICTS.find((v) => v.id === it.verdict)?.label}</span>}
          <p className="text-sm text-gray-800 dark:text-gray-200 mt-2 whitespace-pre-line">{it.reply}</p>
        </div>
      )}

      {tab === "inbox" && it.status === "sent" && (
        open ? (
          <div className="mt-4 space-y-3">
            <fieldset className="flex flex-wrap gap-2">
              <legend className="sr-only">Verdict</legend>
              {VERDICTS.map((v) => (
                <label key={v.id} className={`cursor-pointer px-3.5 py-2 rounded-full text-sm font-semibold border has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-500 ${verdict === v.id ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300"}`} title={v.hint}>
                  <input type="radio" name={`verdict-${it.id}`} className="sr-only" checked={verdict === v.id} onChange={() => setVerdict(v.id)} />
                  {v.label}
                </label>
              ))}
            </fieldset>
            <label htmlFor={`reply-${it.id}`} className="sr-only">Your feedback</label>
            <textarea id={`reply-${it.id}`} value={reply} onChange={(e) => setReply(e.target.value)} rows={4} maxLength={2000} placeholder="Honest, useful feedback: what works, what to change, next steps." className={input} />
            {error && <p role="alert" className="text-sm text-red-700 dark:text-red-400">{error}</p>}
            <div className="flex gap-2">
              <button type="button" disabled={busy || !verdict || reply.trim().length < 20} onClick={send} className="px-5 py-2.5 rounded-full text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50">
                {busy ? "Sending…" : `Send reply & earn ${gbp(it.reviewer_earn_pence ?? 0)}`}
              </button>
              <button type="button" onClick={() => setOpen(false)} className="px-4 py-2.5 rounded-full text-sm font-bold text-gray-600 dark:text-gray-300">Cancel</button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setOpen(true)} className="mt-4 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700">
            Reply & earn {gbp(it.reviewer_earn_pence ?? 0)}
          </button>
        )
      )}
    </li>
  );
}

function SendModal({ reviewer, kind, onClose }: { reviewer: Reviewer; kind: SubmissionKind; onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [trackUrl, setTrackUrl] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const r = await fetch("/api/submit/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ reviewerId: reviewer.id, kind, title, trackUrl, message }) });
    const d = await r.json().catch(() => ({}));
    if (r.status === 401) return void (window.location.href = "/login?redirect=/submit");
    if (r.ok && d.url) return void (window.location.href = d.url);
    setError(d.error || "Couldn't start checkout.");
    setBusy(false);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="send-title" onKeyDown={(e) => e.key === "Escape" && onClose()}>
      <form onSubmit={pay} className="bg-white dark:bg-zinc-900 w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl p-6 max-h-[92vh] overflow-y-auto space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Face name={reviewer.name} avatar={reviewer.avatar} size="w-11 h-11" />
            <div>
              <h2 id="send-title" className="text-lg font-bold text-gray-900 dark:text-white">{kind === "demo" ? "Send a demo" : "Priority message"} to {reviewer.name}</h2>
              <p className="text-xs text-gray-500">Reply within {REPLY_DAYS} days or a full refund</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800"><X className="w-5 h-5" aria-hidden="true" /></button>
        </div>
        {kind === "demo" && (
          <>
            <div>
              <label htmlFor="s-title" className={lbl}>Track title *</label>
              <input id="s-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} className={input} placeholder="e.g. Night Drive (Original Mix)" />
            </div>
            <div>
              <label htmlFor="s-url" className={lbl}>Link to your track *</label>
              <input id="s-url" value={trackUrl} onChange={(e) => setTrackUrl(e.target.value)} inputMode="url" className={input} placeholder="https://soundcloud.com/… (private link is fine)" />
            </div>
          </>
        )}
        <div>
          <label htmlFor="s-msg" className={lbl}>{kind === "demo" ? "Short pitch *" : "Your message *"}</label>
          <textarea id="s-msg" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} maxLength={1000} className={input} placeholder={kind === "demo" ? "Who you are, the vibe, why it fits them." : "Get to the point: who you are and what you'd like."} />
          <p className="text-xs text-gray-500 mt-1">{1000 - message.length} characters left</p>
        </div>
        {error && <p role="alert" className="rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 p-3 text-sm">{error}</p>}
        <button type="submit" disabled={busy} className="w-full py-3.5 rounded-full font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 inline-flex items-center justify-center gap-2">
          <Send className="w-4 h-4" aria-hidden="true" /> {busy ? "Opening secure checkout…" : `Pay ${gbp(SUBMISSION_PRICE[kind])} & send`}
        </button>
        <p className="text-[11px] text-gray-500 text-center">Secure payment by Stripe. If they don&apos;t reply in {REPLY_DAYS} days, you&apos;re refunded automatically.</p>
      </form>
    </div>
  );
}

function ReviewerSettings() {
  const [loaded, setLoaded] = useState(false);
  const [exists, setExists] = useState(false);
  const [headline, setHeadline] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [demos, setDemos] = useState(true);
  const [messages, setMessages] = useState(true);
  const [active, setActive] = useState(true);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/submit/reviewer", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { reviewer: null }))
      .then((d) => {
        if (d.reviewer) {
          setExists(true);
          setHeadline(d.reviewer.headline);
          setGenres(d.reviewer.genres ?? []);
          setDemos(d.reviewer.accepts_demos);
          setMessages(d.reviewer.accepts_messages);
          setActive(d.reviewer.active);
        }
        setLoaded(true);
      });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setNote(null);
    const r = await fetch("/api/submit/reviewer", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ headline, genres, acceptsDemos: demos, acceptsMessages: messages, active }) });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) return setNote({ ok: false, text: d.error || "Couldn't save." });
    setExists(true);
    setNote({ ok: true, text: active ? "Saved. Artists can now send you paid demos and messages." : "Saved. You're paused and won't receive new submissions." });
  }

  if (!loaded) return <div className="h-60 rounded-2xl bg-white dark:bg-zinc-900 animate-pulse" />;
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <form onSubmit={save} className={`${card} p-5 sm:p-6 space-y-4`}>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{exists ? "Your reviewer profile" : "Get paid to listen"}</h2>
        <div>
          <label htmlFor="rv-head" className={lbl}>What are you looking for? *</label>
          <input id="rv-head" value={headline} onChange={(e) => setHeadline(e.target.value)} maxLength={120} className={input} placeholder="e.g. A&R at an indie house label, signing club tracks" />
        </div>
        <fieldset>
          <legend className={lbl}>Genres (up to 6)</legend>
          <div className="flex flex-wrap gap-2">
            {REVIEWER_GENRES.map((g) => {
              const on = genres.includes(g);
              return (
                <label key={g} className={`cursor-pointer px-3 py-1.5 rounded-full text-sm font-semibold border has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-500 ${on ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300"}`}>
                  <input type="checkbox" className="sr-only" checked={on} onChange={() => setGenres((x) => (on ? x.filter((y) => y !== g) : x.length < 6 ? [...x, g] : x))} />
                  {g}
                </label>
              );
            })}
          </div>
        </fieldset>
        <div className="space-y-2">
          {[
            [demos, setDemos, `Accept demos (you earn ${gbp(Math.floor(SUBMISSION_PRICE.demo * REVIEWER_SHARE))} per reply)`],
            [messages, setMessages, `Accept priority messages (you earn ${gbp(Math.floor(SUBMISSION_PRICE.message * REVIEWER_SHARE))} per reply)`],
            [active, setActive, "Open for submissions"],
          ].map(([v, set, t]) => (
            <label key={t as string} className="flex items-center gap-3 text-sm text-gray-800 dark:text-gray-200">
              <input type="checkbox" checked={v as boolean} onChange={(e) => (set as (b: boolean) => void)(e.target.checked)} className="w-5 h-5 accent-emerald-600" /> {t as string}
            </label>
          ))}
        </div>
        {note && <p role={note.ok ? "status" : "alert"} className={`rounded-lg p-3 text-sm ${note.ok ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-200" : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300"}`}>{note.text}</p>}
        <button type="submit" disabled={busy} className="px-6 py-3 rounded-full font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60">{busy ? "Saving…" : exists ? "Save" : "Start reviewing"}</button>
      </form>
      <aside className={`${card} p-5 h-fit`}>
        <p className="font-bold text-gray-900 dark:text-white">How it works</p>
        <ol className="mt-3 space-y-3 text-sm text-gray-600 dark:text-gray-400 list-decimal pl-5">
          <li>Artists pay to send you a demo or a message.</li>
          <li>Listen and reply within {REPLY_DAYS} days with a verdict and honest feedback.</li>
          <li>You earn {Math.round(REVIEWER_SHARE * 100)}% of every fee you answer, paid into your GRID balance.</li>
          <li>Unanswered ones are refunded to the artist automatically.</li>
        </ol>
      </aside>
    </div>
  );
}

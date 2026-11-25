"use client";

import { useEffect, useState } from "react";
import ShareMenu from "./ShareMenu";

type Invite = {
  code: string;
  path: string;
  joined: number;
  goal: number;
  recent: { name: string; username: string | null; avatar: string | null; joinedAt: string }[];
};

/** Personal invite link with copy/share and progress toward the referral reward. */
export default function InviteCard() {
  const [invite, setInvite] = useState<Invite | null>(null);
  const [failed, setFailed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/referrals/me", { credentials: "include", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: Invite) => setInvite(d))
      .catch(() => setFailed(true));
  }, []);

  const link = invite && typeof window !== "undefined" ? window.location.origin + invite.path : "";

  async function copy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  const pct = invite ? Math.min(100, Math.round((invite.joined / invite.goal) * 100)) : 0;
  const unlocked = !!invite && invite.joined >= invite.goal;

  return (
    <section aria-label="Invite friends" className="rounded-xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm text-neutral-900 dark:text-white">
      <h3 className="font-semibold">Grow your network</h3>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        Invite a vocalist, producer or venue. {invite ? `${invite.goal} friends who join = 1 free month of GRID Pro.` : ""}
      </p>

      {failed ? (
        <p className="mt-3 text-xs text-neutral-500">Invites aren&apos;t available right now.</p>
      ) : !invite ? (
        <div className="mt-3 h-9 rounded-lg bg-neutral-100 dark:bg-zinc-800 animate-pulse" aria-label="Loading your invite link" />
      ) : (
        <>
          <div className="mt-3 flex items-center gap-2">
            <code className="flex-1 min-w-0 truncate rounded-lg bg-neutral-100 dark:bg-zinc-800 px-2.5 py-2 text-xs text-neutral-700 dark:text-neutral-300" title={link}>
              {link.replace(/^https?:\/\//, "")}
            </code>
            <button
              type="button"
              onClick={copy}
              data-cta="invite-copy-link"
              className="shrink-0 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>

          <div className="mt-2">
            <ShareMenu url={link} text="Join me on GRID, the music industry network." label="Share invite" onShared={() => undefined} />
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold">{invite.joined} of {invite.goal} friends joined</span>
              {unlocked && <span className="font-semibold text-emerald-700 dark:text-emerald-400">Pro month unlocked 🎉</span>}
            </div>
            <div
              role="progressbar"
              aria-valuenow={Math.min(invite.joined, invite.goal)}
              aria-valuemin={0}
              aria-valuemax={invite.goal}
              aria-label="Friends joined"
              className="mt-1.5 h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-zinc-800"
            >
              <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: pct + "%" }} />
            </div>
          </div>

          {invite.recent.length > 0 && (
            <ul className="mt-3 flex -space-x-2" aria-label="Friends who joined">
              {invite.recent.map((p, i) => (
                <li key={i} title={p.name}>
                  {p.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.avatar} alt={p.name} className="h-7 w-7 rounded-full object-cover ring-2 ring-white dark:ring-zinc-900" />
                  ) : (
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-700 text-[10px] font-bold text-white ring-2 ring-white dark:ring-zinc-900">
                      {p.name.slice(0, 1).toUpperCase()}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}

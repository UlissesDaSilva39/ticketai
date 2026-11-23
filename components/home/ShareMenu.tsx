"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  url: string;
  text: string;
  label: string;
  /** Called once when the user actually shares (copies or picks a destination). */
  onShared: () => void;
};

// GRID's own share menu: the same on every device (Windows' share window is confusing).
export default function ShareMenu({ url, text, label, onShared }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  const enc = encodeURIComponent;
  const short = text.slice(0, 120);
  const targets = [
    { name: "WhatsApp", href: `https://wa.me/?text=${enc(`${short} ${url}`.trim())}` },
    { name: "X (Twitter)", href: `https://twitter.com/intent/tweet?text=${enc(short)}&url=${enc(url)}` },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { name: "Email", href: `mailto:?subject=${enc("Check this out on GRID")}&body=${enc(`${short}\n\n${url}`)}` },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Older browsers: fall back to a temporary text box.
      const t = document.createElement("textarea");
      t.value = url;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    onShared();
    setTimeout(() => {
      setCopied(false);
      setOpen(false);
    }, 1200);
  }

  async function nativeShare() {
    try {
      await navigator.share({ title: "Post on GRID", text: short, url });
      onShared();
      setOpen(false);
    } catch {
      /* cancelled */
    }
  }

  const item = "w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-zinc-800 rounded-md block";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex items-center gap-2 text-sm font-semibold transition-colors ${open ? "text-emerald-600" : "text-gray-600 dark:text-gray-400 hover:text-emerald-600"}`}
      >
        <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        {label}
      </button>

      {open && (
        <div role="menu" className="absolute bottom-full right-0 sm:left-0 sm:right-auto mb-2 w-52 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-1.5 shadow-xl z-20">
          <button type="button" role="menuitem" onClick={copy} className={item + " font-semibold"}>
            {copied ? "Link copied ✓" : "Copy link"}
          </button>
          <div className="my-1 h-px bg-gray-100 dark:bg-zinc-800" />
          {targets.map((t) => (
            <a
              key={t.name}
              role="menuitem"
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                onShared();
                setOpen(false);
              }}
              className={item}
            >
              {t.name}
            </a>
          ))}
          {canNativeShare && (
            <>
              <div className="my-1 h-px bg-gray-100 dark:bg-zinc-800" />
              <button type="button" role="menuitem" onClick={nativeShare} className={item}>
                More options…
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

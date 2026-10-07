"use client";

import { useState } from "react";

export default function ShareSheet({ url, title }: { url: string; title: string }) {
  const [open, setOpen] = useState(false);

  const enc = encodeURIComponent;
  const targets = [
    {
      label: "WhatsApp",
      href: "https://wa.me/?text=" + enc(title + " — " + url),
      bg: "#25D366",
    },
    {
      label: "X / Twitter",
      href: "https://twitter.com/intent/tweet?text=" + enc(title) + "&url=" + enc(url),
      bg: "#000000",
    },
    {
      label: "Telegram",
      href: "https://t.me/share/url?url=" + enc(url) + "&text=" + enc(title),
      bg: "#0088cc",
    },
    {
      label: "Email",
      href: "mailto:?subject=" + enc(title) + "&body=" + enc(url),
      bg: "#666666",
    },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {}
    setOpen(false);
  };

  const nativeShare = async () => {
    const nav = navigator as Navigator & { share?: (d: { title: string; url: string }) => Promise<void> };
    if (nav.share) {
      try {
        await nav.share({ title, url });
        return;
      } catch {}
    }
    setOpen(true);
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={nativeShare}
        className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-white text-white text-sm font-medium rounded-full hover:bg-white/10 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        Share
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-200">
            {targets.map((t) => (
              <a
                key={t.label}
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 text-black"
              >
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: t.bg }}
                >
                  {t.label.charAt(0)}
                </span>
                {t.label}
              </a>
            ))}
            <button
              onClick={copy}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 text-black border-t border-gray-100"
            >
              Copy link
            </button>
          </div>
        </>
      )}
    </div>
  );
}
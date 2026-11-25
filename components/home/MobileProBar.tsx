"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "grid_mobile_pro_bar_dismissed";

// Phones only (hidden from md up). Slim sticky trial prompt at the bottom of the screen.
export default function MobileProBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY) !== "1") setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 bg-neutral-900 px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-white md:hidden">
      <p className="flex-1 truncate text-xs font-medium">Try GRID Pro free for 30 days</p>
      <Link href="/pro" data-cta="mobile-pro-bar" className="shrink-0 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-neutral-900">
        Start free trial
      </Link>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => {
          setShow(false);
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {}
        }}
        className="px-1 text-lg leading-none opacity-70"
      >
        &times;
      </button>
    </div>
  );
}
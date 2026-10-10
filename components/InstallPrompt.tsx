"use client";

import { useEffect, useState } from "react";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallPrompt() {
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("GRID-install-dismissed") === "1") {
      setDismissed(true);
      return;
    }
    const handler = (e: Event) => {
      e.preventDefault();
      setEvt(e as BIPEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!evt || dismissed) return null;

  const install = async () => {
    await evt.prompt();
    const choice = await evt.userChoice;
    if (choice.outcome === "accepted") {
      setEvt(null);
    } else {
      setDismissed(true);
      localStorage.setItem("GRID-install-dismissed", "1");
    }
  };

  const close = () => {
    setDismissed(true);
    localStorage.setItem("GRID-install-dismissed", "1");
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 bg-black text-white rounded-2xl shadow-2xl p-4 z-50 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-[#00FF87] text-black flex items-center justify-center font-bold flex-shrink-0">
        T
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">Install GRID</p>
        <p className="text-xs text-white/70">Add to your home screen for quick access.</p>
      </div>
      <button
        onClick={install}
        className="px-3 py-2 bg-[#00FF87] text-black text-xs font-semibold rounded-full hover:bg-[#00e67a] flex-shrink-0"
      >
        Install
      </button>
      <button
        onClick={close}
        aria-label="Dismiss"
        className="text-white/50 hover:text-white text-lg leading-none flex-shrink-0"
      >
        Ã—
      </button>
    </div>
  );
}

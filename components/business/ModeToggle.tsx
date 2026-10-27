"use client";

import { useEffect, useState } from "react";

type Mode = "fan" | "business";
const STORAGE_KEY = "grid.business.mode";

export function ModeToggle() {
  const [mode, setMode] = useState<Mode>("business");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as Mode | null;
      if (saved === "fan" || saved === "business") setMode(saved);
    } catch {
      // ignore
    }
  }, []);

  function choose(next: Mode) {
    setMode(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }

  return (
    <div className="inline-flex rounded-full bg-neutral-100 p-1 text-sm">
      <button
        type="button"
        onClick={() => choose("fan")}
        className={
          "rounded-full px-3 py-1 transition " +
          (mode === "fan" ? "bg-white font-semibold shadow-sm" : "text-neutral-600")
        }
      >
        Fan view
      </button>
      <button
        type="button"
        onClick={() => choose("business")}
        className={
          "rounded-full px-3 py-1 transition " +
          (mode === "business" ? "bg-white font-semibold shadow-sm" : "text-neutral-600")
        }
      >
        Business view
      </button>
    </div>
  );
}
"use client";
import { useState } from "react";

export type Mode = "fan" | "business";

export function ModeToggle({
  initial = "fan",
  onChange,
}: {
  initial?: Mode;
  onChange?: (m: Mode) => void;
}) {
  const [mode, setMode] = useState<Mode>(initial);
  const set = (m: Mode) => {
    setMode(m);
    onChange?.(m);
  };
  return (
    <div className="flex rounded-full bg-white/10 p-1 text-sm">
      <button
        onClick={() => set("fan")}
        className={`rounded-full px-3 py-1 ${mode === "fan" ? "bg-white text-black" : "text-white/70"}`}
      >
        Fan view
      </button>
      <button
        onClick={() => set("business")}
        className={`rounded-full px-3 py-1 ${mode === "business" ? "bg-white text-black" : "text-white/70"}`}
      >
        Business view
      </button>
    </div>
  );
}

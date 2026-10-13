"use client";

import { useState } from "react";

type Tab = { key: string; label: string; content: React.ReactNode };

export default function ProfileTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.key || "");

  if (tabs.length === 0) return null;
  const current = tabs.find((t) => t.key === active) || tabs[0];

  return (
    <div>
      <div role="tablist" className="flex gap-2 border-b border-gray-200 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={current.key === t.key}
            onClick={() => setActive(t.key)}
            className={
              "px-4 py-3 text-sm font-medium -mb-px border-b-2 transition-colors " +
              (current.key === t.key
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-black")
            }
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">{current.content}</div>
    </div>
  );
}

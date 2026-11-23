"use client";

import { useState } from "react";
import Link from "next/link";

type Tab = {
  id: string;
  label: string;
  roles: string[];
  pitch: string;
  cta: { label: string; href: string };
};

const TABS: Tab[] = [
  {
    id: "artists",
    label: "For Artists",
    roles: ["Vocalists", "Producers", "Songwriters", "Guitarists", "Drummers", "DJs", "Bassists", "Composers"],
    pitch: "Build your EPK, get matched to collabs and gigs in your genre, and get paid through escrow.",
    cta: { label: "Join as an artist", href: "/signup?role=artist" },
  },
  {
    id: "industry",
    label: "For Industry",
    roles: ["Promoters", "Labels", "Managers", "A&R", "Booking agents", "Studios", "Mix engineers", "Sync agencies"],
    pitch: "Find and book verified talent, send offers, and manage contracts and payments in one place.",
    cta: { label: "Join as industry", href: "/signup?role=promoter" },
  },
  {
    id: "venues",
    label: "For Venues",
    roles: ["Clubs", "Bars", "Concert halls", "Festivals", "Rehearsal spaces", "Pop-ups"],
    pitch: "List your nights, fill open slots with matched artists, and sell tickets with no chasing.",
    cta: { label: "Join as a venue", href: "/signup?role=venue" },
  },
];

export default function RoleTabs() {
  const [active, setActive] = useState(TABS[0].id);
  const tab = TABS.find((t) => t.id === active) ?? TABS[0];

  return (
    <div>
      <div role="tablist" aria-label="Who GRID is for" className="flex flex-wrap justify-center gap-2 mb-8">
        {TABS.map((t) => {
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`panel-${t.id}`}
              onClick={() => setActive(t.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                selected
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`panel-${tab.id}`} aria-labelledby={`tab-${tab.id}`} className="text-center">
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-6">{tab.pitch}</p>
        <ul className="flex flex-wrap justify-center gap-2 mb-8">
          {tab.roles.map((r) => (
            <li
              key={r}
              className="px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-medium"
            >
              {r}
            </li>
          ))}
        </ul>
        <Link
          href={tab.cta.href}
          className="inline-block px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
        >
          {tab.cta.label}
        </Link>
      </div>
    </div>
  );
}

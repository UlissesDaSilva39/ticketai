"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

export default function FeedTabs() {
  const params = useSearchParams();
  const pathname = usePathname();
  const tab = params.get("tab") || "foryou";

  const tabs = [
    { key: "foryou", label: "For You", href: pathname },
    { key: "following", label: "Following", href: pathname + "?tab=following" },
  ];

  return (
    <div role="tablist" className="flex gap-2 border-b border-gray-200 dark:border-gray-800 mb-6">
      {tabs.map((t) => {
        const active = t.key === tab;
        return (
          <Link
            key={t.key}
            href={t.href}
            role="tab"
            aria-selected={active}
            className={
              "px-4 py-3 text-sm font-medium -mb-px border-b-2 transition-colors " +
              (active
                ? "border-black text-black dark:text-white"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white")
            }
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}


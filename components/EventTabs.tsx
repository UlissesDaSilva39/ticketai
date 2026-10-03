"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type Tab = { id: string; label: string };

export default function EventTabs({
  tabs,
  activeTab,
}: {
  tabs: Tab[];
  activeTab: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hrefFor = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", id);
    return pathname + "?" + params.toString();
  };

  return (
    <div className="border-b border-gray-200 mb-8 sticky top-16 bg-white z-40">
      <nav className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto">
        {tabs.map((t) => {
          const isActive = t.id === activeTab;
          return (
            <Link
              key={t.id}
              href={hrefFor(t.id)}
              scroll={false}
              className={
                "px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors " +
                (isActive
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-black")
              }
            >
              {t.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

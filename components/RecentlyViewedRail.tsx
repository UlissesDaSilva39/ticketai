"use client";

import Link from "next/link";
import { useRecentlyViewed, RecentlyViewedType } from "@/lib/hooks/useRecentlyViewed";

interface Props {
  title?: string;
  /** If provided, only show items whose type is in this list. Omit to show all. */
  filterTypes?: RecentlyViewedType[];
}

export default function RecentlyViewedRail({ title = "Recently Viewed", filterTypes }: Props) {
  const { items, clear, showRail } = useRecentlyViewed();

  const visible = filterTypes && filterTypes.length > 0
    ? items.filter((i) => filterTypes.includes(i.type))
    : items;

  // Empty state: render nothing at all (no empty box)
  if (!showRail || visible.length === 0) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {title}
        </h3>
        <button
          type="button"
          onClick={clear}
          className="text-xs font-semibold text-gray-500 hover:text-red-500 transition-colors"
        >
          Clear history
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {visible.map((item) => (
          <Link
            key={`${item.type}:${item.id}`}
            href={item.href}
            className="flex flex-col items-center flex-shrink-0 w-24 group cursor-pointer"
          >
            <div
              className={`w-16 h-16 rounded-full ${item.color} text-white flex items-center justify-center font-bold text-xl mb-2 ring-2 ring-transparent group-hover:ring-emerald-500 transition-all`}
            >
              {item.name[0]}
            </div>
            <p className="text-[11px] font-bold text-gray-900 dark:text-white text-center leading-tight truncate w-full">
              {item.name}
            </p>
            <p className="text-[9px] text-gray-500 text-center truncate w-full capitalize">
              {item.type}
            </p>
            <span className="text-[9px] font-semibold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">
              View again →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRecentSearches } from "@/lib/hooks/useRecentSearches";
import { highlightMatch } from "@/lib/utils/highlightMatch";
import { ARTISTS } from "@/lib/data/artists";

const SearchIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

interface Result {
  id: string;
  name: string;
  type: "artist" | "gig" | "product";
  href: string;
  subtitle?: string;
}

export default function SearchDropdown() {
  const router = useRouter();
  const { searches, add: addSearch, clear: clearSearches } = useRecentSearches();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const trimmed = query.trim().toLowerCase();

  const results: Result[] = trimmed.length < 1 ? [] : [
    ...ARTISTS.filter((a) => a.name.toLowerCase().includes(trimmed))
      .slice(0, 4)
      .map((a) => ({
        id: a.id,
        name: a.name,
        type: "artist" as const,
        href: "/artist/" + a.id,
        subtitle: a.role + " · " + a.genres[0],
      })),
  ];

  const items = trimmed.length < 1 ? [] : results;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (items[highlighted]) {
        addSearch(query);
        router.push(items[highlighted].href);
        setOpen(false);
        setQuery("");
      } else if (trimmed) {
        addSearch(query);
        router.push("/search?q=" + encodeURIComponent(query));
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
          <SearchIcon className="w-4 h-4" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setHighlighted(0); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search artists, gigs, genres..."
          className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800 border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-900 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none transition-colors"
        />
      </div>

      {open && (
        <div className="absolute top-full mt-1 w-full bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-lg z-50 overflow-hidden">
          {trimmed.length < 1 ? (
            <>
              {searches.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-zinc-800">
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Recent searches</p>
                    <button onClick={clearSearches} className="text-[10px] text-gray-500 hover:text-red-500">Clear</button>
                  </div>
                  {searches.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setQuery(s); setOpen(true); }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-xs text-gray-500">Try searching for "Sarah" or "House"</p>
                </div>
              )}
            </>
          ) : items.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-xs text-gray-500">No results for "{query}"</p>
              <p className="text-[10px] text-gray-400 mt-1">Try an artist, gig, or genre</p>
            </div>
          ) : (
            <>
              {items.map((r, i) => {
                const segments = highlightMatch(r.name, query);
                return (
                  <button
                    key={r.type + ":" + r.id}
                    onClick={() => { addSearch(query); router.push(r.href); setOpen(false); }}
                    onMouseEnter={() => setHighlighted(i)}
                    className={`w-full text-left px-3 py-2.5 transition-colors ${i === highlighted ? "bg-emerald-50 dark:bg-emerald-900/20" : "hover:bg-gray-50 dark:hover:bg-zinc-800"}`}
                  >
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {segments.map((seg, j) => seg.match ? (
                        <mark key={j} className="bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 rounded px-0.5">{seg.text}</mark>
                      ) : <span key={j}>{seg.text}</span>)}
                    </p>
                    {r.subtitle && <p className="text-xs text-gray-500">{r.subtitle}</p>}
                  </button>
                );
              })}
              <Link
                href={"/search?q=" + encodeURIComponent(query)}
                onClick={() => { addSearch(query); setOpen(false); }}
                className="block px-3 py-2 text-xs text-center font-semibold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border-t border-gray-100 dark:border-zinc-800 transition-colors"
              >
                See all results for "{query}" →
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
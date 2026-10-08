"use client";

import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "/artists",           label: "Browse all artists" },
  { href: "/artist/register",   label: "Register as an artist" },
];

export default function ArtistsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative hidden sm:inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-haspopup="true"
        aria-expanded={open}
        className="text-sm font-medium hover:opacity-70 inline-flex items-center gap-1"
      >
        Artists
        <span
          aria-hidden="true"
          className={"transition-transform text-[10px] " + (open ? "rotate-180" : "")}
        >
          ▼
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 min-w-[200px] bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50"
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              role="menuitem"
              className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

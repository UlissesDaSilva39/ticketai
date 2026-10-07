"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Props = {
  signedIn: boolean;
  unreadMessageCount: number;
};

const LINKS = [
  { href: "/feed",      label: "Feed",      signedInOnly: true },
  { href: "/following", label: "Following", signedInOnly: true },
  { href: "/messages",  label: "Messages",  signedInOnly: true },
  { href: "/friends",   label: "Friends",   signedInOnly: false },
  { href: "/people",    label: "People",    signedInOnly: false },
  { href: "/venues",    label: "Venues",    signedInOnly: false },
  { href: "/promoters", label: "Promoters", signedInOnly: false },
];

export default function SocialDropdown({ signedIn, unreadMessageCount }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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

  const visibleLinks = LINKS.filter((l) => !l.signedInOnly || signedIn);

  return (
    <div className="relative hidden sm:block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className="text-sm font-medium hover:opacity-70 inline-flex items-center gap-1"
      >
        Social
        <span
          className="text-[9px] opacity-60 transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        >
          &#9660;
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 min-w-[200px] bg-white border border-gray-200 rounded-xl shadow-lg p-1.5 z-50"
        >
          {visibleLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              role="menuitem"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
              style={{
                fontWeight: pathname === l.href ? 600 : 500,
                color: pathname === l.href ? "#000" : undefined,
              }}
            >
              <span>{l.label}</span>
              {l.href === "/messages" && unreadMessageCount > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                  {unreadMessageCount}
                </span>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

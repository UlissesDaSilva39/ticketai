"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string; icon: React.ReactNode; match?: string };

export default function MobileNav({ isSignedIn }: { isSignedIn: boolean }) {
  const pathname = usePathname();

  const items: Item[] = [
    {
      href: "/",
      label: "Discover",
      match: "home",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
    },
    {
      href: "/search",
      label: "Search",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h10" />
        </svg>
      ),
    },
    {
      href: "/friends",
      label: "Social",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="10" r="2.5" />
          <path d="M3 19c0-3 3-5 6-5s6 2 6 5" />
          <path d="M14 15c3 0 7 1 7 4" />
        </svg>
      ),
    },
    {
      href: "/messages",
      label: "Inbox",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 5h16v12H8l-4 4z" />
        </svg>
      ),
    },
    {
      href: isSignedIn ? "/notifications" : "/login",
      label: isSignedIn ? "Alerts" : "Sign in",
      icon: isSignedIn
        ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 8a6 6 0 0112 0c0 7 3 8 3 8H3s3-1 3-8" />
              <path d="M10 21a2 2 0 004 0" />
            </svg>
          )
        : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
            </svg>
          ),
    },
  ];

  const isActive = (item: Item) => {
    if (item.href === "/") return pathname === "/";
    return pathname?.startsWith(item.href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-14">
        {items.map((it) => {
          const active = isActive(it);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={
                "flex flex-col items-center justify-center flex-1 h-full text-[10px] font-medium " +
                (active ? "text-black" : "text-gray-500")
              }
            >
              <span className={active ? "text-black" : "text-gray-500"}>{it.icon}</span>
              <span className="mt-0.5">{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

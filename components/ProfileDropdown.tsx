"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Props = {
  username: string | null;
  email: string | null;
  role: string | null;
  pendingRequestCount: number;
};

export default function ProfileDropdown({
  username,
  email,
  role,
  pendingRequestCount,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isAdmin = role === "admin";
  const isPromoter = role === "promoter" || isAdmin;
  const isVenue = role === "venue" || isAdmin;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center gap-2 text-sm font-medium hover:opacity-70"
      >
        <span className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
          {(username || email?.split("@")[0] || "U").charAt(0).toUpperCase()}
        </span>
        <span className="hidden sm:inline">Profile</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
        {pendingRequestCount > 0 && (
          <span className="absolute top-0 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Signed in as</p>
            <p className="text-sm font-medium truncate">@{username || "you"}</p>
          </div>

          <div className="py-2">
            {username && (
              <Link
                href={"/u/" + username}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm hover:bg-gray-50"
              >
                My Profile
              </Link>
            )}
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50"
            >
              <span>Notifications</span>
              {pendingRequestCount > 0 && (
                <span className="ml-2 min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {pendingRequestCount}
                </span>
              )}
            </Link>
            <Link
              href="/friends"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm hover:bg-gray-50"
            >
              Friends
            </Link>
          </div>

          {(isPromoter || isVenue || isAdmin) && (
            <div className="py-2 border-t border-gray-100">
              <p className="px-4 py-1 text-xs uppercase tracking-wide text-gray-400">For Business</p>
              {isPromoter && (
                <>
                  <Link href="/organizer" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">
                    Dashboard
                  </Link>
                  <Link href="/organizer/analytics" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">
                    Analytics
                  </Link>
                  <Link href="/promoter/dashboard" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">
                    Promoter Dashboard
                  </Link>
                  <Link href="/organizer/campaigns" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">
                    AI Campaign Builder
                  </Link>
                </>
              )}
              {isVenue && (
                <Link href="/venue/dashboard" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">
                  Venue Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link href="/admin" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">
                  Admin
                </Link>
              )}
            </div>
          )}

          <div className="py-2 border-t border-gray-100">
            <Link
              href="/organizer/profile"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm hover:bg-gray-50"
            >
              Settings
            </Link>
          </div>

          <div className="py-2 border-t border-gray-100">
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
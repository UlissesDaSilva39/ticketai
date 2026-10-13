"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

export function NotificationBell({ count = 0 }: { count?: number }) {
  return (
    <Link
      href="/notifications"
      aria-label={count > 0 ? count + " unread notifications" : "Notifications"}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition"
    >
      <Bell size={20} aria-hidden="true" />
      {count > 0 ? (
        <span
          className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center"
          aria-hidden="true"
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}

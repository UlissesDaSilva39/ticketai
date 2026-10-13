"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";

export default function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchCount() {
      try {
        const res = await fetch("/api/notifications/unread-count", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) setCount(Number(data.count) || 0);
      } catch {
        /* ignore */
      }
    }

    fetchCount();
    const id = setInterval(fetchCount, 30_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

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

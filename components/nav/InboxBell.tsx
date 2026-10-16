'use client';

import Link from 'next/link';

type InboxBellProps = {
  unreadCount?: number;
};

export function InboxBell({ unreadCount = 0 }: InboxBellProps) {
  const label = unreadCount > 0
    ? 'Inbox, ' + unreadCount + ' unread'
    : 'Inbox';

  return (
    <Link
      href="/messages"
      aria-label={label}
      className="relative inline-flex items-center justify-center rounded-full p-2 hover:bg-white/10 transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M4 6h16v12H4z" />
        <path d="m4 6 8 6 8-6" />
      </svg>

      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
}
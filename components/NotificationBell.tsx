"use client";

export default function NotificationBell({ count = 0 }: { count?: number }) {
  return (
    <button
      type="button"
      aria-label={"Notifications (" + count + ")"}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
    >
      <span aria-hidden="true" className="text-lg">🔔</span>
      {count > 0 ? (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </button>
  );
}

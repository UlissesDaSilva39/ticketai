import { Bell } from 'lucide-react';

export function NotificationBell({ count }: { count: number }) {
  return (
    <a
      href="/notifications"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5 text-gray-700" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[20px] place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </a>
  );
}

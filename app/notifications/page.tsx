"use client";
import { usePathname } from "next/navigation";

export default function NotificationsPage() {
  const items = [
    { icon:"🎧", text:"Sarah Jenkins and 14 others played your latest track", time:"2h ago" },
    { icon:"🎵", text:"Beatport News: New royalty payout model announced for 2027", time:"5h ago" },
    { icon:"🔥", text:"David Chen hyped your track: 'This is exactly the vibe I needed'", time:"1d ago" },
    { icon:"🎟", text:"GRID Events: 'London Producer Meetup' is happening Nov 14", time:"2d ago" },
  ];
  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen">
      <div className="mx-auto max-w-[1128px] px-4 py-6 grid grid-cols-12 gap-6">

        {/* LEFT: profile sidebar */}
        <aside className="col-span-12 lg:col-span-3 space-y-3">
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="h-16 bg-gradient-to-r from-emerald-600 to-emerald-500" />
            <div className="p-4 -mt-8">
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white grid place-items-center font-bold text-xl ring-4 ring-white dark:ring-zinc-900">U</div>
              <p className="font-semibold text-gray-900 dark:text-white mt-2">Ulisses Bezerra Da Silva</p>
              <p className="text-xs text-gray-500 mt-0.5">Founder - CEO @ TicketAI</p>
              <p className="text-xs text-gray-500 mt-1">London, England</p>
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-emerald-600 text-white grid place-items-center text-xs font-bold">T</div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">TicketAI</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Manage notifications</p>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2 cursor-pointer hover:text-emerald-700"><span>🔔</span> All notifications</li>
              <li className="flex items-center gap-2 cursor-pointer hover:text-emerald-700"><span>📝</span> My posts</li>
              <li className="flex items-center gap-2 cursor-pointer hover:text-emerald-700"><span>💬</span> Mentions</li>
              <li className="flex items-center gap-2 cursor-pointer hover:text-emerald-700"><span>⚙️</span> Notification settings</li>
            </ul>
          </div>

          <div className="px-4 text-xs text-center text-gray-500 space-y-1">
            <p className="flex flex-wrap justify-center gap-x-2 gap-y-1">
              <a href="#" className="hover:underline">About</a>
              <a href="#" className="hover:underline">Accessibility</a>
              <a href="#" className="hover:underline">Help Center</a>
            </p>
            <p className="flex flex-wrap justify-center gap-x-2 gap-y-1">
              <a href="#" className="hover:underline">Privacy &amp; Terms ⌄</a>
              <a href="#" className="hover:underline">Ad Choices</a>
              <a href="#" className="hover:underline">Advertising</a>
            </p>
            <p className="flex flex-wrap justify-center gap-x-2 gap-y-1">
              <a href="#" className="hover:underline">Business Services ⌄</a>
              <a href="#" className="hover:underline">Get the GRID app</a>
              <a href="#" className="hover:underline">More</a>
            </p>
            <p className="mt-3 font-semibold text-emerald-700 dark:text-emerald-500">GRID Corporation © 2026</p>
          </div>
        </aside>

        {/* CENTER: music activity */}
        <main className="col-span-12 lg:col-span-9 space-y-3">
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <h1 className="font-semibold text-gray-900 dark:text-white">Your music activity</h1>
            <p className="text-xs text-gray-500 mt-1">Plays, hypes, collab requests, bookings, royalty updates.</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 divide-y divide-gray-100 dark:divide-zinc-800 shadow-sm">
            {items.map((n, i) => (
              <div key={i} className="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 grid place-items-center text-lg">{n.icon}</div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">{n.text}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
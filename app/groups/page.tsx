"use client";
import Link from "next/link";
import { PlayIcon, MarketIcon, BookmarkIcon, UsersIcon, CalendarSVG } from "@/components/MusicIcons";

export default function GroupsPage() {
  const groups = [
    { name: "London Producers", members: "12.4K", type: "Public Group", color: "bg-emerald-600" },
    { name: "Tech House Artists", members: "8.2K", type: "Private Group", color: "bg-purple-600" },
    { name: "Vocalists Wanted", members: "25.1K", type: "Public Group", color: "bg-pink-600" },
  ];

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen">
      <div className="mx-auto max-w-[1280px] px-4 py-6 grid grid-cols-12 gap-6">
        <aside className="col-span-12 lg:col-span-3 space-y-3 hidden lg:block">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-emerald-600 to-emerald-500" />
            <div className="p-5 -mt-10 text-center relative">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-800 text-white grid place-items-center font-bold text-2xl ring-4 ring-white dark:ring-zinc-900 mb-3">U</div>
              <p className="font-bold text-gray-900 dark:text-white text-lg">Ulisses Silva</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Music Producer &amp; DJ</p>
            </div>
            <div className="border-t border-gray-100 dark:border-zinc-800 p-4">
              <ul className="space-y-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <li><Link href="/marketplace" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><MarketIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Marketplace</span></Link></li>
                <li><Link href="/saved" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><BookmarkIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Saved Items</span></Link></li>
                <li><Link href="/groups" className="flex items-center gap-3 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 transition-colors"><UsersIcon className="w-5 h-5 text-emerald-600" /> <span>Groups</span></Link></li>
                <li><Link href="/events" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><CalendarSVG className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Events</span></Link></li>
              </ul>
            </div>
          </div>
        </aside>

        <main className="col-span-12 lg:col-span-9 space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm flex justify-between items-center">
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white text-2xl flex items-center gap-2"><UsersIcon className="w-6 h-6 text-emerald-600" /> Groups</h1>
              <p className="text-sm text-gray-500 mt-1">Join communities of producers, vocalists, and industry pros.</p>
            </div>
            <button className="bg-emerald-600 text-white text-sm font-bold px-5 py-2.5 rounded-lg">+ Create Group</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((g, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm hover:border-emerald-400 transition-colors cursor-pointer">
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-12 h-12 rounded-lg ${g.color} text-white flex items-center justify-center font-bold text-xl`}>{g.name[0]}</div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{g.name}</h3>
                    <p className="text-xs text-gray-500">{g.type} · {g.members} Members</p>
                  </div>
                </div>
                <button className="w-full border border-emerald-600 text-emerald-600 hover:bg-emerald-50 text-sm font-bold py-1.5 rounded-lg transition-colors mt-2">Join Group</button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
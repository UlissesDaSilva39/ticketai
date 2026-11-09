"use client";
import { useState } from "react";
import Link from "next/link";
import { PlayIcon, MarketIcon, BookmarkIcon, UsersIcon, CalendarSVG } from "@/components/MusicIcons";

const ChevronLeft = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
);
const ChevronRight = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
);

export default function Page() {
  const [isPlaying, setIsPlaying] = useState(false);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const events = {
    5: { type: "confirmed", title: "House Night w/ Sarah J." },
    12: { type: "pending", title: "Offer sent to David Chen" },
    15: { type: "confirmed", title: "Techno Takeover" },
    22: { type: "open", title: "Available for Booking" },
    28: { type: "confirmed", title: "Midnight Collective Live" },
  };

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen">
      <div className="mx-auto max-w-[1280px] px-4 py-6 grid grid-cols-12 gap-6">

        <aside className="col-span-12 lg:col-span-3 space-y-3 hidden lg:block">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-zinc-800 dark:to-black" />
            <div className="p-5 -mt-10 text-center relative">
              <div className="w-20 h-20 mx-auto rounded-full bg-gray-900 dark:bg-black border-2 border-emerald-500 text-emerald-500 grid place-items-center font-bold text-2xl ring-4 ring-white dark:ring-zinc-900 mb-3">
                <MarketIcon className="w-8 h-8" />
              </div>
              <p className="font-bold text-gray-900 dark:text-white text-lg">The O2 Academy</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Venue & Promoter</p>
              <p className="text-xs text-gray-500 mt-1">London, UK</p>
            </div>
            <div className="border-t border-gray-100 dark:border-zinc-800 p-4">
              <ul className="space-y-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <li><Link href="/business" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><UsersIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Artist Roster</span></Link></li>
                <li><Link href="/calendar" className="flex items-center gap-3 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 transition-colors"><CalendarSVG className="w-5 h-5 text-emerald-600" /> <span>Venue Calendar</span></Link></li>
                <li><Link href="/saved" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><BookmarkIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Saved Artists</span></Link></li>
              </ul>
            </div>
          </div>
        </aside>

        <main className="col-span-12 lg:col-span-9 space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white text-2xl flex items-center gap-2">
                <CalendarSVG className="w-6 h-6 text-emerald-600" /> Venue Calendar
              </h1>
              <p className="text-sm text-gray-500 mt-1">Manage your bookings, holds, and availability.</p>
            </div>
            <div className="flex gap-3">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors shadow-sm">
                + Add Event
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">November 2026</h2>
                <div className="flex border border-gray-200 dark:border-zinc-700 rounded-md overflow-hidden">
                  <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-400"><ChevronLeft /></button>
                  <button className="p-1.5 border-l border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-400"><ChevronRight /></button>
                </div>
              </div>
              
              <div className="flex gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Confirmed</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Pending (Escrow)</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-zinc-600"></div> Open</div>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden">
              {daysOfWeek.map(day => (
                <div key={day} className="bg-gray-50 dark:bg-zinc-900/50 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">{day}</div>
              ))}
              {[...Array(6)].map((_, i) => (
                <div key={`empty-${i}`} className="bg-gray-50/30 dark:bg-zinc-900/20 min-h-[100px]"></div>
              ))}
              {[...Array(30)].map((_, i) => {
                const day = i + 1;
                const event = events[day as keyof typeof events];
                return (
                  <div key={day} className="bg-white dark:bg-zinc-900 min-h-[100px] p-2 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group flex flex-col">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{day}</span>
                    {event && (
                      <div className={`mt-auto text-[10px] font-bold px-2 py-1.5 rounded-md leading-tight truncate border
                        ${event.type === 'confirmed' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' : 
                          event.type === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400' : 
                          'bg-gray-100 border-gray-200 text-gray-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-400'}`}>
                        {event.title}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden mt-4">
            <div className="p-5 border-b border-gray-100 dark:border-zinc-800">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">Upcoming This Month</h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
              {Object.entries(events).map(([day, data]) => (
                <div key={day} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-zinc-800 rounded-lg flex flex-col items-center justify-center border border-gray-200 dark:border-zinc-700">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Nov</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white leading-none">{day}</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{data.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Main Stage · 10:00 PM - 3:00 AM</p>
                    </div>
                  </div>
                  {data.type === 'pending' ? (
                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">Awaiting Signature</span>
                  ) : data.type === 'confirmed' ? (
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold py-1 px-2 rounded-full">Confirmed</span>
                  ) : (
                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">Open Slot</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
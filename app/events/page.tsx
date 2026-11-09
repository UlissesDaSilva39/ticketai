"use client";
import { useState } from "react";
import Link from "next/link";
import { PlayIcon, MarketIcon, BookmarkIcon, UsersIcon, CalendarSVG, MicIcon, TicketIcon, NoteIcon } from "@/components/MusicIcons";

export default function Page() {
  const [isPlaying, setIsPlaying] = useState(false);

  const events = [
    {
      id: 1,
      title: "London Producer Meetup",
      date: "Nov 14, 2026",
      time: "7:00 PM",
      location: "The O2 Academy, London",
      type: "In-Person",
      host: "GRID Official",
      price: "Free",
      color: "bg-emerald-800",
      icon: <UsersIcon className="w-8 h-8 text-emerald-400" />
    },
    {
      id: 2,
      title: "Sarah J. Live: Midnight Sessions",
      date: "Nov 22, 2026",
      time: "9:00 PM",
      location: "Virtual Stream (GRID Live)",
      type: "Virtual",
      host: "Sarah J.",
      price: "£5.00",
      color: "bg-purple-800",
      icon: <MicIcon className="w-8 h-8 text-purple-400" />
    },
    {
      id: 3,
      title: "Tech House Masterclass",
      date: "Dec 5, 2026",
      time: "2:00 PM",
      location: "Berlin Studio X",
      type: "Workshop",
      host: "Studio X",
      price: "£45.00",
      color: "bg-blue-800",
      icon: <NoteIcon className="w-8 h-8 text-blue-400" />
    },
    {
      id: 4,
      title: "GRID Showcase: New Year's Eve",
      date: "Dec 31, 2026",
      time: "10:00 PM",
      location: "Secret Location, LA",
      type: "In-Person",
      host: "GRID Official",
      price: "£25.00",
      color: "bg-amber-800",
      icon: <PlayIcon className="w-8 h-8 text-amber-400" />
    }
  ];

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen">
      <div className="mx-auto max-w-[1280px] px-4 py-6 grid grid-cols-12 gap-6">

        {/* LEFT COLUMN: Sidebar */}
        <aside className="col-span-12 lg:col-span-3 space-y-3 hidden lg:block">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-emerald-600 to-emerald-500" />
            <div className="p-5 -mt-10 text-center relative">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-800 text-white grid place-items-center font-bold text-2xl ring-4 ring-white dark:ring-zinc-900 mb-3">U</div>
              <p className="font-bold text-gray-900 dark:text-white text-lg">Ulisses Silva</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Music Producer &amp; DJ</p>
              <p className="text-xs text-gray-500 mt-1">London, UK</p>
              <div className="mt-5 space-y-2">
                <button onClick={() => setIsPlaying(!isPlaying)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 rounded-full transition-colors flex items-center justify-center gap-2">
                  <PlayIcon className="w-3.5 h-3.5" /> {isPlaying ? "Pause Track" : "Play Latest Track"}
                </button>
                <button className="w-full border-2 border-emerald-600 text-emerald-700 dark:text-emerald-400 text-sm font-bold py-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">View EPK</button>
              </div>
            </div>
            <div className="border-t border-gray-100 dark:border-zinc-800 p-4">
              <ul className="space-y-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <li><Link href="/marketplace" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><MarketIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Marketplace</span></Link></li>
                <li><Link href="/saved" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><BookmarkIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Saved Items</span></Link></li>
                <li><Link href="/groups" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><UsersIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Groups</span></Link></li>
                <li><Link href="/events" className="flex items-center gap-3 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 transition-colors"><CalendarSVG className="w-5 h-5 text-emerald-600" /> <span>Events</span></Link></li>
              </ul>
            </div>
          </div>
        </aside>

        {/* MAIN COLUMN: Events Feed */}
        <main className="col-span-12 lg:col-span-9 space-y-4">
          
          {/* Header */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white text-2xl flex items-center gap-2">
                <CalendarSVG className="w-6 h-6 text-emerald-600" /> Upcoming Events
              </h1>
              <p className="text-sm text-gray-500 mt-1">Discover gigs, meetups, and virtual streams happening in your network.</p>
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors shadow-sm">
              + Create Event
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["All Events", "In-Person", "Virtual", "Workshops"].map((tab, i) => (
              <button key={tab} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${i === 0 ? "bg-emerald-600 text-white" : "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"}`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Events List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((e) => (
              <div key={e.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden group hover:border-emerald-500 transition-colors cursor-pointer flex flex-col">
                
                {/* Event Banner Image Placeholder */}
                <div className={`h-40 ${e.color} flex items-center justify-center relative`}>
                  <div className="w-16 h-16 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                    {e.icon}
                  </div>
                  <span className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 text-gray-900 dark:text-white text-xs font-bold px-2 py-1 rounded-md">
                    {e.type}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-1">{e.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">Hosted by {e.host}</p>
                  
                  <div className="flex flex-col gap-2 mb-4 mt-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                      <CalendarSVG className="w-4 h-4 text-emerald-600" /> {e.date} · {e.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {e.location}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                    <span className="font-bold text-emerald-600 text-lg">{e.price}</span>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                      Get Tickets
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
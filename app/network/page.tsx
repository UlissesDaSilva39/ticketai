"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlayIcon, MicIcon, SlidersIcon, CalendarSVG, MarketIcon, BookmarkIcon, UsersIcon } from "@/components/MusicIcons";

const VerifiedIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
);

export default function Page() {
  const [isPlaying, setIsPlaying] = useState(false);

  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Discover");

  const creators = [
    { name: "Sarah Jenkins", role: "Vocalist", location: "London", color: "bg-pink-500", verified: true, connect: false },
    { name: "David Chen", role: "DJ / Producer", location: "Berlin", color: "bg-indigo-500", verified: true, connect: false },
    { name: "The Midnight Collective", role: "Indie Band", location: "Manchester", color: "bg-amber-500", verified: false, connect: false },
    { name: "Alex Rivera", role: "Techno Producer", location: "Madrid", color: "bg-emerald-500", verified: true, connect: false },
  ];

  const [connections, setConnections] = useState<{[key: string]: boolean}>({});

  const handleConnect = (name: string) => {
    setConnections(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen">
      <div className="mx-auto max-w-[1280px] px-4 py-6 grid grid-cols-12 gap-6">

        {/* LEFT COLUMN: Profile & Sidebar */}
        <aside className="col-span-12 lg:col-span-3 space-y-3">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-emerald-600 to-emerald-500" />
            <div className="p-5 -mt-10 text-center relative">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-800 text-white grid place-items-center font-bold text-2xl ring-4 ring-white dark:ring-zinc-900 mb-3">U</div>
              <p className="font-bold text-gray-900 dark:text-white text-lg">Ulisses Silva</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Music Producer &amp; DJ</p>
              <p className="text-xs text-gray-500 mt-1">London, UK</p>
              <div className="grid grid-cols-2 gap-2 mt-6 pt-5 border-t border-gray-100 dark:border-zinc-800 text-center">
                <div><p className="font-bold text-gray-900 dark:text-white text-base">124</p><p className="text-[11px] text-gray-500 uppercase tracking-wide">Connections</p></div>
                <div><p className="font-bold text-gray-900 dark:text-white text-base">2.4K</p><p className="text-[11px] text-gray-500 uppercase tracking-wide">Followers</p></div>
              </div>
            </div>
            <div className="border-t border-gray-100 dark:border-zinc-800 p-4">
              <ul className="space-y-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <li><Link href="/marketplace" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><MarketIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Marketplace</span></Link></li>
                <li><Link href="/saved" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><BookmarkIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Saved Items</span></Link></li>
                <li><Link href="/groups" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><UsersIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Groups</span></Link></li>
                <li><Link href="/events" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><CalendarSVG className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Events</span></Link></li>
              </ul>
            </div>
          </div>
        </aside>

        {/* MAIN COLUMN: Discovery Hub */}
        <main className="col-span-12 lg:col-span-9 space-y-4">
          
          {/* Header */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
            <h1 className="font-bold text-gray-900 dark:text-white text-2xl">Discover GRID</h1>
            <p className="text-sm text-gray-500 mt-1">Find new collaborators, gigs, and communities.</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {["Discover", "People", "Groups", "Gigs"].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeTab === tab 
                    ? "bg-emerald-600 text-white" 
                    : "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Creator Grid */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">Suggested Creators</h2>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">4 new matches</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {creators.map((c, i) => (
                <div key={i} className="border border-gray-100 dark:border-zinc-800 rounded-xl p-4 text-center hover:border-emerald-400 transition-colors">
                  <div className={`w-16 h-16 rounded-full ${c.color} text-white flex items-center justify-center font-bold text-2xl mx-auto mb-3`}>
                    {c.name[0]}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center justify-center gap-1">
                    {c.name}
                    {c.verified && <VerifiedIcon />}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{c.role} · {c.location}</p>
                  <button 
                    onClick={() => handleConnect(c.name)}
                    className={`w-full mt-3 text-xs font-bold py-1.5 rounded-full transition-colors ${
                      connections[c.name] 
                        ? "bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-gray-300" 
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    {connections[c.name] ? "Connected" : "Connect"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Gigs */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-4">Trending Collabs</h2>
            <div className="space-y-3">
              <div onClick={() => router.push('/jobs')} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600"><MicIcon className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">Vocalist needed for House track</p>
                    <p className="text-xs text-gray-500">Posted by Sarah J. · Royalty Split</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-emerald-600 hover:underline">View</button>
              </div>
              <div onClick={() => router.push('/jobs')} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600"><SlidersIcon className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">Mixing &amp; Mastering Engineer</p>
                    <p className="text-xs text-gray-500">Posted by Studio X · £400/track</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-emerald-600 hover:underline">View</button>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
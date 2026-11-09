"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PlayIcon, MarketIcon, BookmarkIcon, UsersIcon, CalendarSVG, MicIcon, NoteIcon } from "@/components/MusicIcons";

const SearchIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
);

// Mock Data
const allPeople = [
  { name: "Sarah Jenkins", role: "Vocalist · House", location: "London", color: "bg-pink-500", verified: true },
  { name: "David Chen", role: "DJ / Producer", location: "Berlin", color: "bg-indigo-500", verified: true },
  { name: "The Midnight Collective", role: "Indie Band", location: "Manchester", color: "bg-amber-500", verified: false },
  { name: "Alex Rivera", role: "Techno Producer", location: "Madrid", color: "bg-emerald-500", verified: true },
];

const allTracks = [
  { title: "Midnight City (Original Mix)", artist: "Ulisses Silva", plays: "45.2K" },
  { title: "Neon Lights", artist: "David Chen", plays: "12.8K" },
  { title: "Warehouse Techno", artist: "Alex Rivera", plays: "8.4K" },
];

const allGigs = [
  { title: "Vocalist needed for House track", poster: "Sarah J.", pay: "Royalty Split" },
  { title: "Techno DJ for Berlin Club", poster: "Club Matrix", pay: "£500" },
];

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [activeTab, setActiveTab] = useState("Top Results");

  // Filter logic
  const filteredPeople = allPeople.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.role.toLowerCase().includes(query.toLowerCase())
  );
  
  const filteredTracks = allTracks.filter(t => 
    t.title.toLowerCase().includes(query.toLowerCase()) || 
    t.artist.toLowerCase().includes(query.toLowerCase())
  );

  const filteredGigs = allGigs.filter(g => 
    g.title.toLowerCase().includes(query.toLowerCase())
  );

  const totalResults = filteredPeople.length + filteredTracks.length + filteredGigs.length;

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
              <p className="text-xs text-gray-500 mt-1">London, UK</p>
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

        <main className="col-span-12 lg:col-span-9 space-y-4">
          
          {/* Header */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
            <h1 className="font-bold text-gray-900 dark:text-white text-2xl flex items-center gap-2">
              <SearchIcon className="w-6 h-6 text-emerald-600" /> Search Results for "{query}"
            </h1>
            <p className="text-sm text-gray-500 mt-1">Found {totalResults} results matching your search.</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["Top Results", "People", "Tracks", "Gigs"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab 
                    ? "bg-emerald-600 text-white" 
                    : "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Results - People */}
          {filteredPeople.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-zinc-800">
                <h2 className="font-bold text-gray-900 dark:text-white text-lg">People</h2>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                {filteredPeople.map((p, i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full ${p.color} text-white flex items-center justify-center font-bold text-lg`}>{p.name[0]}</div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5">
                          {p.name}
                          {p.verified && <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>}
                        </p>
                        <p className="text-xs text-gray-500">{p.role} · {p.location}</p>
                      </div>
                    </div>
                    <Link href="/epk" className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 text-xs font-bold px-4 py-1.5 rounded-full transition-colors">View EPK</Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results - Tracks */}
          {filteredTracks.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-zinc-800">
                <h2 className="font-bold text-gray-900 dark:text-white text-lg">Tracks</h2>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                {filteredTracks.map((t, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-md bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 flex-shrink-0"><NoteIcon /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{t.title}</p>
                      <p className="text-xs text-gray-500 truncate">{t.artist} · {t.plays} plays</p>
                    </div>
                    <div className="text-gray-400 group-hover:text-emerald-600 transition-colors"><PlayIcon className="w-5 h-5" /></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results - Gigs */}
          {filteredGigs.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-zinc-800">
                <h2 className="font-bold text-gray-900 dark:text-white text-lg">Gigs &amp; Collabs</h2>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                {filteredGigs.map((g, i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600"><MicIcon className="w-5 h-5" /></div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{g.title}</p>
                        <p className="text-xs text-gray-500">Posted by {g.poster} · {g.pay}</p>
                      </div>
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors">Quick Pitch</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {totalResults === 0 && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-12 text-center shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No results found</h2>
              <p className="text-gray-500">We couldn't find anything for "{query}". Try searching for "Sarah", "Techno", or "Vocalist".</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading search...</div>}>
      <SearchResults />
    </Suspense>
  );
}
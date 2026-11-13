"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlayIcon, MicIcon, SlidersIcon, CalendarSVG, MarketIcon, BookmarkIcon, UsersIcon } from "@/components/MusicIcons";
import RecentlyViewedRail from "@/components/RecentlyViewedRail";

const VerifiedIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
  </svg>
);
const FilterIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
);

export default function NetworkPage() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("Discover");
  
  const [connections, setConnections] = useState<{[key: string]: boolean}>({});

  // Filter state
  const [filterRole, setFilterRole] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [filterCity, setFilterCity] = useState("");

  const creators = [
    { id: "sarah", name: "Sarah Jenkins", role: "Vocalist", genre: "House", location: "London", color: "bg-pink-500", verified: true },
    { id: "david", name: "David Chen", role: "DJ / Producer", genre: "Techno", location: "Berlin", color: "bg-indigo-500", verified: true },
    { id: "midnight", name: "The Midnight Collective", role: "Indie Band", genre: "Indie", location: "Manchester", color: "bg-amber-500", verified: false },
    { id: "alex", name: "Alex Rivera", role: "Techno Producer", genre: "Techno", location: "Madrid", color: "bg-emerald-500", verified: true },
    { id: "luna", name: "Luna Park", role: "Vocalist", genre: "R&B", location: "London", color: "bg-rose-500", verified: true },
    { id: "marcus", name: "Marcus Stone", role: "Songwriter", genre: "Pop", location: "New York", color: "bg-cyan-500", verified: true },
  ];

  const handleConnect = (id: string) => {
    setConnections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter logic
  const filteredCreators = creators.filter(c => {
    if (filterRole && !c.role.toLowerCase().includes(filterRole.toLowerCase())) return false;
    if (filterGenre && c.genre !== filterGenre) return false;
    if (filterCity && c.location !== filterCity) return false;
    return true;
  });

  const hasActiveFilters = filterRole || filterGenre || filterCity;

  const clearFilters = () => {
    setFilterRole("");
    setFilterGenre("");
    setFilterCity("");
  };

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
              <div className="mt-5 space-y-2">
                <button onClick={() => setIsPlaying(!isPlaying)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 rounded-full transition-colors flex items-center justify-center gap-2">
                  <PlayIcon className="w-3.5 h-3.5" /> {isPlaying ? "Pause Track" : "Play Latest Track"}
                </button>
                <Link href="/epk" className="w-full border-2 border-emerald-600 text-emerald-700 dark:text-emerald-400 text-sm font-bold py-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors block text-center">View EPK</Link>
              </div>
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

        <main className="col-span-12 lg:col-span-9 space-y-4">
          
          <RecentlyViewedRail title="Recently Viewed" filterTypes={["person", "artist", "label"]} />

          
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
            <h1 className="font-bold text-gray-900 dark:text-white text-2xl">Discover GRID</h1>
            <p className="text-sm text-gray-500 mt-1">Find new collaborators, gigs, and communities.</p>
          </div>

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

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Recently Viewed
              </h3>
              <button className="text-xs font-semibold text-gray-500 hover:text-red-500 transition-colors">Clear history</button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {[
                { name: "Taimoor Khan", role: "Producer", color: "bg-emerald-600" },
                { name: "Lewis Thompson", role: "A&R · Sellick", color: "bg-blue-600" },
                { name: "Alex Rivera", role: "Techno", color: "bg-indigo-600" },
                { name: "Beatport", role: "Curator", color: "bg-purple-600" },
                { name: "Luna Park", role: "Vocalist", color: "bg-pink-500" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center flex-shrink-0 w-24 group cursor-pointer">
                  <div className={`w-16 h-16 rounded-full ${item.color} text-white flex items-center justify-center font-bold text-xl mb-2 ring-2 ring-transparent group-hover:ring-emerald-500 transition-all`}>
                    {item.name[0]}
                  </div>
                  <p className="text-[11px] font-bold text-gray-900 dark:text-white text-center leading-tight truncate w-full">{item.name}</p>
                  <p className="text-[9px] text-gray-500 text-center truncate w-full">{item.role}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">Suggested Creators</h2>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">{filteredCreators.length} matches</span>
            </div>

            {/* QUICK FILTERS */}
            <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-4 mb-6 border border-gray-100 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <FilterIcon /> Quick Filters
                </p>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs font-bold text-red-500 hover:underline">Clear all</button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Role</label>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">All roles</option>
                    <option value="Vocalist">Vocalist</option>
                    <option value="Producer">Producer</option>
                    <option value="DJ">DJ</option>
                    <option value="Songwriter">Songwriter</option>
                    <option value="Band">Band</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Genre</label>
                  <select
                    value={filterGenre}
                    onChange={(e) => setFilterGenre(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">All genres</option>
                    <option value="House">House</option>
                    <option value="Techno">Techno</option>
                    <option value="Pop">Pop</option>
                    <option value="R&B">R&B</option>
                    <option value="Indie">Indie</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">City</label>
                  <select
                    value={filterCity}
                    onChange={(e) => setFilterCity(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">All cities</option>
                    <option value="London">London</option>
                    <option value="Berlin">Berlin</option>
                    <option value="Madrid">Madrid</option>
                    <option value="Manchester">Manchester</option>
                    <option value="New York">New York</option>
                  </select>
                </div>
              </div>
            </div>
            
            {filteredCreators.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm">No creators match your filters.</p>
                <button onClick={clearFilters} className="mt-3 text-emerald-600 font-semibold text-sm hover:underline">Clear filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCreators.map((c) => (
                  <div key={c.id} className="border border-gray-100 dark:border-zinc-800 rounded-xl p-4 text-center hover:border-emerald-400 transition-colors">
                    <div className={`w-16 h-16 rounded-full ${c.color} text-white flex items-center justify-center font-bold text-2xl mx-auto mb-3`}>
                      {c.name[0]}
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center justify-center gap-1">
                      {c.name}
                      {c.verified && <VerifiedIcon className="text-emerald-500" />}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{c.role} · {c.location}</p>
                    <div className="mt-2">
                      <span className="inline-block bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{c.genre}</span>
                    </div>
                    <button 
                      onClick={() => handleConnect(c.id)}
                      className={`w-full mt-3 text-xs font-bold py-1.5 rounded-full transition-colors ${
                        connections[c.id] 
                          ? "bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-gray-300" 
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                    >
                      {connections[c.id] ? "Connected" : "Connect"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-4">Trending Collabs</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600"><MicIcon className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">Vocalist needed for House track</p>
                    <p className="text-xs text-gray-500">Posted by Sarah J. · Royalty Split</p>
                  </div>
                </div>
                <button onClick={() => router.push('/jobs')} className="text-xs font-bold text-emerald-600 hover:underline">View</button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600"><SlidersIcon className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">Mixing &amp; Mastering Engineer</p>
                    <p className="text-xs text-gray-500">Posted by Studio X · £400/track</p>
                  </div>
                </div>
                <button onClick={() => router.push('/jobs')} className="text-xs font-bold text-emerald-600 hover:underline">View</button>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
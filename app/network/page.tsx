"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PlayIcon,
  MicIcon,
  SlidersIcon,
  MarketIcon,
  BookmarkIcon,
  UsersIcon,
  CalendarSVG,
} from "@/components/MusicIcons";
import RecentlyViewedRail from "@/components/RecentlyViewedRail";

const VerifiedIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const CrownIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
  </svg>
);

const CheckIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

type MainTab = "gigs" | "people" | "groups";

interface Creator {
  name: string;
  role: string;
  city: string;
  genre: string;
  color: string;
  verified?: boolean;
  reason: string;
}

interface Gig {
  title: string;
  poster: string;
  pay: string;
  color: string;
  category: "collab" | "booking";
}

const CREATORS: Creator[] = [
  { name: "Sarah Jenkins", role: "Vocalist", city: "London", genre: "House", color: "bg-pink-500", verified: true, reason: "Same genre (House) · 3 mutual collaborators" },
  { name: "David Chen", role: "DJ / Producer", city: "Berlin", genre: "Techno", color: "bg-indigo-500", reason: "Your label follows them" },
  { name: "The Midnight Collective", role: "Indie Band", city: "Manchester", genre: "Indie", color: "bg-blue-600", reason: "1 mutual collaborator · you follow 2 members" },
  { name: "Alex Rivera", role: "Techno Producer", city: "Madrid", genre: "Techno", color: "bg-purple-600", reason: "2 of your connections collaborate with Alex" },
  { name: "Luna Park", role: "Vocalist", city: "London", genre: "R&B", color: "bg-rose-500", reason: "R&B in your top 3 genres" },
  { name: "Marcus Stone", role: "Songwriter", city: "New York", genre: "Pop", color: "bg-amber-500", reason: "Writes for 2 artists you follow" },
];

const GIGS: Gig[] = [
  { title: "Vocalist needed for House track", poster: "Sarah J.", pay: "Royalty split", color: "bg-pink-500", category: "collab" },
  { title: "Mixing & Mastering Engineer", poster: "Studio X", pay: "£400/track", color: "bg-blue-600", category: "booking" },
];

export default function NetworkPage() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [followed, setFollowed] = useState<{ [key: string]: boolean }>({});
  const [mainTab, setMainTab] = useState<MainTab>("gigs");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");

  const handleFollow = (name: string) => {
    setFollowed((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const filteredCreators = CREATORS.filter((c) => {
    const matchesSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || c.role.toLowerCase().includes(roleFilter.toLowerCase());
    const matchesGenre = genreFilter === "all" || c.genre === genreFilter;
    const matchesCity = cityFilter === "all" || c.city === cityFilter;
    return matchesSearch && matchesRole && matchesGenre && matchesCity;
  });

  const filteredGigs = GIGS.filter((g) => {
    return !searchQuery || g.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen relative">

      <div className="mx-auto max-w-[1280px] px-4 py-6 grid grid-cols-12 gap-6">
        {/* LEFT COLUMN */}
        <aside className="col-span-12 lg:col-span-3 space-y-3">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-emerald-600 to-emerald-500" />
            <div className="p-5 -mt-10 text-center relative">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-800 text-white grid place-items-center font-bold text-2xl ring-4 ring-white dark:ring-zinc-900 mb-3">
                U
              </div>
              <p className="font-bold text-gray-900 dark:text-white text-lg">Ulisses Silva</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Music Producer &amp; DJ</p>
              <p className="text-xs text-gray-500 mt-1">London, UK</p>

              <div className="mt-5 space-y-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 rounded-full transition-colors flex items-center justify-center gap-2"
                >
                  <PlayIcon className="w-3.5 h-3.5" /> {isPlaying ? "Pause Track" : "Play Latest Track"}
                </button>
                <Link
                  href="/epk"
                  className="w-full border-2 border-emerald-600 text-emerald-700 dark:text-emerald-400 text-sm font-bold py-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors block text-center"
                >
                  View EPK
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-6 pt-5 border-t border-gray-100 dark:border-zinc-800 text-center">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-base">124</p>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wide">Connections</p>
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-base">2.4K</p>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wide">Followers</p>
                </div>
              </div>
            </div>

            {/* Pro upsell (N5) */}
            <div className="border-t border-gray-100 dark:border-zinc-800 p-4">
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10 rounded-lg border border-amber-200 dark:border-amber-900/40 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <CrownIcon className="w-4 h-4 text-amber-600" />
                  <p className="text-xs font-bold text-amber-900 dark:text-amber-300">Try GRID Pro</p>
                </div>
                <ul className="space-y-1 mb-3">
                  <li className="text-[11px] text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <CheckIcon className="w-3 h-3 text-emerald-600 flex-shrink-0" /> Unlimited gig applications
                  </li>
                  <li className="text-[11px] text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <CheckIcon className="w-3 h-3 text-emerald-600 flex-shrink-0" /> Priority in matched results
                  </li>
                  <li className="text-[11px] text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <CheckIcon className="w-3 h-3 text-emerald-600 flex-shrink-0" /> Full post analytics
                  </li>
                </ul>
                <button
                  onClick={() => router.push("/pro")}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2 rounded-md transition-colors"
                >
                  Start free trial →
                </button>
                <p className="text-[9px] text-amber-700 dark:text-amber-400 text-center mt-1.5">
                  £0 for 30 days · Cancel anytime
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-zinc-800 p-4">
              <ul className="space-y-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <li>
                  <Link href="/marketplace" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group">
                    <MarketIcon className="w-5 h-5 text-emerald-600" />{" "}
                    <span className="group-hover:text-emerald-700">Marketplace</span>
                  </Link>
                </li>
                <li>
                  <Link href="/saved" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group">
                    <BookmarkIcon className="w-5 h-5 text-emerald-600" />{" "}
                    <span className="group-hover:text-emerald-700">Saved Items</span>
                  </Link>
                </li>
                <li>
                  <Link href="/groups" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group">
                    <UsersIcon className="w-5 h-5 text-emerald-600" />{" "}
                    <span className="group-hover:text-emerald-700">Groups</span>
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group">
                    <CalendarSVG className="w-5 h-5 text-emerald-600" />{" "}
                    <span className="group-hover:text-emerald-700">Events</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Recently Viewed — single rail in sidebar */}
          <RecentlyViewedRail title="Recently Viewed" />
        </aside>

        {/* CENTER COLUMN */}
        <main className="col-span-12 lg:col-span-9 space-y-4">

          {/* N2: Hero — search + primary CTA + social proof */}
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl p-6 shadow-lg relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full"></div>
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="relative z-10">
              <h1 className="text-2xl font-bold text-white mb-1">Discover GRID</h1>
              <p className="text-sm text-emerald-100 mb-4">
                Find collaborators, gigs, and communities that match what you do.
              </p>
              <div className="flex gap-2 flex-col sm:flex-row">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search people, gigs, genres..."
                  className="flex-1 px-4 py-3 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button
                  onClick={() => setMainTab("gigs")}
                  className="bg-white text-emerald-700 font-bold text-sm px-6 py-3 rounded-lg hover:bg-emerald-50 transition-colors whitespace-nowrap"
                >
                  Find your next collab →
                </button>
              </div>
              <p className="text-xs text-emerald-100 mt-3 font-medium">
                128 open collabs this week · 47 matched to you · 2,400+ UK producers
              </p>
            </div>
          </div>

          {/* N3+N4: Merged tabbed section with shared filters */}
          
        {/* FEATURED this week */}
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">⭐ Featured this week</h3>
            <a href="/pro" className="text-[10px] font-bold text-amber-700 dark:text-amber-400 hover:underline">Become featured →</a>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[{name:"Toolroom Records",role:"Label · London",c:"bg-pink-500"},{name:"Ministry of Sound",role:"Venue · London",c:"bg-indigo-600"},{name:"Sarah Jenkins",role:"Vocalist · London",c:"bg-rose-500"}].map((f,i)=>(
              <a key={i} href="/pro" className="flex-shrink-0 w-40 bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 p-3 hover:border-amber-400 transition-colors">
                <div className={"w-10 h-10 rounded-full " + f.c + " text-white grid place-items-center font-bold text-sm mb-2"}>{f.name[0]}</div>
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{f.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{f.role}</p>
              </a>
            ))}
          </div>
        </div>

<div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-zinc-800 mb-4">
              <button
                onClick={() => setMainTab("gigs")}
                className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
                  mainTab === "gigs"
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Gigs ({GIGS.length})
              </button>
              <button
                onClick={() => setMainTab("people")}
                className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
                  mainTab === "people"
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                People ({CREATORS.length})
              </button>
              <button
                onClick={() => setMainTab("groups")}
                className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
                  mainTab === "groups"
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Groups (0)
              </button>
            </div>

            {/* GIGS TAB */}
            {mainTab === "gigs" && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-bold text-gray-900 dark:text-white text-base">
                    Open gigs this week
                  </h2>
                  <span className="text-xs text-gray-500">{filteredGigs.length} matches</span>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  Based on your role (Producer), genre (Tech House), and mutual collaborators.
                </p>
                <div className="space-y-3">
                  {filteredGigs.map((g, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-200 dark:border-zinc-700 p-4 flex items-start gap-3"
                    >
                      <div className={`w-10 h-10 rounded-lg ${g.color} text-white grid place-items-center font-bold text-sm flex-shrink-0`}>
                        {g.title[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{g.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Posted by {g.poster}</p>
                        <p className="text-xs text-amber-700 dark:text-amber-400 font-bold mt-1">{g.pay}</p>
                      </div>
                      <button
                        onClick={() => router.push("/jobs")}
                        className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded transition-colors flex-shrink-0 self-center"
                      >
                        View
                      </button>
                    </div>
                  ))}
                  {filteredGigs.length === 0 && (
                    <div className="text-center py-6 text-xs text-gray-500">
                      No gigs match that search. Try a different query.
                    </div>
                  )}
                </div>
                <Link
                  href="/jobs"
                  className="block text-center text-xs font-bold text-emerald-600 hover:underline mt-4"
                >
                  See all open gigs →
                </Link>
              </div>
            )}

            {/* PEOPLE TAB */}
            {mainTab === "people" && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-bold text-gray-900 dark:text-white text-base">
                    Suggested creators
                  </h2>
                  <span className="text-xs text-gray-500">
                    {filteredCreators.length} of {CREATORS.length} matches
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  Based on your genres, role, and mutual collaborators.
                </p>

                {/* Filters */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="text-xs font-semibold bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">All roles</option>
                    <option value="vocalist">Vocalist</option>
                    <option value="producer">Producer</option>
                    <option value="dj">DJ</option>
                    <option value="band">Band</option>
                    <option value="songwriter">Songwriter</option>
                  </select>
                  <select
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}
                    className="text-xs font-semibold bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">All genres</option>
                    <option value="House">House</option>
                    <option value="Techno">Techno</option>
                    <option value="Indie">Indie</option>
                    <option value="R&B">R&B</option>
                    <option value="Pop">Pop</option>
                  </select>
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="text-xs font-semibold bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">All cities</option>
                    <option value="London">London</option>
                    <option value="Berlin">Berlin</option>
                    <option value="Manchester">Manchester</option>
                    <option value="Madrid">Madrid</option>
                    <option value="New York">New York</option>
                  </select>
                </div>

                <div className="space-y-3">
                  {filteredCreators.map((c, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-200 dark:border-zinc-700 p-4 flex items-start gap-3"
                    >
                      <div className={`w-12 h-12 rounded-full ${c.color} text-white grid place-items-center font-bold text-sm flex-shrink-0`}>
                        {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-gray-900 dark:text-white text-sm truncate">
                            {c.name}
                          </p>
                          {c.verified && <VerifiedIcon className="text-emerald-500 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{c.role} · {c.city}</p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                          {c.reason}
                        </p>
                      </div>
                      <button
                        onClick={() => handleFollow(c.name)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors flex-shrink-0 self-center whitespace-nowrap ${
                          followed[c.name]
                            ? "bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-gray-300"
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                        }`}
                      >
                        {followed[c.name] ? "Following" : "Connect"}
                      </button>
                    </div>
                  ))}
                  {filteredCreators.length === 0 && (
                    <div className="text-center py-6 text-xs text-gray-500">
                      No creators match those filters. Try widening them.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* GROUPS TAB */}
            {mainTab === "groups" && (
              <div className="text-center py-12">
                <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-zinc-800 mx-auto mb-3 flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">No groups yet</p>
                <p className="text-xs text-gray-500 mb-4">
                  Groups are communities around genres, cities, or labels. Follow a few creators and we'll suggest relevant groups here.
                </p>
                <button
                  onClick={() => setMainTab("people")}
                  className="text-xs font-bold text-emerald-600 hover:underline"
                >
                  Discover creators →
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
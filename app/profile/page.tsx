"use client";
import { useState } from "react";
import Link from "next/link";
import { PlayIcon, MarketIcon, BookmarkIcon, UsersIcon, CalendarSVG, MicIcon, NoteIcon, HypeIcon, ReplyIcon } from "@/components/MusicIcons";

const VerifiedIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
  </svg>
);
const MapPinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Feed");

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

        {/* MAIN COLUMN: Profile */}
        <main className="col-span-12 lg:col-span-9 space-y-4">
          
          {/* PROFILE HERO CARD */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            {/* Banner */}
            <div className="h-40 bg-gradient-to-r from-zinc-900 via-emerald-900 to-emerald-600 relative">
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button className="bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors border border-white/20">
                  Message
                </button>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors shadow-lg">
                  Follow
                </button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="p-6 md:p-8 relative">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 -mt-20 md:-mt-24 mb-6">
                <div className="flex items-end gap-5">
                  <div className="w-32 h-32 rounded-2xl bg-emerald-800 text-white grid place-items-center font-bold text-5xl ring-4 ring-white dark:ring-zinc-900 shadow-xl">
                    U
                  </div>
                  <div className="mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      Ulisses Silva <VerifiedIcon className="w-6 h-6 text-emerald-500" />
                    </h1>
                    <p className="text-emerald-600 font-semibold text-lg">Music Producer &amp; DJ</p>
                    <div className="flex items-center gap-4 text-gray-500 text-sm mt-1">
                      <span className="flex items-center gap-1"><MapPinIcon /> London, UK</span>
                      <span className="font-semibold text-gray-900 dark:text-white">1,240 Connections</span>
                      <span className="font-semibold text-gray-900 dark:text-white">2.4K Followers</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-700 dark:text-gray-300 max-w-3xl leading-relaxed mb-4">
                Tech House producer & DJ based in London. Signed to Toolroom Records. I host the 'Midnight Sessions' podcast and love collaborating with vocalists and mix engineers. Always open to booking requests for UK/EU clubs.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {["Tech House", "Deep House", "DJ Set", "Mixing", "Toolroom Records"].map(tag => (
                  <span key={tag} className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-bold px-3 py-1.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link href="/epk" className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-6 py-2.5 rounded-lg transition-colors">
                  View EPK
                </Link>
                <button className="border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  Contact Info
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-gray-100 dark:border-zinc-800 px-6 flex gap-6">
              {["Feed", "Portfolio", "About", "Reviews"].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === tab 
                      ? "text-emerald-600 border-emerald-600" 
                      : "text-gray-500 border-transparent hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* TAB CONTENT: FEED */}
          {activeTab === "Feed" && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-800 text-white grid place-items-center font-bold flex-shrink-0 text-lg">U</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-base">Ulisses Silva</p>
                        <p className="text-xs text-gray-500">Music Producer · 2h</p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 font-bold tracking-widest px-2">•••</button>
                    </div>
                    
                    <p className="text-[15px] text-gray-800 dark:text-gray-200 mt-4 mb-4">Just dropped my new remix of 'Midnight City'. Let me know what you think!</p>
                    
                    <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-3 flex items-center gap-3 border border-gray-100 dark:border-zinc-800">
                      <button className="w-10 h-10 rounded-full bg-emerald-600 text-white grid place-items-center hover:bg-emerald-700 transition-colors flex-shrink-0 shadow-sm">
                        <PlayIcon className="w-5 h-5 ml-1" />
                      </button>
                      <div className="flex-1 h-8 flex items-center gap-1 opacity-80">
                        {[10, 30, 50, 80, 60, 40, 20, 70, 90, 50, 30, 60, 80, 40, 20, 60, 90, 70, 50, 30, 60, 80, 40, 20, 70, 90, 50, 30, 60, 80, 40, 20, 60, 90, 70, 50, 30, 60, 80, 40].map((h, i) => (
                      <div key={i} className="flex-1 bg-emerald-500 rounded-full" style={{height: `${h}%`}}></div>
                    ))}
                      </div>
                      <span className="text-xs font-semibold text-gray-500">3:45</span>
                    </div>

                    <div className="flex gap-8 mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                      <button className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-emerald-600 transition-colors">
                        <HypeIcon className="w-5 h-5" /> Hype
                      </button>
                      <button className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-emerald-600 transition-colors">
                        <ReplyIcon className="w-5 h-5" /> Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: PORTFOLIO */}
          {activeTab === "Portfolio" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm flex items-center gap-4 hover:border-emerald-400 transition-colors cursor-pointer">
                <div className="w-16 h-16 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 flex-shrink-0"><NoteIcon className="w-8 h-8" /></div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">Midnight City (Original Mix)</h3>
                  <p className="text-xs text-gray-500">Released on Toolroom Records</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">45.2K Plays</p>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm flex items-center gap-4 hover:border-emerald-400 transition-colors cursor-pointer">
                <div className="w-16 h-16 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 flex-shrink-0"><PlayIcon className="w-8 h-8 ml-1" /></div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">Live @ Ministry of Sound</h3>
                  <p className="text-xs text-gray-500">DJ Set (1hr 15m)</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">12.8K Views</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: ABOUT */}
          {activeTab === "About" && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-4">About</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Ulisses Silva is an up-and-coming House and Techno producer based in London. Known for his energetic sets blending classic Tech House grooves with modern melodic elements, Ulisses has quickly become a staple in the underground scene. With releases on Beatport's Top 100 and a growing global fanbase, his live performances guarantee a packed dancefloor.
              </p>
            </div>
          )}

        </main>

        {/* RIGHT COLUMN: Sidebar Info */}
        <aside className="col-span-12 lg:col-span-3 space-y-4 hidden lg:block">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white text-base mb-4">Open to</h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2 font-semibold"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Session Work</li>
              <li className="flex items-center gap-2 font-semibold"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> DJ Bookings</li>
              <li className="flex items-center gap-2 font-semibold"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Remix Requests</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white text-base mb-4">Tech Rider</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-disc list-inside">
              <li>2x CDJ-3000</li>
              <li>1x DJM-900 NXS2</li>
              <li>Stage Monitor required</li>
              <li>Set length: 60-120 mins</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white text-base mb-4">Similar Artists</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-xs">SJ</div>
                <div><p className="text-sm font-bold text-gray-900 dark:text-white">Sarah Jenkins</p><p className="text-xs text-gray-500">Vocalist</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs">DC</div>
                <div><p className="text-sm font-bold text-gray-900 dark:text-white">David Chen</p><p className="text-xs text-gray-500">DJ / Producer</p></div>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
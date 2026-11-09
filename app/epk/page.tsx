"use client";
import Link from "next/link";
import { PlayIcon, MarketIcon, BookmarkIcon, UsersIcon, CalendarSVG, MicIcon, NoteIcon } from "@/components/MusicIcons";

const VerifiedIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
  </svg>
);
const DownloadIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);
const MapPinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function EPKPage() {
  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen">
      <div className="mx-auto max-w-[1280px] px-4 py-6 grid grid-cols-12 gap-6">

        {/* LEFT COLUMN: Profile Sidebar */}
        <aside className="col-span-12 lg:col-span-3 space-y-3 hidden lg:block">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-emerald-600 to-emerald-500" />
            <div className="p-5 -mt-10 text-center relative">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-800 text-white grid place-items-center font-bold text-2xl ring-4 ring-white dark:ring-zinc-900 mb-3">U</div>
              <p className="font-bold text-gray-900 dark:text-white text-lg">Ulisses Silva</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Music Producer &amp; DJ</p>
              <p className="text-xs text-gray-500 mt-1">London, UK</p>
              
              <div className="mt-5 space-y-2">
                <Link href="/network" className="w-full border-2 border-emerald-600 text-emerald-700 dark:text-emerald-400 text-sm font-bold py-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors block text-center">
                  Back to Network
                </Link>
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

        {/* MAIN COLUMN: The EPK */}
        <main className="col-span-12 lg:col-span-9 space-y-5">
          
          {/* EPK Hero Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-zinc-900 to-emerald-900 relative">
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <VerifiedIcon className="w-4 h-4 text-emerald-400" /> Verified Artist
              </div>
            </div>
            
            <div className="p-6 md:p-8 relative">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 -mt-20 md:-mt-24 mb-6">
                <div className="flex items-end gap-5">
                  <div className="w-32 h-32 rounded-2xl bg-emerald-600 text-white grid place-items-center font-bold text-5xl ring-4 ring-white dark:ring-zinc-900 shadow-lg">
                    U
                  </div>
                  <div className="mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      Ulisses Silva
                    </h1>
                    <p className="text-emerald-600 font-semibold text-lg">House / Techno Producer &amp; DJ</p>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                      <MapPinIcon /> London, UK
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  <button className="flex-1 md:flex-none border-2 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-bold px-6 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
                    <DownloadIcon /> Download EPK
                  </button>
                  <button className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-2.5 rounded-lg transition-colors shadow-sm">
                    Book Now
                  </button>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-gray-100 dark:border-zinc-800">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Avg. Ticket Draw</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">1,250</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Monthly Listeners</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">45.2K</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Past Shows</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">34</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Match Score</p>
                  <p className="text-2xl font-bold text-emerald-600">98%</p>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="md:col-span-2 space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Biography</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Ulisses Silva is an up-and-coming House and Techno producer based in London. Known for his energetic sets blending classic Tech House grooves with modern melodic elements, Ulisses has quickly become a staple in the underground scene. With releases on Beatport's Top 100 and a growing global fanbase, his live performances guarantee a packed dancefloor.
                  </p>
                  
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-4">Genre & Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {["Tech House", "Melodic Techno", "Deep House", "DJ Set", "Live Act"].map(tag => (
                      <span key={tag} className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-bold px-3 py-1.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tech Rider */}
                <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-5 border border-gray-100 dark:border-zinc-800">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <NoteIcon className="w-5 h-5 text-emerald-600" /> Tech Rider
                  </h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-disc list-inside">
                    <li>2x CDJ-3000</li>
                    <li>1x DJM-900 NXS2</li>
                    <li>Stage Monitor required</li>
                    <li>Set length: 60-120 mins</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>

          {/* Featured Media */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Featured Mix</h2>
            <div className="bg-gray-100 dark:bg-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center border border-gray-200 dark:border-zinc-700">
              <button className="w-16 h-16 rounded-full bg-emerald-600 text-white grid place-items-center hover:bg-emerald-700 transition-transform hover:scale-105 shadow-lg mb-3">
                <PlayIcon className="w-8 h-8 ml-1" />
              </button>
              <p className="font-bold text-gray-900 dark:text-white">Live at Ministry of Sound (2026)</p>
              <p className="text-xs text-gray-500 mt-1">1:02:45 • 45.2K plays</p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
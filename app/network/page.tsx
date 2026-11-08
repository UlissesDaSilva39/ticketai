"use client";
import { PlayIcon, MicIcon, SlidersIcon } from "@/components/MusicIcons";

export default function NetworkPage() {
  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen">
      <div className="mx-auto max-w-[1128px] px-4 py-6 grid grid-cols-12 gap-6">

        {/* LEFT COLUMN: Profile & Stats */}
        <aside className="col-span-12 lg:col-span-3 space-y-3">
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            {/* Header Banner */}
            <div className="h-16 bg-gradient-to-r from-emerald-600 to-emerald-500" />
            
            <div className="p-4 -mt-8">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white grid place-items-center font-bold text-xl ring-4 ring-white dark:ring-zinc-900">
                U
              </div>
              
              {/* Name & Role */}
              <p className="font-semibold text-gray-900 dark:text-white mt-2 text-lg">Ulisses Silva</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Music Producer &amp; DJ</p>
              <p className="text-xs text-gray-500 mt-1">London, UK</p>
              
              {/* Play Track Button */}
              <button className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 rounded-full transition-colors flex items-center justify-center gap-1.5">
                <PlayIcon className="w-3.5 h-3.5" /> Play Latest Track
              </button>

              {/* EPK Button (NEW) */}
              <button className="mt-2 w-full border border-emerald-600 text-emerald-700 dark:text-emerald-400 text-sm font-semibold py-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                View EPK
              </button>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800 text-center">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">124</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">Connections</p>
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">2.4K</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">Followers</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="border-t border-gray-100 dark:border-zinc-800 p-4">
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                <li className="cursor-pointer hover:text-emerald-600 transition-colors">Marketplace</li>
                <li className="cursor-pointer hover:text-emerald-600 transition-colors">Saved Items</li>
                <li className="cursor-pointer hover:text-emerald-600 transition-colors">Groups</li>
                <li className="cursor-pointer hover:text-emerald-600 transition-colors">Events</li>
              </ul>
            </div>
          </div>
        </aside>

        {/* CENTER COLUMN: Feed */}
        <main className="col-span-12 lg:col-span-6 space-y-3">
          
          {/* Composer Box */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white grid place-items-center font-bold flex-shrink-0">U</div>
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="Share a track, an event, or an update..." 
                  className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex justify-between items-center mt-3">
                  <div className="flex gap-4">
                    <button className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-emerald-600 flex items-center gap-1">
                      🎵 Audio
                    </button>
                    <button className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-emerald-600 flex items-center gap-1">
                      🎟 Event
                    </button>
                  </div>
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-1.5 rounded-full transition-colors">
                    Publish
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Post: Demo Producer */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white grid place-items-center font-bold flex-shrink-0">D</div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Demo Producer</p>
                    <p className="text-xs text-gray-500">Music Producer · 2h</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">•••</button>
                </div>
                
                <p className="text-sm text-gray-800 dark:text-gray-200 mt-3 mb-3">Just dropped a new beat. Let me know what you think!</p>
                
                {/* Audio Player */}
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3 flex items-center gap-3">
                  <button className="w-10 h-10 rounded-full bg-emerald-600 text-white grid place-items-center hover:bg-emerald-700 transition-colors flex-shrink-0">
                    <PlayIcon className="w-4 h-4 ml-0.5" />
                  </button>
                  {/* Fake Waveform */}
                  <div className="flex-1 h-8 flex items-center gap-0.5 opacity-60">
                    {[...Array(30)].map((_, i) => (
                      <div key={i} className="flex-1 bg-emerald-600 rounded-sm" style={{height: `${Math.max(10, Math.random() * 100)}%`}}></div>
                    ))}
                  </div>
                  <span className="text-xs font-medium text-gray-500">3:45</span>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800">
                  <button className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-emerald-600 transition-colors">🔥 Hype</button>
                  <button className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-emerald-600 transition-colors">💬 Reply</button>
                </div>
              </div>
            </div>
          </div>

          {/* Open Collabs */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Open Collabs</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MicIcon className="w-4 h-4 text-emerald-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Vocalist needed for House track</p>
                  <p className="text-xs text-gray-500">Posted by Sarah J. · 2h ago</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <SlidersIcon className="w-4 h-4 text-emerald-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Mixing &amp; Mastering Engineer</p>
                  <p className="text-xs text-gray-500">Posted by Studio X · 5h ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Industry News */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Industry News</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white hover:underline cursor-pointer">Spotify announces new royalty payout model for 2027</p>
                <p className="text-xs text-gray-500">Music Business Worldwide · 1h ago</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white hover:underline cursor-pointer">London venues fight back against rising operational costs</p>
                <p className="text-xs text-gray-500">NME · 3h ago</p>
              </div>
            </div>
          </div>

        </main>

        {/* RIGHT COLUMN: Artists to Follow */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm sticky top-20">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">Artists to Follow</h3>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-pink-500 text-white grid place-items-center font-bold text-sm">SJ</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Sarah Jenkins</p>
                  <p className="text-xs text-gray-500">Vocalist</p>
                </div>
              </div>
              <button className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 text-xs font-semibold px-3 py-1 rounded-full transition-colors">Follow</button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-indigo-500 text-white grid place-items-center font-bold text-sm">DC</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">David Chen</p>
                  <p className="text-xs text-gray-500">DJ / Producer</p>
                </div>
              </div>
              <button className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 text-xs font-semibold px-3 py-1 rounded-full transition-colors">Follow</button>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
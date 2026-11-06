import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen">
      <div className="mx-auto max-w-[1128px] px-4 py-6 grid grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: The Music Identity */}
        <nav aria-label="Sidebar" className="col-span-12 lg:col-span-3 space-y-2">
          
          {/* Profile Card with Audio Player */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="h-[60px] bg-gradient-to-r from-emerald-600 to-teal-800"></div>
            <div className="px-4 pb-4 relative text-center">
              <div className="w-[72px] h-[72px] bg-zinc-800 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center text-2xl font-bold text-white shadow-sm mx-auto -mt-9 mb-2">
                U
              </div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white hover:underline cursor-pointer">Ulisses Silva</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Music Producer & DJ</p>
              <p className="text-xs text-gray-500 mt-0.5">London, UK</p>
              
              {/* Play Latest Track Button */}
              <button className="mt-3 w-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 font-semibold text-xs py-1.5 rounded-md flex items-center justify-center gap-2 transition-colors">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> Play Latest Track
              </button>
            </div>
            
            {/* Stats */}
            <div className="border-t border-gray-100 dark:border-zinc-800 p-3 flex justify-between text-xs text-gray-500">
               <div className="text-left"><span className="block text-gray-900 dark:text-white font-bold text-sm">124</span> Connections</div>
               <div className="text-left"><span className="block text-gray-900 dark:text-white font-bold text-sm">2.4K</span> Followers</div>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm text-sm">
             <Link href="/marketplace" className="flex items-center gap-3 py-2 text-emerald-600 dark:text-emerald-500 font-bold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md px-2 -mx-2 transition-colors">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
               Marketplace
             </Link>
             <Link href="#" className="flex items-center gap-3 py-2 text-gray-500 hover:text-gray-900 font-medium">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
               Saved Items
             </Link>
             <Link href="#" className="flex items-center gap-3 py-2 text-gray-500 hover:text-gray-900 font-medium">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
               Groups
             </Link>
             <Link href="#" className="flex items-center gap-3 py-2 text-gray-500 hover:text-gray-900 font-medium">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
               Events
             </Link>
          </div>
        </nav>

        {/* CENTER COLUMN: The Music Feed */}
        <main className="col-span-12 lg:col-span-6 space-y-4">
          
          {/* Composer (Music Focus) */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-zinc-800 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold">U</div>
              <input 
                type="text"
                className="flex-1 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                placeholder="Share a track, an event, or an update..." 
              />
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-zinc-800">
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-md transition-colors">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
                  Audio
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-md transition-colors">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  Event
                </button>
              </div>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-2 rounded-md transition-colors">
                Publish
              </button>
            </div>
          </div>

          {/* A Music Industry Post */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">D</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Demo Producer</p>
                    <p className="text-xs text-gray-500">Music Producer · 2h</p>
                  </div>
                </div>
                <button className="text-gray-400 font-bold">•••</button>
              </div>
              <p className="text-sm text-gray-800 dark:text-gray-200 mb-3">Just dropped a new beat. Let me know what you think!</p>
              
              {/* Embedded Audio Player in Post */}
              <div className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg p-3 flex items-center gap-3 mb-4">
                <button className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white hover:bg-emerald-700 transition-colors pl-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </button>
                <div className="flex-1">
                  <div className="h-1 bg-gray-300 dark:bg-zinc-600 rounded-full w-full relative">
                    <div className="absolute top-0 left-0 h-1 bg-emerald-500 rounded-full w-1/3"></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                    <span>1:12</span>
                    <span>3:45</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-2 py-1 border-t border-gray-100 dark:border-zinc-800 flex justify-between">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-gray-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/></svg>
                Hype
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-gray-500 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                Reply
              </button>
            </div>
          </div>
        </main>

        {/* RIGHT COLUMN: Music Industry Insights & Collabs */}
        <aside className="col-span-12 lg:col-span-3 space-y-2 hidden lg:block">
           
           {/* Open Collabs */}
           <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Open Collabs</h2>
            <div className="space-y-3">
               <div>
                 <p className="text-sm font-semibold text-emerald-600 hover:underline cursor-pointer">Vocalist needed for House track</p>
                 <p className="text-xs text-gray-500 mt-0.5">Posted by Sarah J. · 2h ago</p>
               </div>
               <div>
                 <p className="text-sm font-semibold text-emerald-600 hover:underline cursor-pointer">Mixing & Mastering Engineer</p>
                 <p className="text-xs text-gray-500 mt-0.5">Posted by Studio X · 5h ago</p>
               </div>
            </div>
           </div>

           {/* Music Industry News */}
           <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Industry News</h2>
             <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="block group">
                    <p className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-emerald-600 leading-tight">Spotify announces new royalty payout model for 2027</p>
                    <p className="text-xs text-gray-500 mt-1">Music Business Worldwide · 1h ago</p>
                  </a>
                </li>
                <li>
                  <a href="#" className="block group">
                    <p className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-emerald-600 leading-tight">London venues fight back against rising operational costs</p>
                    <p className="text-xs text-gray-500 mt-1">NME · 3h ago</p>
                  </a>
                </li>
             </ul>
           </div>

           {/* Top Artists to Follow */}
           <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
             <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Artists to Follow</h2>
             <div className="space-y-3">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                   <div>
                     <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">Sarah Jenkins</p>
                     <p className="text-[10px] text-gray-500">Vocalist</p>
                   </div>
                 </div>
                 <button className="text-xs font-bold text-emerald-600 hover:text-emerald-500">Follow</button>
               </div>
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                   <div>
                     <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">David Chen</p>
                     <p className="text-[10px] text-gray-500">DJ / Producer</p>
                   </div>
                 </div>
                 <button className="text-xs font-bold text-emerald-600 hover:text-emerald-500">Follow</button>
               </div>
             </div>
           </div>

        </aside>

      </div>
    </div>
  );
}
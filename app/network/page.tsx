import Link from 'next/link';

export default function NetworkPage() {
  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen">
      <div className="mx-auto max-w-[1128px] px-4 py-6 grid grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Manage Network */}
        <nav aria-label="Manage network" className="col-span-12 lg:col-span-3 space-y-2">
          
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Manage my network</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-2 text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                  Connections
                </div>
                <span className="text-xs text-gray-500 font-medium">3,551</span>
              </li>
              <li className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-2 text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  Following & followers
                </div>
              </li>
              <li className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-2 text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                  Groups
                </div>
                <span className="text-xs text-gray-500 font-medium">60</span>
              </li>
              <li className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-2 text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  Events
                </div>
                <span className="text-xs text-gray-500 font-medium">20</span>
              </li>
              <li className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-2 text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  Pages
                </div>
                <span className="text-xs text-gray-500 font-medium">1,397</span>
              </li>
              <li className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-2 text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                  Newsletters
                </div>
                <span className="text-xs text-gray-500 font-medium">284</span>
              </li>
            </ul>
          </div>

          {/* Footer links */}
          <div className="px-4 text-xs text-center text-gray-500 space-y-1">
            <p className="flex flex-wrap justify-center gap-x-2 gap-y-1">
              <a href="#" className="hover:underline">About</a>
              <a href="#" className="hover:underline">Accessibility</a>
              <a href="#" className="hover:underline">Help Center</a>
            </p>
            <p className="flex flex-wrap justify-center gap-x-2 gap-y-1">
              <a href="#" className="hover:underline">Privacy & Terms ⌄</a>
              <a href="#" className="hover:underline">Ad Choices</a>
              <a href="#" className="hover:underline">Advertising</a>
            </p>
             <p className="flex flex-wrap justify-center gap-x-2 gap-y-1">
              <a href="#" className="hover:underline">Business Services ⌄</a>
              <a href="#" className="hover:underline">Get the LinkedIn app</a>
              <a href="#" className="hover:underline">More</a>
            </p>
            <p className="mt-3 font-semibold text-emerald-700 dark:text-emerald-500 flex justify-center items-center gap-1">
              GRID Corporation © 2026
            </p>
          </div>
        </nav>

        {/* CENTER COLUMN: Invitations */}
        <main className="col-span-12 lg:col-span-6 space-y-2">
          
          {/* Tabs */}
          <div className="bg-white dark:bg-zinc-900 rounded-t-lg border border-gray-200 dark:border-zinc-800 flex border-b-0 shadow-sm pt-2 px-4">
            <button className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white border-b-2 border-emerald-600">Grow</button>
            <button className="px-4 py-3 text-sm font-semibold text-gray-500 hover:text-gray-900">Catch up</button>
          </div>

          {/* Invitations Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-b-lg border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-zinc-800">
              <h2 className="font-semibold text-gray-900 dark:text-white">Invitations (111)</h2>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
              
              {/* Invite 1 (Company) */}
              <div className="flex items-start justify-between p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                <div className="flex gap-3">
                  <div className="w-20 h-20 bg-blue-700 flex items-center justify-center text-white font-bold text-3xl rounded-sm flex-shrink-0">
                    V
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Newsletter • Biweekly</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Verint <span className="font-normal text-gray-600">invited you to subscribe to <span className="font-semibold">The CX Automation Briefing</span></span></p>
                  </div>
                </div>
                <button className="text-gray-500 font-semibold text-sm px-3 py-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded transition-colors flex-shrink-0">Ignore</button>
              </div>

              {/* Invite 2 (Person) */}
              <div className="flex items-start justify-between p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                <div className="flex gap-3">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=Taimoor+Ali+Khan&background=random" className="w-full h-full" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm hover:underline cursor-pointer">Taimoor Ali Khan</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">Founder @ Sentiments | Principal @ Taimoor Ali Khan & Co. Chartered Accountants...</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                       <img src="https://ui-avatars.com/api/?name=Elena&background=random" className="w-4 h-4 rounded-full" /> Elena Pekelаnоu is a mutual connection
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0 mt-1">
                  <button className="text-gray-500 font-semibold text-sm px-3 py-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded transition-colors">Ignore</button>
                  <button className="text-emerald-600 border border-emerald-600 hover:bg-emerald-50 font-semibold text-sm px-3 py-1 rounded-full transition-colors">Accept</button>
                </div>
              </div>

              {/* Invite 3 (Person) */}
              <div className="flex items-start justify-between p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                <div className="flex gap-3">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=Lewis+Thompson&background=random" className="w-full h-full" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm hover:underline cursor-pointer">Lewis Thompson <span className="text-xs bg-gray-200 px-1 rounded text-gray-600 font-normal">in</span> <span className="font-normal text-gray-500">wants to connect</span></p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">Technology Recruitment Consultant at Sellick Partnership | Central Government & Defence...</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                       <img src="https://ui-avatars.com/api/?name=James&background=random" className="w-4 h-4 rounded-full" /> James Myddelton and 13 other mutual connections
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0 mt-1">
                  <button className="text-gray-500 font-semibold text-sm px-3 py-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded transition-colors">Ignore</button>
                  <button className="text-emerald-600 border border-emerald-600 hover:bg-emerald-50 font-semibold text-sm px-3 py-1 rounded-full transition-colors">Accept</button>
                </div>
              </div>

            </div>
          </div>
        </main>

        {/* RIGHT COLUMN: Empty for this view, but keeps the grid layout intact */}
        <aside className="col-span-12 lg:col-span-3 space-y-2 hidden lg:block">
            {/* Placeholder for future ads or suggestions */}
        </aside>

      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';

export default function MessagingPopup() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-0 right-8 z-50 bg-emerald-700 hover:bg-emerald-800 text-white rounded-t-lg px-4 py-2 flex items-center gap-2 shadow-lg transition-colors font-semibold text-sm"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
        Messaging
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-8 z-50 w-[320px] bg-white dark:bg-zinc-900 rounded-t-lg shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col overflow-hidden h-[450px]">
      
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center text-[10px] text-white font-bold">U</div>
          <span className="font-semibold text-gray-900 dark:text-white text-sm">Messaging</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <button className="hover:bg-gray-100 dark:hover:bg-zinc-800 p-1 rounded">⋯</button>
          <button className="hover:bg-gray-100 dark:hover:bg-zinc-800 p-1 rounded">✎</button>
          <button onClick={() => setIsOpen(false)} className="hover:bg-gray-100 dark:hover:bg-zinc-800 p-1 rounded text-lg leading-none">&times;</button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-2 border-b border-gray-200 dark:border-zinc-800">
        <div className="relative">
          <svg className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" placeholder="Search messages" className="w-full bg-gray-100 dark:bg-zinc-800 text-sm rounded px-8 py-1.5 focus:outline-none" />
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto">
        
        {/* Message 1 */}
        <div className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer border-b border-gray-100 dark:border-zinc-800/50 bg-emerald-50/30 dark:bg-emerald-900/10">
          <div className="relative">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">L</div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline mb-0.5">
              <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">LinkedIn Talent Solu...</p>
              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">4:08 PM</span>
            </div>
            <p className="text-xs text-gray-500 truncate">LinkedIn Offer • Worried you'll make the wrong...</p>
          </div>
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
        </div>

        {/* Message 2 */}
        <div className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer border-b border-gray-100 dark:border-zinc-800/50">
          <div className="relative">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">E</div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline mb-0.5">
              <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">Euronext Corporate S...</p>
              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">Nov 3</span>
            </div>
            <p className="text-xs text-gray-500 truncate">Sponsored • Your invitation</p>
          </div>
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
        </div>

        {/* Message 3 */}
        <div className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer border-b border-gray-100 dark:border-zinc-800/50">
          <div className="relative">
            <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
              <img src="https://ui-avatars.com/api/?name=Edd+Holmwood&background=random" className="w-full h-full rounded-full" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline mb-0.5">
              <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">Edd Holmwood</p>
              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">Oct 30</span>
            </div>
            <p className="text-xs text-gray-500 truncate">InMail • Any Upcoming Projects Requiring...</p>
          </div>
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
        </div>

        {/* Message 4 */}
        <div className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer">
          <div className="relative">
            <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
              <img src="https://ui-avatars.com/api/?name=Kunal+Modi&background=random" className="w-full h-full rounded-full" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline mb-0.5">
              <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">Kunal Modi</p>
              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">Oct 29</span>
            </div>
            <p className="text-xs text-gray-500 truncate">Kunal: Hey Ulisses! Wanted to learn about...</p>
          </div>
        </div>

      </div>
    </div>
  );
}
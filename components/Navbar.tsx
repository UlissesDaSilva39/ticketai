'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sub-navbar when scrolling down past the main profile header (approx 350px)
      // Note: For a real app, you would check if the current path is /profile
      if (window.scrollY > 350) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#1b1f23] border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
      
      {/* MAIN NAVBAR */}
      <div className="mx-auto max-w-[1128px] px-4 h-[52px] flex items-center justify-between gap-2">
        
        {/* LEFT: Logo & Search */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/" className="text-2xl font-extrabold tracking-tighter text-emerald-600 dark:text-emerald-500">
            GRID
          </Link>
          <div className="relative hidden md:block ml-2">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input type="text" placeholder="Search" className="bg-gray-100 dark:bg-zinc-900 text-sm rounded w-[280px] pl-9 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all" />
          </div>
        </div>

        {/* CENTER: Nav Icons */}
        <nav className="flex items-center h-full">
          <Link href="/" className="flex flex-col items-center justify-center h-full w-[80px] text-gray-500 hover:text-black dark:hover:text-white border-b-2 border-emerald-500 text-black dark:text-white">
            <svg className="w-6 h-6 mb-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 9v2h-2v7a3 3 0 01-3 3h-4v-6h-4v6H6a3 3 0 01-3-3v-7H1V9l11-7 5 3.18V2h3v5.09z"/></svg>
            <span className="text-[12px]">Home</span>
          </Link>

          <Link href="/network" className="flex flex-col items-center justify-center h-full w-[80px] text-gray-500 hover:text-black dark:hover:text-white border-b-2 border-transparent hover:border-emerald-500 transition-all">
            <svg className="w-6 h-6 mb-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
            <span className="text-[12px]">Network</span>
          </Link>

          <Link href="/jobs" className="flex flex-col items-center justify-center h-full w-[80px] text-gray-500 hover:text-black dark:hover:text-white border-b-2 border-transparent hover:border-emerald-500 transition-all">
            <svg className="w-6 h-6 mb-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zM10 4h4v2h-4V4zm10 15H4V8h16v11z"/></svg>
            <span className="text-[12px]">Jobs</span>
          </Link>

          <Link href="/messages" className="flex flex-col items-center justify-center h-full w-[80px] text-gray-500 hover:text-black dark:hover:text-white border-b-2 border-transparent hover:border-emerald-500 transition-all relative">
            <svg className="w-6 h-6 mb-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
            <span className="text-[12px]">Messaging</span>
            <span className="absolute top-1 right-4 bg-emerald-600 text-white text-[10px] font-bold px-1.5 rounded-full">25</span>
          </Link>

          <Link href="/notifications" className="flex flex-col items-center justify-center h-full w-[80px] text-gray-500 hover:text-black dark:hover:text-white border-b-2 border-transparent hover:border-emerald-500 transition-all relative">
            <svg className="w-6 h-6 mb-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
            <span className="text-[12px]">Notifications</span>
            <span className="absolute top-1 right-2 bg-emerald-600 text-white text-[10px] font-bold px-1.5 rounded-full">0</span>
          </Link>

          {/* ME Dropdown Trigger */}
          <div 
            className="flex flex-col items-center justify-center h-full w-[80px] text-gray-500 cursor-pointer hover:text-black dark:hover:text-white relative"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 bg-zinc-800 dark:bg-zinc-200 rounded-full mb-0.5 overflow-hidden"></div>
            <span className="text-[12px] flex items-center gap-1">Me ⌄</span>

            {/* THE DROPDOWN MENU */}
            {isMenuOpen && (
              <div className="absolute top-[52px] right-0 w-[300px] bg-white dark:bg-zinc-900 rounded-b-lg shadow-xl border border-gray-200 dark:border-zinc-800 p-4 text-left">
                {/* ... Dropdown content ... */}
                <div className="flex gap-3 mb-3">
                  <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">U</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base leading-tight">Ulisses Bezerra Da Silva</h3>
                    <p className="text-xs text-gray-500">Founder - CEO @ TicketAI</p>
                  </div>
                </div>
                <div className="flex gap-2 mb-4">
                  <Link href="/profile" className="flex-1 text-center border border-emerald-600 text-emerald-700 dark:text-emerald-500 font-semibold text-sm py-1.5 rounded-full hover:bg-emerald-50 transition-colors">View profile</Link>
                  <button className="flex-1 bg-emerald-700 text-white font-semibold text-sm py-1.5 rounded-full hover:bg-emerald-800 transition-colors">Verify now</button>
                </div>
                <hr className="border-gray-200 dark:border-zinc-800 mb-3" />
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <p className="font-semibold text-gray-900 dark:text-white">Account</p>
                  <Link href="#" className="flex items-center gap-2 hover:text-emerald-600"><span className="text-yellow-500">🟨</span> Get 1 free month of Premium</Link>
                  <Link href="#" className="block hover:text-emerald-600">Settings & Privacy</Link>
                  <Link href="#" className="block hover:text-emerald-600">Help</Link>
                  <Link href="#" className="block hover:text-emerald-600">Language</Link>
                  <hr className="border-gray-200 dark:border-zinc-800 my-2" />
                  <Link href="#" className="block hover:text-emerald-600 font-semibold">Sign out</Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* RIGHT: Business */}
        <div className="flex items-center gap-4 flex-shrink-0 border-l border-gray-300 dark:border-zinc-800 pl-4">
          <div className="flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:text-black dark:hover:text-white">
            <svg className="w-6 h-6 mb-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>
            <span className="text-[12px] flex items-center gap-1">For Business</span>
          </div>
          <div className="flex flex-col items-center justify-center cursor-pointer text-emerald-600 dark:text-emerald-500">
            <span className="text-[12px] font-medium underline decoration-transparent hover:decoration-current">Try Premium</span>
          </div>
        </div>
      </div>

      {/* DYNAMIC SUB-NAVBAR (Only visible on scroll) */}
      <div 
        className={`bg-white dark:bg-[#1b1f23] border-b border-gray-200 dark:border-zinc-800 shadow-sm w-full overflow-hidden transition-all duration-300 ease-in-out ${
          isScrolled ? 'max-h-[60px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mx-auto max-w-[1128px] px-4 h-[60px] flex items-center justify-between">
          {/* Profile Info */}
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-zinc-800 rounded-full overflow-hidden flex-shrink-0">
                <img src="https://ui-avatars.com/api/?name=Ulisses+Silva&background=random" className="w-full h-full object-cover" />
             </div>
             <div>
               <h2 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">Ulisses Bezerra Da Silva</h2>
               <p className="text-xs text-gray-500">Founder - CEO @ TicketAI</p>
             </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 p-2 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/></svg>
            </button>
            <button className="border border-emerald-600 text-emerald-700 dark:text-emerald-500 font-semibold text-sm px-4 py-1.5 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors">Enhance profile</button>
            <button className="border border-emerald-600 text-emerald-700 dark:text-emerald-500 font-semibold text-sm px-4 py-1.5 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors">Add section</button>
            <button className="bg-emerald-600 text-white font-semibold text-sm px-4 py-1.5 rounded-full hover:bg-emerald-700 transition-colors">Open to</button>
          </div>
        </div>
      </div>

    </header>
  );
}
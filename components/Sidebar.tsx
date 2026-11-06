import Link from 'next/link';

const iconClass = "w-4 h-4 mr-2 flex-shrink-0";

export default function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-zinc-800 bg-black p-4 hidden md:block overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Your Library</h2>
        <nav className="flex flex-col gap-1">
          <Link href="/home" className="flex items-center text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 px-2 py-2 rounded-md">
            <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            Home
          </Link>
          <Link href="/artists" className="flex items-center text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 px-2 py-2 rounded-md">
            <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            Artists
          </Link>
          <Link href="/search" className="flex items-center text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 px-2 py-2 rounded-md">
            <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            Search
          </Link>
        </nav>
      </div>

      <div className="mb-6">
        <nav className="flex flex-col gap-1">
          <Link href="/tickets" className="flex items-center text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 px-2 py-2 rounded-md">
            <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>
            My Tickets
          </Link>
          <Link href="/friends" className="flex items-center text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 px-2 py-2 rounded-md">
            <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
            Friends
          </Link>
          <Link href="/messages" className="flex items-center text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 px-2 py-2 rounded-md">
            <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
            Messages
          </Link>
          <Link href="/following" className="flex items-center text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 px-2 py-2 rounded-md">
            <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
            Following
          </Link>
        </nav>
      </div>

      <div className="mb-6">
        <nav className="flex flex-col gap-1">
          <Link href="/network" className="flex items-center text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 px-2 py-2 rounded-md">
            <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
            Network
          </Link>
          <Link href="/opportunities" className="flex items-center text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 px-2 py-2 rounded-md">
            <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            Opportunities
          </Link>
          <Link href="/dashboard" className="flex items-center text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 px-2 py-2 rounded-md">
            <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
            Dashboard
          </Link>
          <Link href="/data" className="flex items-center text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 px-2 py-2 rounded-md">
            <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>
            Data Ingestion
          </Link>
        </nav>
      </div>

      <div className="mt-auto border-t border-zinc-800 pt-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-sm font-bold">U</div>
          <div className="flex flex-col">
            <span className="text-sm text-white font-medium">User</span>
            <span className="text-xs text-zinc-500">attendee</span>
          </div>
        </div>
        <Link href="/settings" className="text-xs text-zinc-500 hover:text-white mt-2 block px-2 py-1">
          Edit profile
        </Link>
      </div>
    </aside>
  );
}
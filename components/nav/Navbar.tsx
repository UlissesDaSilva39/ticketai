"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", path: "/home", icon: HomeIcon, hasBadge: true },
    { name: "Network", path: "/network", icon: NetworkIcon },
    { name: "Jobs", path: "/jobs", icon: JobsIcon },
    { name: "Payments", path: "/payments", icon: PaymentsIcon },
    { name: "Messaging", path: "/messaging", icon: MessagingIcon },
    { name: "Notifications", path: "/notifications", icon: NotificationsIcon },
  ];

  return (
    <nav className="w-full bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4 flex justify-between items-center h-14 gap-4">
        
        {/* LEFT: Logo & Search */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link href="/" className="text-xl font-bold text-emerald-600 tracking-tight hidden md:block">
            GRID
          </Link>
          <div className="relative w-48 lg:w-64 hidden sm:block">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-[#eef3f8] dark:bg-zinc-900 border border-transparent focus:border-emerald-500 rounded-md pl-9 pr-3 py-1.5 text-sm focus:outline-none transition-colors" 
            />
          </div>
        </div>

        {/* CENTER: Navigation Icons */}
        <div className="flex items-center h-full flex-1 justify-center">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.path}
                className={`relative flex flex-col items-center justify-center h-full px-4 min-w-[64px] group transition-colors ${
                  isActive 
                    ? "text-gray-900 dark:text-white font-semibold" 
                    : "text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                <div className="relative">
                  <Icon isActive={isActive} />
                  {item.hasBadge && (
                    <span className="absolute -top-1.5 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white dark:border-zinc-950"></span>
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 hidden md:block tracking-wide whitespace-nowrap">
                  {item.name}
                </span>
                {isActive && <span className="absolute bottom-0 left-0 w-full h-[3px] bg-gray-900 dark:bg-white rounded-t-sm" />}
              </Link>
            );
          })}
        </div>

        {/* RIGHT: User Menus */}
        <div className="flex items-center h-full flex-shrink-0 gap-4">
          
          {/* Me Dropdown */}
          <div className="flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:text-gray-900 dark:hover:text-white group h-full">
            <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-zinc-700 overflow-hidden flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
               U
            </div>
            <span className="text-[10px] mt-1 flex items-center gap-0.5">
              Me <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
            </span>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-300 dark:bg-zinc-700"></div>

          {/* For Business */}
          <div className="flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:text-gray-900 dark:hover:text-white group h-full hidden lg:flex">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/></svg>
            <span className="text-[10px] mt-1 flex items-center gap-0.5">
              For Business <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
            </span>
          </div>

          {/* Try Premium */}
          <div className="flex flex-col items-center justify-center cursor-pointer text-amber-600 hover:text-amber-700 group h-full hidden lg:flex">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span className="text-[10px] mt-1 text-gray-500 group-hover:text-amber-600 whitespace-nowrap">Try Premium</span>
          </div>

        </div>
      </div>
    </nav>
  );
}

const HomeIcon = ({ isActive }: { isActive: boolean }) => isActive ? (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" /></svg>
) : (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
);

const NetworkIcon = ({ isActive }: { isActive: boolean }) => isActive ? (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm7-2c1.66 0 3-1.34 3-3s-1.34-3-3-3c-.46 0-.9.1-1.29.29.79.99 1.29 2.24 1.29 3.71 0 1.4-.46 2.6-1.18 3.56.37.15.76.24 1.18.24zm-1.63 3.03c1.13.74 1.63 1.84 1.63 2.97v2h4v-2c0-2.1-2.66-3.33-5.63-3.65z"/></svg>
) : (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
);

const JobsIcon = ({ isActive }: { isActive: boolean }) => isActive ? (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2zm6 13H4v-7h16v7z"/></svg>
) : (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);

const PaymentsIcon = ({ isActive }: { isActive: boolean }) => isActive ? (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/></svg>
) : (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

const MessagingIcon = ({ isActive }: { isActive: boolean }) => isActive ? (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm4 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm4 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>
) : (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
);

const NotificationsIcon = ({ isActive }: { isActive: boolean }) => isActive ? (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
) : (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
);
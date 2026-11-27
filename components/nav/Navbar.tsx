"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { useMe, invalidateMe, displayName, initials, roleLabel } from "@/lib/hooks/useMe";
import ProBadge from "@/components/ProBadge";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { me } = useMe();
  const myName = displayName(me?.profile, me?.user.email);
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      // Server route clears the session cookies; the browser client clears its own copy.
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      await createClient().auth.signOut();
    } catch (err) {
      console.error("[sign out]", err);
    }
    invalidateMe();
    setMeOpen(false);
    router.push("/login");
    router.refresh();
    setSigningOut(false);
  }
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const [businessOpen, setBusinessOpen] = useState(false);
  const [meOpen, setMeOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  
  const businessRef = useRef<HTMLDivElement>(null);
  const meRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    function handleClickOutside(event: MouseEvent) {
      if (businessRef.current && !businessRef.current.contains(event.target as Node)) setBusinessOpen(false);
      if (meRef.current && !meRef.current.contains(event.target as Node)) setMeOpen(false);
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) setMoreOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Red badges show real unread counts (hidden when zero or logged out).
  const badge = (n?: number) => (n && n > 0 ? (n > 99 ? "99+" : String(n)) : null);
  const navItems = [
    { name: "Home", path: "/home", icon: HomeIcon, badge: null },
    { name: "Network", path: "/network", icon: NetworkIcon, badge: null },
    { name: "Jobs", path: "/jobs", icon: JobsIcon, badge: null },
    { name: "Messaging", path: "/messages", icon: MessagingIcon, badge: badge(me?.counts.unreadMessages) },
    { name: "Notifications", path: "/notifications", icon: NotificationsIcon, badge: badge(me?.counts.unreadNotifications) },
  ];

  const moreItems = [
    { name: "Live", path: "/live", icon: LiveIcon },
    { name: "Boost", path: "/boost", icon: PromoteIcon },
    { name: "Send demos", path: "/submit", icon: SubmitIcon },
    { name: "Backstage", path: "/backstage", icon: BackstageIcon },
    { name: "Payments", path: "/payments", icon: PaymentsIcon },
    { name: "Splits", path: "/splits", icon: SplitsIcon },
    { name: "Newsletters", path: "/newsletters", icon: NewslettersIcon },
    { name: "Distribution", path: "/distribution", icon: DistributionIcon },
    { name: "Licensing", path: "/licensing", icon: LicensingIcon },
  ];

  return (
    <nav className="w-full bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-2 sm:px-4 flex justify-between items-center h-14 gap-2 sm:gap-4">
        
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link href="/" className="text-xl font-bold text-emerald-600 tracking-tight hidden md:block">GRID</Link>
          <div className="relative w-48 lg:w-64 hidden sm:block">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <form action="/search" method="GET" className="w-full">
              <input type="text" name="q" placeholder="Search" className="w-full bg-[#eef3f8] dark:bg-zinc-900 border border-transparent focus:border-emerald-500 rounded-md pl-9 pr-3 py-1.5 text-sm focus:outline-none transition-colors" />
            </form>
          </div>
        </div>

        <div className="flex items-center h-full flex-1 justify-center min-w-0">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.path} className={`relative flex flex-col items-center justify-center h-full px-2 min-w-[44px] sm:px-4 sm:min-w-[64px] group transition-colors ${isActive ? "text-gray-900 dark:text-white font-semibold" : "text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"}`}>
                <div className="relative">
                  <Icon isActive={isActive} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white border-2 border-white dark:border-zinc-950">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 hidden md:block tracking-wide whitespace-nowrap">{item.name}</span>
                {isActive && <span className="absolute bottom-0 left-0 w-full h-[3px] bg-gray-900 dark:bg-white rounded-t-sm" />}
              </Link>
            );
          })}

          <div className="relative h-full flex flex-col items-center justify-center px-4 min-w-[64px]" ref={moreRef}>
            <button onClick={() => setMoreOpen(!moreOpen)} className={`flex flex-col items-center justify-center h-full group outline-none ${moreOpen ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              <span className="text-[10px] mt-1 flex items-center gap-0.5">More <svg className={`w-2.5 h-2.5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg></span>
            </button>
            {moreOpen && (
              <div className="absolute top-14 left-1/2 -translate-x-1/2 w-48 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-800 py-2 z-50">
                {moreItems.map((item) => {
                   const Icon = item.icon;
                   const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
                   return (
                    <Link key={item.name} href={item.path} onClick={() => setMoreOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-sm text-gray-700 dark:text-gray-300">
                      <Icon isActive={isActive} />
                      {item.name}
                    </Link>
                   )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center h-full flex-shrink-0 gap-4">
          <div className="relative h-full flex" ref={meRef}>
            <button onClick={() => setMeOpen(!meOpen)} className={`flex flex-col items-center justify-center h-full group outline-none ${meOpen ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>
              <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-zinc-700 overflow-hidden flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                {me?.profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={me.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  me ? initials(myName) : ""
                )}
              </div>
              <span className="text-[10px] mt-1 flex items-center gap-0.5">Me <svg className={`w-2.5 h-2.5 transition-transform ${meOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg></span>
            </button>
            {meOpen && (
              <div className="absolute top-14 right-0 w-72 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-800 overflow-hidden z-50">
                <div className="p-4 border-b border-gray-100 dark:border-zinc-800">
                  <div className="flex gap-3">
                    {me?.profile.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={me.profile.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">{initials(myName)}</div>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 dark:text-white text-sm truncate flex items-center gap-1.5">
                        <span className="truncate">{myName}</span>
                        {me?.pro?.active && <ProBadge tier={me.pro.tier} />}
                      </p>
                      {me?.profile.username && <p className="text-xs text-gray-500 truncate">@{me.profile.username}</p>}
                      <p className="text-xs text-gray-500 mt-0.5">{roleLabel(me?.profile.role, me?.profile.genre)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Link href="/profile" onClick={() => setMeOpen(false)} className="flex-1 border border-emerald-600 text-emerald-700 text-xs font-bold py-1.5 rounded-full text-center hover:bg-emerald-50 transition-colors">View Profile</Link>
                    <Link href="/epk" onClick={() => setMeOpen(false)} className="flex-1 border border-emerald-600 text-emerald-700 text-xs font-bold py-1.5 rounded-full text-center hover:bg-emerald-50 transition-colors">My EPK</Link>
                    <Link href="/verify" className="flex-1 bg-emerald-600 text-white text-xs font-bold py-1.5 rounded-full text-center hover:bg-emerald-700 transition-colors">Get Verified</Link>
                  </div>
                </div>
                <div className="p-2">
                  <Link href="/pro" className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 text-amber-600 font-semibold text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    {me?.pro?.active
                      ? me.pro.tier === "premium" ? "Your GRID Premium" : "Your GRID Pro"
                      : me?.pro?.hadSubscription ? "See GRID plans" : "Try GRID Pro or Premium free"}
                  </Link>
                  <div className="h-px bg-gray-100 dark:bg-zinc-800 my-2"></div>
                  <p className="px-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 mt-2">Manage</p>
                  <Link href="/promote" className="block px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-md">Promote Music</Link>
                  <Link href="/licensing" className="block px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-md">Licensing</Link>
                  <Link href="/splits" className="block px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-md">Releases &amp; Splits</Link>
                  <Link href="/billboard" className="block px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-md">Releases &amp; Billboard</Link>
                  <Link href="/payments" className="block px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-md">Escrow &amp; Payouts</Link>
                  <div className="h-px bg-gray-100 dark:bg-zinc-800 my-2"></div>
                  <p className="px-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 mt-2">Settings</p>
                  <Link href="/legal" className="block px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-md">Legal &amp; Privacy</Link>
                  {me?.profile.role === "admin" && (
                    <Link href="/admin/curators" className="block px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md font-semibold">Admin: Curator Verify</Link>
                  )}
                </div>
                <div className="p-2 border-t border-gray-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="w-full text-left px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-md disabled:opacity-50"
                  >
                    {signingOut ? "Signing out…" : "Sign out"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-gray-300 dark:bg-zinc-700"></div>
          
          <div className="relative h-full hidden lg:flex" ref={businessRef}>
            <button onClick={() => setBusinessOpen(!businessOpen)} className={`flex flex-col items-center justify-center h-full group outline-none ${businessOpen || pathname.includes('/business') || pathname.includes('/calendar') || pathname.includes('/epk') ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/></svg>
              <span className="text-[10px] mt-1 flex items-center gap-0.5 font-semibold whitespace-nowrap">For Business <svg className={`w-2.5 h-2.5 transition-transform ${businessOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg></span>
            </button>
            
            {businessOpen && (
              <div className="absolute top-14 right-0 w-64 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-800 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-zinc-800 mb-1"><p className="text-xs font-bold text-gray-500 uppercase tracking-wider">GRID Business</p></div>
                <Link href="/business" className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2"><svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> Venue Dashboard</p>
                  <p className="text-xs text-gray-500 mt-0.5">Find and book artists</p>
                </Link>
                <Link href="/epk" className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2"><svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> Artist EPKs</p>
                  <p className="text-xs text-gray-500 mt-0.5">View press kits</p>
                </Link>
                <Link href="/calendar" className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2"><svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> Venue Calendar</p>
                  <p className="text-xs text-gray-500 mt-0.5">Manage bookings</p>
                </Link>
              </div>
            )}
          </div>

          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white group h-full hidden lg:flex"
          >
            {mounted && theme === "dark" ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
            <span className="text-[10px] mt-1 text-gray-500 whitespace-nowrap">Theme</span>
          </button>

          <Link href="/pro" className="flex flex-col items-center justify-center cursor-pointer text-amber-600 hover:text-amber-700 group h-full hidden lg:flex">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span className="text-[10px] mt-1 text-gray-500 group-hover:text-amber-600 whitespace-nowrap">{me?.pro?.active ? (me.pro.tier === "premium" ? "Premium" : "Pro") : "Plans"}</span>
          </Link>
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
const SplitsIcon = ({ isActive }: { isActive: boolean }) => isActive ? (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
) : (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
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

const NewslettersIcon = ({ isActive }: { isActive: boolean }) => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={isActive ? 2.4 : 1.8} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
  </svg>
);

const DistributionIcon = ({ isActive }: { isActive: boolean }) => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={isActive ? 2.4 : 1.8} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="2.5" />
    <path strokeLinecap="round" d="M12 3v3M21 12h-3M12 21v-3M3 12h3" />
  </svg>
);

const LicensingIcon = ({ isActive }: { isActive: boolean }) => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={isActive ? 2.4 : 1.8} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7 3h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
  </svg>
);

const SubmitIcon = ({ isActive }: { isActive: boolean }) => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={isActive ? 2.4 : 1.8} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

const BackstageIcon = ({ isActive }: { isActive: boolean }) => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={isActive ? 2.4 : 1.8} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 18h20M3.5 18L2 7l5.5 4L12 4l4.5 7L22 7l-1.5 11" />
  </svg>
);

const PromoteIcon = ({ isActive }: { isActive: boolean }) => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={isActive ? 2.4 : 1.8} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 00-2.9-.1zM12 15l-3-3a22 22 0 012-3.9A12.9 12.9 0 0122 2c0 2.7-.8 7.5-6 11a22.4 22.4 0 01-4 2zM9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5" />
  </svg>
);

const LiveIcon = ({ isActive }: { isActive: boolean }) => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={isActive ? 2.4 : 1.8} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="2.5" fill="#dc2626" stroke="none" />
    <path strokeLinecap="round" d="M7.8 7.8a6 6 0 000 8.4M16.2 7.8a6 6 0 010 8.4M5 5a10 10 0 000 14M19 5a10 10 0 010 14" />
  </svg>
);

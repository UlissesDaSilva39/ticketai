"use client";
import Link from "next/link";
import { Bell, ChevronDown } from "lucide-react";
import { useState } from "react";

const nav = [
  { label: "Home",           href: "/feed" },
  { label: "Discover",       href: "/discover", dropdown: true },
  { label: "Search",         href: "/search" },
  { label: "Artists",        href: "/artists",  dropdown: true },
  { label: "Social",         href: "/social",   dropdown: true },
  { label: "Network",        href: "/network",  dropdown: true },
  { label: "My Tickets",     href: "/tickets" },
  { label: "My artist page", href: "/artist/dj-poxy" },
];

export function TopNav() {
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="topnav">
      <div className="topnav__inner">
        <Link href="/feed" className="topnav__logo">GRID</Link>

        <nav className="topnav__links">
          {nav.map(n => (
            <div key={n.href} style={{ position: "relative" }}>
              {n.dropdown && n.label === "Discover" ? (
                <button className="link" onClick={() => setDiscoverOpen(v => !v)}>
                  {n.label} <ChevronDown size={14} />
                </button>
              ) : (
                <Link href={n.href}>
                  {n.label} {n.dropdown && <ChevronDown size={14} />}
                </Link>
              )}

              {n.label === "Discover" && discoverOpen && (
                <div className="dropdown" onMouseLeave={() => setDiscoverOpen(false)}>
                  <div className="group-label">Discover</div>
                  <Link href="/discover">Events</Link>
                  <Link href="/artists">Artists</Link>
                  <Link href="/venues">Venues</Link>
                  <Link href="/promoters">Promoters</Link>
                  <div className="group-label">Browse</div>
                  <Link href="/discover">Events</Link>
                  <Link href="/opportunities">Opportunities</Link>
                  <Link href="/search">Search</Link>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="topnav__right">
          <button className="icon-btn" aria-label="Notifications"><Bell size={18} /></button>
          <div style={{ position: "relative" }}>
            <button className="avatar-btn" onClick={() => setProfileOpen(v => !v)}>
              <span className="dot">D</span>
              <span className="label">Profile</span>
              <ChevronDown size={14} />
            </button>
            {profileOpen && (
              <div className="dropdown" style={{ right: 0, left: "auto" }} onMouseLeave={() => setProfileOpen(false)}>
                <Link href="/profile">My Profile</Link>
                <Link href="/tickets">My Tickets</Link>
                <Link href="/bookmarks">Bookmarks</Link>
                <Link href="/settings">Settings</Link>
                <Link href="/logout">Log out</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
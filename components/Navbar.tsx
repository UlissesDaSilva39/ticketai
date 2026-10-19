"use client";
import "./Navbar.css";
import { useEffect, useRef, useState } from "react";

type MenuName = "social" | "account" | null;

const SOCIAL_LINKS = [
  { href: "/social/feed",      label: "Feed" },
  { href: "/social/following", label: "Following" },
  { href: "/social/messages",  label: "Messages" },
  { href: "/social/people",    label: "People" },
  { href: "/social/venues",    label: "Venues" },
  { href: "/social/promoters", label: "Promoters" },
];

const ACCOUNT_LINKS = [
  { href: "/profile",    label: "My Profile", badge: "New" as const },
  { href: "/my-tickets", label: "My Tickets" },
  { href: "/bookmarks",  label: "Bookmarks" },
  { href: "/settings",   label: "Settings" },
];

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<MenuName>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenMenu(null);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const toggle = (name: Exclude<MenuName, null>) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenu((cur) => (cur === name ? null : name));
  };

  return (
    <nav className="navbar" ref={navRef} role="navigation" aria-label="Main">
      <a href="/" className="brand">Ticket<span>AI</span></a>

      <ul className="nav-links">
        <li><a href="/discover">Discover</a></li>
        <li><a href="/search">Search</a></li>

        <li className={"dropdown" + (openMenu === "social" ? " open" : "")}>
          <button
            type="button"
            className="dropdown-trigger"
            aria-haspopup="true"
            aria-expanded={openMenu === "social"}
            onClick={toggle("social")}
          >
            Social <span className="caret" aria-hidden="true">&#9660;</span>
          </button>
          <div className="dropdown-menu" role="menu">
            {SOCIAL_LINKS.map((l) => (
              <a key={l.href} href={l.href} role="menuitem">{l.label}</a>
            ))}
          </div>
        </li>

        <li><a href="/my-tickets">My Tickets</a></li>
      </ul>

      <div className="nav-spacer" />

      <div className="nav-right">
        <button type="button" className="icon-btn notif-btn" aria-label="Notifications">
          &#128276;
        </button>

        <div className={"dropdown" + (openMenu === "account" ? " open" : "")}>
          <button
            type="button"
            className="avatar-btn"
            aria-haspopup="true"
            aria-expanded={openMenu === "account"}
            aria-label="Account menu"
            onClick={toggle("account")}
          >
            <span className="avatar-img" aria-hidden="true">JD</span>
            <span className="caret" aria-hidden="true">&#9660;</span>
          </button>
          <div className="dropdown-menu right" role="menu">
            {ACCOUNT_LINKS.map((l) => (
              <a key={l.href} href={l.href} role="menuitem">
                {l.label}
                {l.badge ? <span className="badge-new">{l.badge}</span> : null}
              </a>
            ))}
            <div className="dropdown-divider" role="separator" />
            <a href="/logout" role="menuitem">Log out</a>
          </div>
        </div>
      </div>
    </nav>
  );
}

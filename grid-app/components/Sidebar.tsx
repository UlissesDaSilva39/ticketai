"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Home",            href: "/" },
  { label: "Artists",         href: "/artists" },
  { label: "Search",          href: "/search" },
  { label: "My Tickets",      href: "/tickets" },
  { label: "Friends",         href: "/friends" },
  { label: "Messages",        href: "/messages" },
  { label: "Following",       href: "/following" },
  { label: "Network",         href: "/network" },   // single link, no sub-items
  { label: "Opportunities",   href: "/opportunities" },
  { label: "Dashboard",       href: "/dashboard" },
  { label: "Data Ingestion",  href: "/data-ingestion" },
];

export default function Sidebar() {
  const path = usePathname() || "";
  return (
    <aside className="sidebar">
      <div className="profile">
        <div className="avatar">A</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Alex</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>fan</div>
        </div>
      </div>
      <div className="section">Your Library</div>
      {items.map(it => {
        const active = path === it.href || (it.href !== "/" && path.startsWith(it.href + "/"));
        return (
          <Link key={it.href} href={it.href} className={"item" + (active ? " active" : "")}>
            {it.label}
          </Link>
        );
      })}
    </aside>
  );
}

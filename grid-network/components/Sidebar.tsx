"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { icon: "H", label: "Home", href: "/home" },
  { icon: "C", label: "Campaigns", href: "/campaigns" },
  { icon: "D", label: "Discover Curators", href: "/discover" },
  { icon: "L", label: "My Lists", href: "/lists" },
  { icon: "M", label: "Messages", href: "/messages", badge: 3 },
  { icon: "G", label: "Grooviz", href: "/grooviz", badge: 0 },
  { icon: "B", label: "Dashboard", href: "/dashboard" },
  { icon: "N", label: "Network", href: "/network" },
];

export default function Sidebar() {
  const path = usePathname() || "";
  return (
    <aside className="sidebar">
      <div className="profile">
        <div className="avatar">U</div>
        <div>
          <div className="name">Ulisses</div>
          <div className="role">artist / Brazilian Funk</div>
        </div>
      </div>
      <div className="section">Your Library</div>
      {items.map(it => {
        const active = path === it.href || path.startsWith(it.href + "/");
        return (
          <Link key={it.href} href={it.href} className={"item" + (active ? " active" : "")}>
            <span className="icon">{it.icon}</span>
            <span className="label">{it.label}</span>
            {it.badge ? <span className="badge">{it.badge}</span> : null}
          </Link>
        );
      })}
      <div className="section">Tools</div>
      <Link href="/tracks" className="item"><span className="icon">T</span><span className="label">Track Library</span></Link>
      <Link href="/settings" className="item"><span className="icon">S</span><span className="label">Settings</span></Link>
      <div className="cta">+ Start a campaign</div>
      <div className="upsell">Upgrade to Pro</div>
    </aside>
  );
}

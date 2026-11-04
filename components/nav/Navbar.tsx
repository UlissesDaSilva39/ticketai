"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_GROUPS, isActive, isGroupActive } from "@/lib/nav";

export default function Navbar({ user }: { user?: any }) {
  const pathname = usePathname() || "";
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <nav className="grid-nav">
      <div className="grid-nav-inner">
        <Link href="/" className="grid-nav-logo">GRID</Link>        <div className="grid-nav-groups">
          <Link
            href="/"
            className={"grid-nav-group-btn" + (pathname === "/" ? " active" : "")}
            style={{ height: 40, padding: "0 14px" }}
          >
            <span className="grid-nav-group-icon">H</span>
            <span className="grid-nav-group-label">Home</span>
          </Link>
          {NAV_GROUPS.map(group => (
            <div
              key={group.id}
              className={
                "grid-nav-group" +
                (isGroupActive(pathname, group) ? " active" : "") +
                (openGroup === group.id ? " open" : "")
              }
              onMouseEnter={() => setOpenGroup(group.id)}
              onMouseLeave={() => setOpenGroup(null)}
            >
              <button
                className="grid-nav-group-btn"
                onClick={() => setOpenGroup(openGroup === group.id ? null : group.id)}
              >
                <span className="grid-nav-group-icon">{group.icon}</span>
                <span className="grid-nav-group-label">{group.label}</span>
                <span className="grid-nav-chevron">v</span>
              </button>
              <div className="grid-nav-dropdown">
                {group.items.map(item => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={"grid-nav-item" + (isActive(pathname, item) ? " active" : "")}
                  >
                    <span className="grid-nav-item-icon">{item.icon}</span>
                    <span className="grid-nav-item-body">
                      <span className="grid-nav-item-label">{item.label}</span>
                      <span className="grid-nav-item-desc">{item.description}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="grid-nav-right">
          <span className="grid-nav-role">{user ? "U / artist" : "guest"}</span>
        </div>
      </div>
    </nav>
  );
}

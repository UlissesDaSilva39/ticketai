"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_GROUPS, isGroupActive, NavGroup } from "@/lib/nav";

export default function Navbar() {
  const pathname = usePathname() || "";
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenGroup(null);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenGroup(null);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Close on route change
  useEffect(() => {
    setOpenGroup(null);
  }, [pathname]);

  return (
    <nav className="grid-nav" ref={navRef}>
      <div className="grid-nav-inner">
        <Link href="/" className="grid-nav-logo">GRID</Link>

        <div className="grid-nav-groups">
          {NAV_GROUPS.map(group => (
            <div
              key={group.id}
              className={"grid-nav-group" + (openGroup === group.id ? " open" : "") + (isGroupActive(pathname, group) ? " active" : "")}
            >
              <button
                className="grid-nav-group-btn"
                onClick={() => setOpenGroup(openGroup === group.id ? null : group.id)}
                aria-expanded={openGroup === group.id}
              >
                <span className="grid-nav-group-icon">{group.icon}</span>
                <span className="grid-nav-group-label">{group.label}</span>
                <span className="grid-nav-chevron">▾</span>
              </button>

              {openGroup === group.id && (
                <div className="grid-nav-dropdown">
                  {group.items.map(item => {
                    const active = isActive(pathname, item);
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={"grid-nav-item" + (active ? " active" : "")}
                        onClick={() => setOpenGroup(null)}
                      >
                        <span className="grid-nav-item-icon">{item.icon}</span>
                        <span className="grid-nav-item-body">
                          <span className="grid-nav-item-label">{item.label}</span>
                          <span className="grid-nav-item-desc">{item.description}</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid-nav-right">
          <span className="grid-nav-role">U / artist</span>
        </div>
      </div>
    </nav>
  );
}

// Import isActive from lib/nav
import { isActive } from "@/lib/nav";

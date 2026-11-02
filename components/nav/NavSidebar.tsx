"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, isActive } from "@/lib/nav";

export default function NavSidebar() {
  const pathname = usePathname() || "";
  return (
    <nav className="grid-nav-sidebar" role="navigation" aria-label="Main navigation">
      <div className="grid-nav-brand">
        <Link href="/" className="grid-nav-logo" aria-label="GRID home">GRID</Link>
      </div>
      <ul className="grid-nav-list">
        {NAV_ITEMS.map(item => {
          const active = isActive(pathname, item);
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className={"grid-nav-item" + (active ? " active" : "")}
                aria-current={active ? "page" : undefined}
                title={item.description}
              >
                <span className="grid-nav-icon" aria-hidden="true">{item.icon}</span>
                <span className="grid-nav-label">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="grid-nav-footer">
        <span className="grid-nav-version">GRID v1</span>
      </div>
    </nav>
  );
}


"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, isActive } from "@/lib/nav";

export default function NavBottom() {
  const pathname = usePathname() || "";
  const items = NAV_ITEMS.filter(i => i.mobile);
  return (
    <nav className="grid-nav-bottom" role="navigation" aria-label="Mobile navigation">
      {items.map(item => {
        const active = isActive(pathname, item);
        return (
          <Link
            key={item.id}
            href={item.href}
            className={"grid-nav-bottom-item" + (active ? " active" : "")}
            aria-current={active ? "page" : undefined}
          >
            <span className="grid-nav-bottom-icon" aria-hidden="true">{item.icon}</span>
            <span className="grid-nav-bottom-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}


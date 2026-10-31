"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TABS } from "@/lib/data";

export default function NetworkTabs() {
  const path = usePathname() || "/network";
  return (
    <nav className="network-tabs" role="tablist" aria-label="Network entity types">
      {TABS.map(t => {
        const href = t.slug === "everyone" ? "/network" : `/network/${t.slug}`;
        const active = path === href;
        return (
          <Link key={t.slug} href={href} role="tab" aria-selected={active}
            className={"tab" + (active ? " active" : "")}>
            <span className="icon">{t.icon}</span>{t.label}
          </Link>
        );
      })}
    </nav>
  );
}

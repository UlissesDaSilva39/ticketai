"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { TABS } from "@/lib/data";

export default function NetworkTabs() {
  const path = usePathname() || "/network";
  const params = useSearchParams();
  const current = params.get("tab") || "everyone";

  return (
    <nav className="network-tabs">
      {TABS.map(t => {
        const href = t.slug === "everyone" ? "/network" : `/network?tab=${t.slug}`;
        const active = path === "/network" && current === t.slug;
        return (
          <Link key={t.slug} href={href} className={"tab" + (active ? " active" : "")}>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}

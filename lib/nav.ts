export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: string;
  match: "exact" | "prefix";
  mobile: boolean;
  description: string;
};

export const NAV_ITEMS: NavItem[] = [
  { id: "discover",     label: "Discover",     href: "/discover",     icon: "D", match: "prefix", mobile: true,  description: "Feed, trending, search" },
  { id: "events",       label: "Events",       href: "/events",       icon: "E", match: "prefix", mobile: true,  description: "Listings, event detail, near me" },
  { id: "network",      label: "Network",      href: "/network",      icon: "N", match: "prefix", mobile: true,  description: "People, feed, opportunities, messages" },
  { id: "business",     label: "Business",     href: "/business",     icon: "B", match: "prefix", mobile: false,  description: "Dashboard, promotion, industry, shop, advertise" },
  { id: "distribution", label: "Distribution", href: "/distribution", icon: "X", match: "prefix", mobile: false, description: "Campaigns, links, analytics" },
  { id: "studio",       label: "Studio",       href: "/studio",       icon: "S", match: "prefix", mobile: true,  description: "DAW: record, arrange, mix" },
  { id: "stream", label: "Stream", href: "/stream", icon: "▶", match: "prefix", mobile: true, description: "Video + live broadcast" },
  { id: "meet", label: "Meet", href: "/meet", icon: "◉", match: "prefix", mobile: true, description: "Video meetings" },
  { id: "tracks", label: "Tracks", href: "/tracks", icon: "T", match: "prefix", mobile: true, description: "Buy, sell, collaborate" },
  { id: "my-grid",      label: "My GRID",      href: "/my-grid",      icon: "M", match: "prefix", mobile: true,  description: "Profile, saved, wallet, alerts, royalties" },
];

export function isActive(pathname: string, item: NavItem): boolean {
  if (!pathname) return false;
  if (item.match === "exact") return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}





// ============================================================
// GRID Navigation — grouped, logical structure
// ============================================================

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: string;
  match: "exact" | "prefix";
  mobile: boolean;
  description: string;
};

export type NavGroup = {
  id: string;
  label: string;
  icon: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "discover",
    label: "Discover",
    icon: "◎",
    items: [
      { id: "home",        label: "Home",        href: "/",           icon: "⌂", match: "exact",  mobile: true,  description: "Homepage" },
      { id: "radar",       label: "Radar",       href: "/radar",      icon: "◎", match: "prefix", mobile: true,  description: "Personalized feed" },
      { id: "discover",    label: "Discover",    href: "/discover",   icon: "◈", match: "prefix", mobile: true,  description: "One place to see everything" },
      { id: "stream",      label: "Stream",      href: "/stream",     icon: "▶", match: "prefix", mobile: true,  description: "Video + live broadcast" },
      { id: "events",      label: "Events",      href: "/events",     icon: "◌", match: "prefix", mobile: false, description: "Live events and gigs" },
    ],
  },
  {
    id: "create",
    label: "Create",
    icon: "✎",
    items: [
      { id: "studio",       label: "Studio",       href: "/studio",       icon: "S", match: "prefix", mobile: true,  description: "Record, arrange, mix" },
      { id: "tracks",       label: "Tracks",       href: "/tracks",       icon: "T", match: "prefix", mobile: true,  description: "Buy, sell, collaborate" },
      { id: "distribution", label: "Distribution", href: "/distribution", icon: "↗", match: "prefix", mobile: false, description: "Release to 150+ platforms" },
      { id: "records",      label: "Records",      href: "/records",      icon: "R", match: "prefix", mobile: true,  description: "Virtual record label" },
      { id: "playlists",    label: "Playlists",    href: "/playlists",    icon: "▤", match: "prefix", mobile: false, description: "Cross-platform playlists" },
    ],
  },
  {
    id: "connect",
    label: "Connect",
    icon: "◉",
    items: [
      { id: "network",  label: "Network",  href: "/network",  icon: "N", match: "prefix", mobile: true,  description: "People, feed, opportunities" },
      { id: "meet",     label: "Meet",     href: "/meet",     icon: "◉", match: "prefix", mobile: true,  description: "Video meetings" },
      { id: "artists",  label: "Artists",  href: "/artists",  icon: "♪", match: "prefix", mobile: false, description: "Artist profiles and catalog" },
      { id: "social",   label: "Social",   href: "/social",   icon: "◍", match: "prefix", mobile: false, description: "Social feed and posts" },
    ],
  },
  {
    id: "business",
    label: "Business",
    icon: "▦",
    items: [
      { id: "business",  label: "Business",  href: "/business",  icon: "▦", match: "prefix", mobile: false, description: "Promoter and venue tools" },
      { id: "industry",  label: "Industry",  href: "/industry",  icon: "▣", match: "prefix", mobile: false, description: "Industry news and jobs" },
      { id: "advertise", label: "Advertise", href: "/advertise", icon: "✦", match: "prefix", mobile: false, description: "Advertise on GRID" },
      { id: "shop",      label: "Shop",      href: "/shop",      icon: "◇", match: "prefix", mobile: false, description: "Merch and physical" },
    ],
  },
  {
    id: "my-grid",
    label: "My GRID",
    icon: "M",
    items: [
      { id: "profile",    label: "Profile",     href: "/profile",         icon: "M", match: "prefix", mobile: true,  description: "Your profile" },
      { id: "royalties",  label: "Royalties",   href: "/royalties",       icon: "£", match: "prefix", mobile: true,  description: "Track earnings" },
      { id: "purchases",  label: "Purchases",   href: "/tracks/purchases", icon: "▤", match: "prefix", mobile: false, description: "Your purchases" },
      { id: "projects",   label: "My Projects", href: "/studio/projects", icon: "◫", match: "prefix", mobile: false, description: "Studio projects" },
      { id: "settings",   label: "Settings",    href: "/settings",        icon: "⚙", match: "prefix", mobile: false, description: "Account settings" },
    ],
  },
];

// Flat list for mobile bottom nav (only essential items)
export const MOBILE_NAV: NavItem[] = [
  { id: "home",     label: "Home",     href: "/",        icon: "⌂", match: "exact",  mobile: true, description: "Homepage" },
  { id: "discover", label: "Discover", href: "/discover", icon: "◈", match: "prefix", mobile: true, description: "Discover" },
  { id: "stream",   label: "Stream",   href: "/stream",   icon: "▶", match: "prefix", mobile: true, description: "Stream" },
  { id: "network",  label: "Network",  href: "/network",  icon: "N", match: "prefix", mobile: true, description: "Network" },
  { id: "my-grid",  label: "My GRID",  href: "/profile",  icon: "M", match: "prefix", mobile: true, description: "My GRID" },
];

// Flat list for legacy code that iterates NAV_ITEMS
export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap(g => g.items);

export function isActive(pathname: string, item: NavItem): boolean {
  if (!pathname) return false;
  if (item.match === "exact") return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

export function isGroupActive(pathname: string, group: NavGroup): boolean {
  return group.items.some(item => isActive(pathname, item));
}

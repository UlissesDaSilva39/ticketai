// GRID nav — safe ASCII icons (no emoji, no encoding issues)

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
    icon: "D",
    items: [
      { id: "discover", label: "Discover", href: "/discover", icon: "D", match: "prefix", mobile: true, description: "Explore everything" },
      { id: "radar", label: "Radar", href: "/radar", icon: "R", match: "prefix", mobile: true, description: "Personalized feed" },
      { id: "stream", label: "Stream", href: "/stream", icon: "S", match: "prefix", mobile: true, description: "Video + live" },
      { id: "radio", label: "Radio", href: "/radio", icon: "R", match: "prefix", mobile: true, description: "Live 24/7 radio" },
    ],
  },
  {
    id: "create",
    label: "Create",
    icon: "C",
    items: [
      { id: "studio", label: "Studio", href: "/studio", icon: "S", match: "prefix", mobile: true, description: "Record, arrange, mix" },
      { id: "tracks", label: "Tracks", href: "/tracks", icon: "T", match: "prefix", mobile: true, description: "Buy, sell, collaborate" },
      { id: "records", label: "Records", href: "/records", icon: "R", match: "prefix", mobile: true, description: "Virtual record label" },
      { id: "distribution", label: "Distribution", href: "/distribution", icon: "D", match: "prefix", mobile: false, description: "Release to 150+ platforms" },
    ],
  },
  {
    id: "connect",
    label: "Connect",
    icon: "N",
    items: [
      { id: "network", label: "Network", href: "/network", icon: "N", match: "prefix", mobile: true, description: "People, feed, opportunities" },
      { id: "meet", label: "Meet", href: "/meet", icon: "M", match: "prefix", mobile: true, description: "Video meetings" },
      { id: "playlists", label: "Playlists", href: "/playlists", icon: "P", match: "prefix", mobile: false, description: "Cross-platform playlists" },
    ],
  },
  {
    id: "business",
    label: "Business",
    icon: "B",
    items: [
      { id: "business", label: "Business", href: "/business", icon: "B", match: "prefix", mobile: false, description: "Tools for promoters and venues" },
    ],
  },
  {
    id: "my-grid",
    label: "My GRID",
    icon: "M",
    items: [
      { id: "profile", label: "Profile", href: "/profile", icon: "M", match: "prefix", mobile: true, description: "Your profile" },
      { id: "royalties", label: "Royalties", href: "/royalties", icon: "£", match: "prefix", mobile: true, description: "Track earnings" },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap(g => g.items);
export const MOBILE_NAV: NavItem[] = NAV_ITEMS.filter(i => i.mobile);

export function isActive(pathname: string, item: NavItem): boolean {
  if (!pathname) return false;
  if (item.match === "exact") return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

export function isGroupActive(pathname: string, group: NavGroup): boolean {
  return group.items.some(item => isActive(pathname, item));
}

// GRID - Canonical Navigation Config
// Exactly 7 top-level items. My Tickets + My artist page live in ProfileMenu only.

export type NavRole = 'user' | 'artist' | 'promoter' | 'venue' | 'admin' | 'guest';

export type NavSubItem = { label: string; href: string; description?: string };
export type NavSection = { title: string; items: NavSubItem[] };

export type NavItem = {
  key: string;
  label: string;
  href: string;
  dropdown?: keyof typeof DROPDOWN_MAP;
  auth?: NavRole[];
};

export const PRIMARY_NAV: NavItem[] = [
  { key: 'home',          label: 'Home',          href: '/' },
  { key: 'discover',      label: 'Discover',      href: '/discover',      dropdown: 'discover' },
  { key: 'search',        label: 'Search',        href: '/search' },
  { key: 'artists',       label: 'Artists',       href: '/artists',       dropdown: 'artists' },
  { key: 'social',        label: 'Social',        href: '/feed',          dropdown: 'social' },
  { key: 'network',       label: 'Network',       href: '/network',       dropdown: 'network' },
  { key: 'opportunities', label: 'Opportunities', href: '/opportunities' },
];

export const DROPDOWN_MAP = {
  discover: {
    sections: [
      {
        title: 'Browse',
        items: [
          { label: 'Overview',  href: '/discover' },
          { label: 'Artists',   href: '/discover/artists' },
          { label: 'Venues',    href: '/discover/venues' },
          { label: 'Events',    href: '/discover/events' },
        ],
      },
      {
        title: 'More',
        items: [
          { label: 'Promoters', href: '/discover/promoters' },
          { label: 'Festivals', href: '/discover/festivals' },
          { label: 'Labels',    href: '/discover/labels' },
        ],
      },
    ],
  },
  artists: {
    sections: [
      {
        title: 'By Type',
        items: [
          { label: 'All Artists', href: '/artists' },
          { label: 'DJs',         href: '/artists?type=dj' },
          { label: 'Producers',   href: '/artists?type=producer' },
          { label: 'Vocalists',   href: '/artists?type=vocalist' },
          { label: 'Bands',       href: '/artists?type=band' },
        ],
      },
    ],
  },
  social: {
    sections: [
      {
        title: 'Your Feed',
        items: [
          { label: 'Feed',        href: '/feed' },
          { label: 'Following',   href: '/following' },
          { label: 'Connections', href: '/connections' },
          { label: 'Messages',    href: '/messages' },
        ],
      },
    ],
  },
  network: {
    sections: [
      {
        title: 'Network',
        items: [
          { label: 'Overview',  href: '/network' },
          { label: 'People',    href: '/people' },
          { label: 'Artists',   href: '/network?tab=artists' },
          { label: 'Promoters', href: '/network?tab=promoters' },
          { label: 'Venues',    href: '/network?tab=venues' },
        ],
      },
    ],
  },
} as const;

// My Tickets + My artist page live HERE - not in top bar.
export const PROFILE_MENU = [
  { label: 'Profile',         href: '/profile' },
  { label: 'My artist page',  href: '/artist/dashboard' },
  { label: 'My Tickets',      href: '/my-tickets' },
  { label: 'Settings',        href: '/settings' },
  { label: 'Log out',         href: '/auth/signout' },
];

export function navForRole(role: NavRole): NavItem[] {
  return PRIMARY_NAV.filter((item) => !item.auth || item.auth.includes(role));
}

export const NAV_LINKS  = PRIMARY_NAV;
export const NAV_ITEMS  = PRIMARY_NAV;
export const NAV_CONFIG = { primary: PRIMARY_NAV, dropdowns: DROPDOWN_MAP, profile: PROFILE_MENU };

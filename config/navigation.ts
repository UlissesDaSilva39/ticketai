export const PRIMARY_NAV = [
  { key: 'home',        label: 'Home',           href: '/',           auth: 'any'  },
  { key: 'search',      label: 'Search',         href: '/search',     auth: 'any'  },
  { key: 'artists',     label: 'Artists',        href: '/artists',    auth: 'any',  dropdown: 'artists' },
  { key: 'social',      label: 'Social',         href: '/feed',       auth: 'user', dropdown: 'social' },
  { key: 'network',     label: 'Network',        href: '/network',    auth: 'user', dropdown: 'network' },
  { key: 'tickets',     label: 'My Tickets',     href: '/my-tickets', auth: 'user' },
  { key: 'artist-page', label: 'My artist page', href: '/artist',     auth: 'user' },
] as const;

export const ARTISTS_DROPDOWN = {
  sections: [
    { title: 'ARTISTS', items: [
      { label: 'All Artists',           href: '/artists' },
      { label: 'DJs',                   href: '/artists?type=dj' },
      { label: 'Producers',             href: '/artists?type=producer' },
      { label: 'Vocalists',             href: '/artists?type=vocalist' },
      { label: 'Bands',                 href: '/artists?type=band' },
    ]},
    { title: 'DISCOVER', items: [
      { label: 'Trending Artists',      href: '/artists?sort=trending' },
      { label: 'New Releases',          href: '/artists?sort=new' },
    ]},
  ],
} as const;

export const SOCIAL_DROPDOWN = {
  sections: [
    { title: 'SOCIAL', items: [
      { label: 'Feed',        href: '/feed' },
      { label: 'Friends',     href: '/friends' },
      { label: 'Messages',    href: '/messages' },
      { label: 'People',      href: '/people' },
      { label: 'Notifications', href: '/notifications' },
    ]},
    { title: 'MY SOCIAL', items: [
      { label: 'My Profile',  href: '/profile' },
      { label: 'Following',   href: '/following' },
    ]},
  ],
} as const;

export const NETWORK_DROPDOWN = {
  sections: [
    { title: 'NETWORK', items: [
      { label: 'People',     href: '/people' },
      { label: 'Artists',    href: '/artists' },
      { label: 'Promoters',  href: '/promoters' },
      { label: 'Venues',     href: '/venues' },
    ]},
    { title: 'OPPORTUNITIES', items: [
      { label: 'All Opportunities', href: '/opportunities' },
      { label: 'Gigs',              href: '/opportunities?type=gig' },
      { label: 'Jobs',              href: '/opportunities?type=job' },
      { label: 'Collaborations',    href: '/opportunities?type=collab' },
      { label: 'Festivals',         href: '/opportunities?type=festival' },
    ]},
    { title: 'MY NETWORK', items: [
      { label: 'Connections',   href: '/connections' },
      { label: 'Following',     href: '/following' },
      { label: 'Messages',      href: '/messages' },
      { label: 'Notifications', href: '/notifications' },
    ]},
  ],
} as const;

export const DROPDOWN_MAP = {
  artists: ARTISTS_DROPDOWN,
  social:  SOCIAL_DROPDOWN,
  network: NETWORK_DROPDOWN,
} as const;

export const PROFILE_MENU = {
  header: {
    name: 'Ulisses Da Silva',
    subtitle: 'Music Entrepreneur · Producer',
  },
  sections: [
    { title: 'MY GRID', items: [
      { label: 'My Profile',      href: '/profile' },
      { label: 'My Artist Page',  href: '/artist' },
      { label: 'My Tickets',      href: '/my-tickets' },
      { label: 'Following',       href: '/following' },
      { label: 'Friends',         href: '/friends' },
      { label: 'Messages',        href: '/messages' },
      { label: 'Notifications',   href: '/notifications' },
    ]},
    { title: 'SWITCH TO BUSINESS', items: [
      { label: 'Organizer',           href: '/organizer' },
      { label: 'Promoter',            href: '/promoter/dashboard' },
      { label: 'Venue',               href: '/venue/dashboard' },
      { label: 'Artist / Management', href: '/artist' },
    ]},
  ],
  footer: [
    { label: 'Settings', href: '/settings' },
    { label: 'Sign out', href: '/auth/signout' },
  ],
} as const;


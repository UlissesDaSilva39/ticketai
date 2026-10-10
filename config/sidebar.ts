export const SIDEBAR_LIBRARY = [
  { section: 'main', items: [
    { icon: 'home',   label: 'Home',    href: '/' },
    { icon: 'mic',    label: 'Artists', href: '/artists' },
    { icon: 'search', label: 'Search',  href: '/search' },
  ]},
  { section: 'library', items: [
    { icon: 'ticket',   label: 'My Tickets', href: '/my-tickets' },
    { icon: 'users',    label: 'Friends',    href: '/friends' },
    { icon: 'message',  label: 'Messages',   href: '/messages' },
    { icon: 'bookmark', label: 'Following',  href: '/following' },
  ]},
  { section: 'grid', items: [
    { icon: 'globe',   label: 'Network',       href: '/network' },
    { icon: 'sparkle', label: 'Opportunities', href: '/opportunities' },
    { icon: 'chart',   label: 'Dashboard',     href: '/organizer' },
  ]},
] as const;

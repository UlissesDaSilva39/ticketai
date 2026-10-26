export type IndustrySubLink = { label: string; href: string };
export type IndustryNavColumn = {
  category: string;
  categoryHref: string;
  label: string;
  description: string;
  links: IndustrySubLink[];
};

export const INDUSTRY_NAV_COLUMNS: IndustryNavColumn[] = [
  {
    category: 'artists',
    categoryHref: '/industry/artists',
    label: 'Artists',
    description: 'Performers, creators, songwriters',
    links: [
      { label: 'Find Artists',     href: '/industry/artists/artist' },
      { label: 'Find DJs',         href: '/industry/artists/dj' },
      { label: 'Find Producers',   href: '/industry/artists/producer' },
      { label: 'Find Vocalists',   href: '/industry/artists/vocalist' },
      { label: 'Find Bands',       href: '/industry/artists/band' },
      { label: 'Find Songwriters', href: '/industry/artists/songwriter' },
    ],
  },
  {
    category: 'live-production',
    categoryHref: '/industry/live-production',
    label: 'Live Production',
    description: 'Crew running the show',
    links: [
      { label: 'Sound Engineers',  href: '/industry/live-production/sound-engineer' },
      { label: 'Lighting Design',  href: '/industry/live-production/lighting-designer' },
      { label: 'Backline Techs',   href: '/industry/live-production/backline-tech' },
      { label: 'Stage Managers',   href: '/industry/live-production/stage-manager' },
      { label: 'Tour Managers',    href: '/industry/live-production/tour-manager' },
      { label: 'Production Mgmt',  href: '/industry/live-production/production-manager' },
    ],
  },
  {
    category: 'booking',
    categoryHref: '/industry/booking',
    label: 'Booking & Mgmt',
    description: 'Career, tours, contracts',
    links: [
      { label: 'Promoters',        href: '/industry/booking/promoter' },
      { label: 'Booking Agents',   href: '/industry/booking/booking-agent' },
      { label: 'Artist Managers',  href: '/industry/booking/artist-manager' },
      { label: 'Event Organizers', href: '/industry/booking/event-organizer' },
      { label: 'Talent Buyers',    href: '/industry/booking/talent-buyer' },
    ],
  },
  {
    category: 'venues',
    categoryHref: '/industry/venues',
    label: 'Venues',
    description: 'Spaces, clubs, festivals',
    links: [
      { label: 'Find Venues',    href: '/industry/venues/venue' },
      { label: 'Venue Managers', href: '/industry/venues/venue-manager' },
      { label: 'Venue Bookers',  href: '/industry/venues/venue-booker' },
      { label: 'Club Owners',    href: '/industry/venues/club-owner' },
    ],
  },
  {
    category: 'labels',
    categoryHref: '/industry/labels',
    label: 'Labels & Rights',
    description: 'Record, publish, distribute',
    links: [
      { label: 'Record Companies', href: '/industry/labels/record-company' },
      { label: 'A&R',              href: '/industry/labels/a-and-r' },
      { label: 'Label Managers',   href: '/industry/labels/label-manager' },
      { label: 'Publishers',       href: '/industry/labels/publisher' },
      { label: 'Distributors',     href: '/industry/labels/distributor' },
    ],
  },
  {
    category: 'media',
    categoryHref: '/industry/media',
    label: 'Media & Content',
    description: 'Photos, video, press',
    links: [
      { label: 'Photographers',    href: '/industry/media/photographer' },
      { label: 'Videographers',    href: '/industry/media/videographer' },
      { label: 'Journalists',      href: '/industry/media/journalist' },
      { label: 'Content Creators', href: '/industry/media/content-creator' },
      { label: 'Radio Hosts',      href: '/industry/media/radio-host' },
    ],
  },
  {
    category: 'creative',
    categoryHref: '/industry/creative',
    label: 'Creative',
    description: 'Design, art, brand',
    links: [
      { label: 'Graphic Design', href: '/industry/creative/graphic-designer' },
      { label: 'Visual Artists', href: '/industry/creative/visual-artist' },
      { label: 'Merch Design',   href: '/industry/creative/merch-designer' },
      { label: 'Web Design',     href: '/industry/creative/web-designer' },
    ],
  },
  {
    category: 'services',
    categoryHref: '/industry/services',
    label: 'Services',
    description: 'Security, hospitality, merch',
    links: [
      { label: 'Security',      href: '/industry/services/security' },
      { label: 'Hospitality',   href: '/industry/services/hospitality' },
      { label: 'Drivers',       href: '/industry/services/driver' },
      { label: 'Merch Sellers', href: '/industry/services/merch-seller' },
      { label: 'Fans',          href: '/industry/services/fan' },
    ],
  },
];

export const INDUSTRY_QUICK_ACTIONS = [
  { label: 'Browse all services', href: '/industry', icon: '🔥' },
  { label: 'Post a job',          href: '/industry/post-job', icon: '⚡' },
  { label: 'Build a rider',       href: '/rider', icon: '📝' },
];

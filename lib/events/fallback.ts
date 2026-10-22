export type DiscoverEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  venueSlug: string;
  city: string;
  price: number;
  banner: string;
  verified: boolean;
  friendsGoing: number;
  urgent: string;
  artists?: { slug: string; name: string; verified?: boolean }[];
  promoter?: { slug: string; name: string } | null;
  membershipUrl?: string | null;
  ageRestriction?: string | null;
  featured?: boolean;
  capacity?: number;
};

export const FALLBACK_FEATURED: DiscoverEvent[] = [
  {
    id: 'f1', title: 'Paper Lions Jazz Night', date: 'Tue, 3 Nov', time: '19:16',
    venue: 'The Blue Note', venueSlug: 'the-blue-note', city: 'London', price: 25,
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
    verified: true, friendsGoing: 12, urgent: '87% sold',
    artists: [
      { slug: 'paper-lions', name: 'Paper Lions', verified: true },
      { slug: 'nightshift-collective', name: 'Nightshift Collective', verified: true },
    ],
    promoter: { slug: 'nightshift-presents', name: 'Nightshift Presents' },
    membershipUrl: '/clubs/promoter/nightshift-presents', featured: true,
  },
  {
    id: 'f2', title: 'Basement Collective Presents', date: 'Mon, 2 Nov', time: '17:16',
    venue: 'Test 15%', venueSlug: 'test-15', city: 'London', price: 20,
    banner: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?q=80&w=800&auto=format&fit=crop',
    verified: true, friendsGoing: 8, urgent: 'Selling fast',
    artists: [
      { slug: 'dj-proxy', name: 'DJ Proxy', verified: true },
      { slug: 'analog-dreams', name: 'Analog Dreams', verified: true },
    ],
    promoter: { slug: 'basement-collective', name: 'Basement Collective' },
    membershipUrl: '/promoters/basement-collective/join', featured: true,
  },
];

export const FALLBACK_ALL: DiscoverEvent[] = [
  { id: '1', title: 'Analog Dreams Live', date: 'Sat, 24 Oct', time: '18:16',
    venue: 'Test - First Venue', venueSlug: 'test-first-venue', city: 'London', price: 16,
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
    verified: true, friendsGoing: 3, urgent: 'Only 15 tickets left',
    artists: [{ slug: 'analog-dreams', name: 'Analog Dreams', verified: true }, { slug: 'alice-waves', name: 'Alice Waves', verified: true }],
    promoter: { slug: 'nightshift-presents', name: 'Nightshift Presents' } },
  { id: '2', title: 'Alice Waves Live', date: 'Tue, 27 Oct', time: '17:16',
    venue: 'The Blue Note', venueSlug: 'the-blue-note', city: 'London', price: 14,
    banner: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?q=80&w=800&auto=format&fit=crop',
    verified: true, friendsGoing: 5, urgent: '',
    artists: [{ slug: 'alice-waves', name: 'Alice Waves', verified: true }], promoter: null },
  { id: '3', title: 'Voice Records Crew Live', date: 'Thu, 29 Oct', time: '17:16',
    venue: 'Test 15%', venueSlug: 'test-15', city: 'London', price: 12,
    banner: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop',
    verified: false, friendsGoing: 4, urgent: '',
    artists: [{ slug: 'nightshift-collective', name: 'Nightshift Collective', verified: true }], promoter: null },
  { id: '4', title: 'Concrete Garden Live', date: 'Thu, 29 Oct', time: '17:16',
    venue: 'Test 15%', venueSlug: 'test-15', city: 'London', price: 16,
    banner: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=800&auto=format&fit=crop',
    verified: true, friendsGoing: 2, urgent: '',
    artists: [{ slug: 'analog-dreams', name: 'Analog Dreams', verified: true }], promoter: null },
  { id: '5', title: 'Bobby Beats Garage Night', date: 'Sat, 31 Oct', time: '17:16',
    venue: 'Test - First Venue', venueSlug: 'test-first-venue', city: 'London', price: 15,
    banner: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop',
    verified: false, friendsGoing: 0, urgent: '',
    artists: [{ slug: 'bobby-beats', name: 'Bobby Beats', verified: false }], promoter: null },
  { id: '6', title: 'Ulisses Da Silva Live', date: 'Fri, 6 Nov', time: '17:16',
    venue: 'Test 15%', venueSlug: 'test-15', city: 'London', price: 22,
    banner: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=800&auto=format&fit=crop',
    verified: true, friendsGoing: 5, urgent: '',
    artists: [{ slug: 'nightshift-collective', name: 'Nightshift Collective', verified: true }], promoter: null },
];
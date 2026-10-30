export type Artist = {
  id: string;
  name: string;
  initials: string;
  city: string;
  genres: string;
  verified: boolean;
  rating: string;
  reviews: number;
  listeners: string;
  banner: string;
  availability: 'Available for UK/EU Tour (Nov-Dec)' | 'Limited availability' | 'Fully booked';
  status: 'green' | 'yellow' | 'red';
  spotlightTrack: string;
  popularTracks: string[];
  pastShows: string[];
};

export const ARTISTS: Artist[] = [
  {
    id: 'dj-poxy',
    name: 'DJ Poxy',
    initials: 'DP',
    city: 'London',
    genres: 'House / Techno',
    verified: true,
    rating: '4.9',
    reviews: 42,
    listeners: '150k',
    banner: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop',
    availability: 'Available for UK/EU Tour (Nov-Dec)',
    status: 'green',
    spotlightTrack: 'Midnight Sessions (Latest)',
    popularTracks: ['Neon London', 'After Hours', 'Static Love'],
    pastShows: ['Basement 44 (Sold Out)', 'Warehouse Project', 'Printworks London'],
  },
  {
    id: 'amelia-grant',
    name: 'Amelia Grant',
    initials: 'AG',
    city: 'Dublin',
    genres: 'Soul / R&B',
    verified: true,
    rating: '4.8',
    reviews: 28,
    listeners: '85k',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
    availability: 'Limited availability',
    status: 'yellow',
    spotlightTrack: 'Late Night Session',
    popularTracks: ['Falling', 'Echoes', 'Over You'],
    pastShows: ['The Jazz Cafe', 'Village Underground'],
  },
  {
    id: 'tide-and-time',
    name: 'Tide & Time',
    initials: 'TT',
    city: 'London',
    genres: 'Pop Rock',
    verified: false,
    rating: '4.5',
    reviews: 12,
    listeners: '30k',
    banner: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1200&auto=format&fit=crop',
    availability: 'Fully booked',
    status: 'red',
    spotlightTrack: 'New Horizons',
    popularTracks: ['Waves', 'Runaway'],
    pastShows: ['O2 Academy Islington'],
  },
];

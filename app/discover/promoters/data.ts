export const CITIES = ['London', 'Manchester', 'Birmingham', 'Berlin', 'Paris', 'New York'];
export const GENRES = ['All', 'Techno', 'House', 'DnB', 'Jazz', 'Indie'];

export type Promoter = {
  id: string;
  initials: string;
  name: string;
  verified: boolean;
  city: string;
  desc: string;
  since: string;
  events: number;
  rating: string;
  reviews: number;
  merch: boolean;
  status: 'green' | 'yellow' | 'red';
  next: string;
  banner: string;
};

export const PROMOTERS: Promoter[] = [
  { id: '1', initials: 'AD', name: 'Amsterdam Dance Events', verified: true, city: 'Amsterdam', desc: 'ADE regulars and year-round parties.', since: '2021', events: 12, rating: '4.8', reviews: 12, merch: true, status: 'green', next: 'Warehouse · 15 Nov', banner: 'https://images.unsplash.com/photo-1574154893626-3b6e6f6dc55c?q=80&w=1200&auto=format&fit=crop' },
  { id: '2', initials: 'BB', name: 'Brighton Beats', verified: true, city: 'Brighton', desc: 'Seafront parties and summer festivals.', since: '2022', events: 9, rating: '4.6', reviews: 8, merch: false, status: 'red', next: 'Pier Party · 22 Nov', banner: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1200&auto=format&fit=crop' },
  { id: '3', initials: 'BU', name: 'Bristol Underground', verified: true, city: 'Bristol', desc: "The best of Bristol's underground scene.", since: '2019', events: 15, rating: '4.9', reviews: 21, merch: true, status: 'green', next: 'Basement · 8 Nov', banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop' },
  { id: '4', initials: 'DA', name: 'Drum and Bass Nation', verified: true, city: 'Bristol', desc: "The UK's largest DnB promoters.", since: '2018', events: 28, rating: '4.7', reviews: 43, merch: true, status: 'yellow', next: 'DnB Night · 12 Nov', banner: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop' },
  { id: '5', initials: 'EE', name: 'East End Promotions', verified: true, city: 'London', desc: 'Shoreditch and Hackney events.', since: '2020', events: 22, rating: '4.5', reviews: 19, merch: false, status: 'green', next: 'Shoreditch · 9 Nov', banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop' },
  { id: '6', initials: 'EE', name: 'Electronic Europe', verified: true, city: 'Amsterdam', desc: 'Pan-European electronic events.', since: '2017', events: 19, rating: '4.8', reviews: 31, merch: true, status: 'yellow', next: 'Euro Tour · 20 Nov', banner: 'https://images.unsplash.com/photo-1574154893626-3b6e6f6dc55c?q=80&w=1200&auto=format&fit=crop' },
  { id: '7', initials: 'NP', name: 'Nightshift Presents', verified: true, city: 'London', desc: "London's premiere underground events since 2019.", since: '2019', events: 24, rating: '4.9', reviews: 52, merch: true, status: 'green', next: 'Nightshift · 16 Nov', banner: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop' },
  { id: '8', initials: 'PN', name: 'Paris Nocturne', verified: true, city: 'Paris', desc: 'French electronic music events.', since: '2021', events: 16, rating: '4.6', reviews: 14, merch: false, status: 'red', next: 'Nocturne · 14 Nov', banner: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1200&auto=format&fit=crop' },
  { id: '9', initials: 'TN', name: 'Techno Nation', verified: true, city: 'London', desc: 'UK-wide techno events.', since: '2016', events: 31, rating: '4.8', reviews: 67, merch: true, status: 'green', next: 'Techno All · 10 Nov', banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop' },
  { id: '10', initials: 'WS', name: 'Warehouse Sessions', verified: true, city: 'Berlin', desc: 'Berlin warehouse parties and industrial raves.', since: '2019', events: 18, rating: '4.7', reviews: 22, merch: false, status: 'green', next: 'Warehouse · 18 Nov', banner: 'https://images.unsplash.com/photo-1574154893626-3b6e6f6dc55c?q=80&w=1200&auto=format&fit=crop' },
];

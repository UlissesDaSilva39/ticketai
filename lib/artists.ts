export type Track = {
  id: string;
  title: string;
  genre: string;
  duration: string;
  plays: number;
  previewUrl: string;
};

export type Service = {
  label: string;
  price: string;
  description?: string;
  popular?: boolean;
  turnaround?: string;
};

export type Review = {
  quote: string;
  name: string;
  role: string;
  rating?: number;
  date?: string;
  verified?: boolean;
};

export type Credit = {
  title: string;
  role: string;
  year?: string;
};

export type Artist = {
  id: string;
  userId: string;
  slug: string;
  name: string;
  city: string;
  timezone?: string;
  bio: string;
  verified?: boolean;
  role: string;
  genres: string[];
  key: string;
  bookingCount: number;
  placements: number;
  photos: string[];
  longBio?: string;
  available?: boolean;
  followers?: number;
  trackCount?: number;
  playCount?: number;
  responseTime?: string;
  memberSince?: string;
  earnedTotal?: string;
  tracks?: Track[];
  services?: Service[];
  reviews?: Review[];
  credits?: Credit[];
  featuredDemo?: {
    slug: string;
    title: string;
    key: string;
    role: string;
    genre: string;
    rate: string;
    previewUrl: string;
  };
  social: {
    instagram?: string;
    tiktok?: string;
    soundcloud?: string;
    spotify?: string;
    appleMusic?: string;
    website?: string;
  };
};

export async function getArtists(): Promise<Artist[]> {
  return [
    {
      id: 'a_00', userId: 'au_00', slug: 'elenapetrova',
      name: 'Elena Petrova', city: 'Paris', timezone: 'GMT+1',
      bio: 'A&R with classical crossover focus.',
      verified: true, role: 'A&R',
      genres: ['Classical', 'Crossover'], key: 'Cm',
      bookingCount: 12, placements: 8,
      photos: ['/img/p1.jpg'],
      longBio:
        'Elena Petrova is an A&R with a classical crossover focus, working with composers, orchestrators, and vocalists on film, TV, and album projects.\n\nShe specialises in bridging the classical and contemporary worlds — string arrangements over electronic production, operatic vocals in pop contexts, and orchestral scoring for sync.\n\nBased in Paris since 2018, she has placed work with Netflix, BBC, and multiple independent labels across Europe.',
      available: true, followers: 0,
      trackCount: 3, playCount: 35,
      responseTime: '~2 hours',
      memberSince: 'Oct 2026',
      earnedTotal: '£3,400',
      tracks: [
        {
          id: 't1', title: 'A&R Demo Reel · Classical Crossover',
          genre: 'Classical', duration: '12:30', plays: 18,
          previewUrl: '/audio/elena-demo-1.mp3',
        },
        {
          id: 't2', title: 'String Arrangement Sampler',
          genre: 'Orchestral', duration: '6:42', plays: 12,
          previewUrl: '/audio/elena-demo-2.mp3',
        },
        {
          id: 't3', title: 'Sync Placement Demo — Film & TV',
          genre: 'Cinematic', duration: '8:05', plays: 5,
          previewUrl: '/audio/elena-demo-3.mp3',
        },
      ],
      services: [
        {
          label: 'A&R consultation',
          price: '£150 / hour',
          description: '45-minute call + written feedback on your release plan.',
          turnaround: '3-day turnaround',
        },
        {
          label: 'Full album A&R',
          price: '£3,000 / project',
          description: 'End-to-end A&R across 10-14 tracks — direction, sequencing, session support.',
          turnaround: '4-12 weeks',
          popular: true,
        },
        {
          label: 'Sync licensing advice',
          price: '£250 / session',
          description: '60-minute session on pitching your catalogue to sync supervisors.',
          turnaround: 'Next-day booking',
        },
        {
          label: 'Artist development',
          price: '£450 / month',
          description: 'Ongoing mentorship — release strategy, industry intros, quarterly reviews.',
          turnaround: '3-month minimum',
        },
      ],
      reviews: [
        {
          quote:
            "Elena opened doors I couldn't reach. She transformed my release strategy and helped me secure three sync placements in one quarter.",
          name: 'Marcus K.', role: 'Composer · London',
          rating: 5, date: '2 weeks ago', verified: true,
        },
        {
          quote:
            'Clear, professional, and fast. Got my album placed on a Netflix doc in six weeks. Highly recommended.',
          name: 'Nova R.', role: 'Producer · Berlin',
          rating: 5, date: '1 month ago', verified: true,
        },
      ],
      credits: [
        { title: 'Netflix documentary — Original Score', role: 'A&R', year: '2026' },
        { title: 'Aurora Kid — Debut Album', role: 'A&R, sequencing', year: '2025' },
        { title: 'BBC Radio 3 — Late Junction', role: 'Session direction', year: '2025' },
        { title: 'Blue Tower Records — Sync Catalogue Vol. 1', role: 'Curation', year: '2024' },
      ],
      social: { instagram: 'elenapetrova', website: 'elenapetrova.com' },
    },
    {
      id: 'a_01', userId: 'au_01', slug: 'aaliyah-j',
      name: 'Aaliyah J.', city: 'London', timezone: 'GMT',
      bio: 'R&B singer. Hookwriter. 4 chart features.',
      verified: true, role: 'Singer',
      genres: ['R&B', 'Pop'], key: 'Am',
      bookingCount: 24, placements: 8, followers: 124,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      social: { instagram: 'aaliyahj', tiktok: 'aaliyahj', spotify: 'aaliyahj' },
    },
    {
      id: 'a_02', userId: 'au_02', slug: 'marcus-k',
      name: 'Marcus K.', city: 'Manchester', timezone: 'GMT',
      bio: 'Rapper and topliner. Drill, grime, and hip-hop.',
      verified: true, role: 'Rapper',
      genres: ['Drill', 'Grime'], key: 'Cm',
      bookingCount: 42, placements: 15, followers: 89,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      social: { instagram: 'marcusk', tiktok: 'marcusk' },
    },
    {
      id: 'a_03', userId: 'au_03', slug: 'nova-rae',
      name: 'Nova Rae', city: 'Berlin', timezone: 'GMT+1',
      bio: 'Pop topliner. Syncs with Netflix, ad campaigns.',
      verified: true, role: 'Topliner',
      genres: ['Pop', 'Electronic'], key: 'F',
      bookingCount: 31, placements: 19, followers: 203,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      social: { instagram: 'novarae', spotify: 'novarae' },
    },
  ];
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  const all = await getArtists();
  return all.find((a) => a.slug === slug) ?? null;
}

export async function getRelatedArtists(slug: string): Promise<Artist[]> {
  const all = await getArtists();
  const self = all.find((a) => a.slug === slug);
  if (!self) return [];

  const others = all.filter((a) => a.slug !== slug);

  // Primary: same role or shared genre
  const primary = others.filter(
    (a) => a.role === self.role || a.genres?.some((g) => self.genres?.includes(g))
  );

  // Fallback: fill with the first N others so the section never renders empty
  const combined = [...primary];
  for (const o of others) {
    if (combined.length >= 3) break;
    if (!combined.includes(o)) combined.push(o);
  }

  return combined.slice(0, 3);
}
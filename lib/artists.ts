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
};

export type Review = {
  quote: string;
  name: string;
  role: string;
  rating?: number;
};

export type Artist = {
  id: string;
  userId: string;
  slug: string;
  name: string;
  city: string;
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
  tracks?: Track[];
  services?: Service[];
  reviews?: Review[];
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
  };
};

export async function getArtists(): Promise<Artist[]> {
  return [
    {
      id: 'a_00', userId: 'au_00', slug: 'elenapetrova',
      name: 'Elena Petrova', city: 'Paris',
      bio: 'A&R with classical crossover focus.',
      verified: true, role: 'A&R',
      genres: ['Classical', 'Crossover'], key: 'Cm',
      bookingCount: 0, placements: 0,
      photos: ['/img/p1.jpg'],
      longBio:
        'Elena Petrova is an A&R with a classical crossover focus, working with composers, orchestrators, and vocalists on film, TV, and album projects. She specialises in bridging the classical and contemporary worlds — string arrangements over electronic production, operatic vocals in pop contexts, and orchestral scoring for sync.',
      available: true, followers: 0,
      trackCount: 3, playCount: 35,
      responseTime: '~2 hours',
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
        { label: 'A&R consultation',      price: '£150 / hour' },
        { label: 'Full album A&R',        price: '£3,000 / project' },
        { label: 'Sync licensing advice', price: '£250 / session' },
        { label: 'Artist development',    price: '£450 / month' },
      ],
      reviews: [
        {
          quote:
            "Elena opened doors I couldn't reach. She transformed my release strategy and helped me secure three sync placements in one quarter.",
          name: 'Marcus K.', role: 'Composer · London', rating: 5,
        },
        {
          quote:
            'Clear, professional, and fast. Got my album placed on a Netflix doc in six weeks. Highly recommended.',
          name: 'Nova R.', role: 'Producer · Berlin', rating: 5,
        },
      ],
      social: { instagram: 'elenapetrova' },
    },
    {
      id: 'a_01', userId: 'au_01', slug: 'aaliyah-j',
      name: 'Aaliyah J.', city: 'London',
      bio: 'R&B singer. Hookwriter. 4 chart features.',
      verified: true, role: 'Singer',
      genres: ['R&B', 'Pop'], key: 'Am',
      bookingCount: 24, placements: 8,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      featuredDemo: {
        slug: 'golden-hour', title: 'Golden Hour',
        key: 'Am', role: 'Singer', genre: 'R&B',
        rate: 'Hook £180', previewUrl: '/audio/goldenhour.mp3',
      },
      social: { instagram: 'aaliyahj', tiktok: 'aaliyahj', spotify: 'aaliyahj' },
    },
    {
      id: 'a_02', userId: 'au_02', slug: 'marcus-k',
      name: 'Marcus K.', city: 'Manchester',
      bio: 'Rapper and topliner. Drill, grime, and hip-hop.',
      verified: true, role: 'Rapper',
      genres: ['Drill', 'Grime'], key: 'Cm',
      bookingCount: 42, placements: 15,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      featuredDemo: {
        slug: 'northern-flow', title: 'Northern Flow',
        key: 'Cm', role: 'Rapper', genre: 'Drill',
        rate: 'Verse £280', previewUrl: '/audio/northernflow.mp3',
      },
      social: { instagram: 'marcusk', tiktok: 'marcusk', soundcloud: 'marcusk' },
    },
    {
      id: 'a_03', userId: 'au_03', slug: 'nova-rae',
      name: 'Nova Rae', city: 'Berlin',
      bio: 'Pop topliner. Syncs with Netflix, ad campaigns.',
      verified: true, role: 'Topliner',
      genres: ['Pop', 'Electronic'], key: 'F',
      bookingCount: 31, placements: 19,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      featuredDemo: {
        slug: 'aurora', title: 'Aurora',
        key: 'F', role: 'Topliner', genre: 'Pop',
        rate: 'Feature £450', previewUrl: '/audio/aurora.mp3',
      },
      social: { instagram: 'novarae', tiktok: 'novarae', spotify: 'novarae' },
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
  return all
    .filter((a) => a.slug !== slug)
    .filter((a) => a.role === self.role || a.genres?.some((g) => self.genres?.includes(g)))
    .slice(0, 3);
}
export type DjMix = {
  id: string;
  title: string;
  duration: string;
  plays: number;
  previewUrl: string;
  price?: string;
};

export type DjResidency = {
  venue: string;
  city: string;
  status: string;
  years: string;
};

export type DjRate = {
  label: string;
  price: string;
  description?: string;
  popular?: boolean;
  isCustomQuote?: boolean;
};

export type DjReview = {
  quote: string;
  name: string;
  role: string;
  rating?: number;
  date?: string;
};

export type Dj = {
  slug: string;
  name: string;
  city: string;
  timezone?: string;
  bio: string;
  longBio?: string;
  verified?: boolean;
  genres: string[];
  gigCount: number;
  mixPlays: number;
  mixCount: number;
  earnedTotal?: string;
  responseTime?: string;
  djSince?: string;
  photos: string[];
  mixes?: DjMix[];
  nextSets?: { date: string; venue: string; city: string; setTime: string; ticketUrl: string }[];
  nextSet?: { date: string; venue: string; city: string; setTime: string; ticketUrl: string };
  residencies?: DjResidency[];
  rates?: DjRate[];
  reviews?: DjReview[];
  style?: string;
  tier?: string;
  draw?: string;
  ticketsSold?: number;
  membership?: {
    tier: string;
    price: string;
    perks: string[];
    url: string;
  };
  social: {
    instagram?: string;
    soundcloud?: string;
    mixcloud?: string;
    spotify?: string;
    tiktok?: string;
  };
};

export type DJ = Dj;

export async function getDjs(): Promise<Dj[]> {
  return [
    {
      slug: 'dj-proxy',
      name: 'DJ Proxy',
      city: 'London',
      timezone: 'GMT',
      bio: 'House and tech-house. 12-year Fabric resident.',
      longBio: 'DJ Proxy has been a resident at Fabric since 2014, playing house and tech-house across three rooms.',
      verified: true,
      genres: ['House', 'Techno', 'Deep House'],
      gigCount: 48,
      mixPlays: 42000,
      mixCount: 240,
      earnedTotal: '12000',
      responseTime: '~2 hours',
      djSince: '2014',
      photos: ['/img/p1.jpg'],
      mixes: [
        { id: 'm1', title: 'PROXY 034', duration: '1:24:00', plays: 18000, previewUrl: '/audio/proxy-034.mp3', price: '5' },
        { id: 'm2', title: 'PROXY 033', duration: '2:12:00', plays: 24000, previewUrl: '/audio/proxy-033.mp3', price: '5' },
      ],
      nextSets: [
        { date: 'Sat 18 Oct', venue: 'Fabric', city: 'London', setTime: '1:00am', ticketUrl: '/events/proxy-1018' },
      ],
      residencies: [
        { venue: 'Fabric', city: 'London', status: 'Resident', years: '2014-present' },
      ],
      rates: [
        { label: 'Club night', price: '800', description: 'Fabric, Printworks, or your venue' },
        { label: 'Extended set', price: '1400', description: 'All-night-long booking', popular: true },
      ],
      social: { instagram: 'djproxy', soundcloud: 'djproxy' },
    },
  ];
}

export async function getDJs(): Promise<Dj[]> {
  return getDjs();
}

export async function getDjBySlug(slug: string): Promise<Dj | null> {
  const all = await getDjs();
  return all.find((d) => d.slug === slug) ?? null;
}
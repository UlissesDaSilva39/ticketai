export type PromoterEvent = {
  slug: string;
  title: string;
  date: string;
  venue: string;
  priceFrom: string;
};

export type VenueWorked = {
  slug: string;
  name: string;
  capacity: number;
  deal: string;
  photo?: string;
};

export type PromoterReview = {
  quote: string;
  name: string;
  role: string;
  rating?: number;
  date?: string;
};

export type Promoter = {
  id?: string;
  userId?: string;
  slug: string;
  name: string;
  city: string;
  timezone?: string;
  bio: string;
  longBio?: string;
  verified?: boolean;
  genres: string[];
  eventCount: number;
  ticketsSold: number;
  avgFill?: number;
  runningSince?: string;
  responseTime?: string;
  photos: string[];
  nextEvent?: PromoterEvent;
  upcomingEvents?: PromoterEvent[];
  venuesWorked?: VenueWorked[];
  residentDjs?: { slug: string; name: string; city: string; role: string }[];
  reviews?: PromoterReview[];
  social: {
    instagram?: string;
    website?: string;
    tiktok?: string;
    youtube?: string;
  };
  demoSubmissionUrl?: string;
};

export async function getPromoters(): Promise<Promoter[]> {
  return [
    {
      slug: 'nightshift-presents',
      name: 'Nightshift Presents',
      city: 'London',
      timezone: 'GMT',
      bio: 'Underground events since 2019.',
      longBio: 'Rachel Sterling has been running club nights in London since 2016.',
      verified: true,
      genres: ['House', 'Techno', 'Garage'],
      eventCount: 47,
      ticketsSold: 12400,
      avgFill: 92,
      runningSince: '2019',
      responseTime: '~4 hours',
      photos: ['/img/p1.jpg'],
      nextEvent: {
        slug: 'nightshift-1024',
        title: 'NIGHTSHIFT 24',
        date: 'Fri 24 Oct',
        venue: 'Fabric',
        priceFrom: 'From 25',
      },
      upcomingEvents: [
        { slug: 'nightshift-halloween', title: 'Nightshift Halloween', date: 'Sat 26 Oct', venue: 'Fabric', priceFrom: 'From 30' },
        { slug: 'nightshift-nye', title: 'Nightshift NYE', date: 'Tue 31 Dec', venue: 'Printworks', priceFrom: 'From 45' },
      ],
      venuesWorked: [
        { slug: 'fabric', name: 'Fabric', capacity: 1600, deal: 'Bar split' },
        { slug: 'printworks', name: 'Printworks', capacity: 5000, deal: 'Bar split' },
      ],
      residentDjs: [
        { slug: 'dj-proxy', name: 'DJ Proxy', city: 'London', role: 'House' },
      ],
      reviews: [
        { quote: 'Great nights.', name: 'DJ Proxy', role: 'London', rating: 5, date: '2 weeks ago' },
      ],
      social: { instagram: 'nightshiftpresents', website: 'nightshift.london' },
      demoSubmissionUrl: '/promoters/nightshift-presents/demo',
    },
    {
      slug: 'fresh-talent-uk',
      name: 'Fresh Talent UK',
      city: 'London',
      bio: 'Breaking new artists.',
      verified: true,
      genres: ['Indie', 'Rock'],
      eventCount: 12,
      ticketsSold: 3400,
      photos: ['/img/p1.jpg'],
      social: { instagram: 'freshtalentuk' },
    },
  ];
}

export async function getPromoterBySlug(slug: string): Promise<Promoter | null> {
  const all = await getPromoters();
  return all.find((p) => p.slug === slug) ?? null;
}
export type Promoter = {
  id: string;
  userId: string;
  slug: string;
  name: string;
  city: string;
  bio: string;
  verified?: boolean;
  eventCount: number;
  ticketsSold: number;
  photos: string[];
  nextEvent?: {
    slug: string;
    title: string;
    date: string;
    venue: string;
    priceFrom: string;
  };
  social: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
};

export async function getPromoters(): Promise<Promoter[]> {
  return [
    {
      id: 'p_01', userId: 'u_01', slug: 'fresh-talent-uk',
      name: 'Fresh Talent UK', city: 'London',
      bio: 'Breaking new artists into the scene.',
      verified: true, eventCount: 12, ticketsSold: 3400,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      nextEvent: {
        slug: 'fresh-talent-1018', title: 'Fresh Talent Showcase',
        date: 'Sat 18 Oct', venue: 'The Dome', priceFrom: 'From £15',
      },
      social: { instagram: 'freshtalentuk', tiktok: 'freshtalentuk', youtube: 'freshtalentuk' },
    },
    {
      id: 'p_02', userId: 'u_02', slug: 'nightshift-presents',
      name: 'Nightshift Presents', city: 'London',
      bio: "London's premiere underground events since 2019.",
      verified: true, eventCount: 47, ticketsSold: 12000,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      nextEvent: {
        slug: 'nightshift-1024', title: 'Nightshift 24',
        date: 'Fri 24 Oct', venue: 'Fabric', priceFrom: 'From £25',
      },
      social: { instagram: 'nightshiftpresents', tiktok: 'nightshiftpres', youtube: 'nightshiftpres' },
    },
    {
      id: 'p_03', userId: 'u_03', slug: 'warehouse-sessions',
      name: 'Warehouse Sessions', city: 'Berlin',
      bio: 'Berlin warehouse parties and industrial raves.',
      eventCount: 22, ticketsSold: 8100,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      nextEvent: {
        slug: 'warehouse-1102', title: 'Warehouse 12',
        date: 'Sat 2 Nov', venue: 'Kraftwerk', priceFrom: 'From EUR 20',
      },
      social: { instagram: 'warehousesessions', tiktok: 'warehousesessions', youtube: 'warehousesessions' },
    },
    {
      id: 'p_04', userId: 'u_04', slug: 'brighton-beats',
      name: 'Brighton Beats', city: 'Brighton',
      bio: 'Seafront parties and summer festivals.',
      eventCount: 8, ticketsSold: 2100,
      photos: ['/img/p1.jpg'],
      nextEvent: {
        slug: 'brighton-1030', title: 'Seafront Sessions',
        date: 'Thu 30 Oct', venue: 'Concorde 2', priceFrom: 'From £18',
      },
      social: { instagram: 'brightonbeats', tiktok: 'brightonbeats', youtube: 'brightonbeats' },
    },
    {
      id: 'p_05', userId: 'u_05', slug: 'northern-lights-live',
      name: 'Northern Lights Live', city: 'Manchester',
      bio: 'Manchester live music events.',
      eventCount: 15, ticketsSold: 4200,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      nextEvent: {
        slug: 'northern-1026', title: 'Northern Lights',
        date: 'Sun 26 Oct', venue: 'Band on the Wall', priceFrom: 'From £12',
      },
      social: { instagram: 'northernlights', tiktok: 'northernlights', youtube: 'northernlights' },
    },
    {
      id: 'p_06', userId: 'u_06', slug: 'bristol-underground',
      name: 'Bristol Underground', city: 'Bristol',
      bio: "The best of Bristol's underground scene.",
      eventCount: 19, ticketsSold: 5600,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      nextEvent: {
        slug: 'bristol-1101', title: 'Motion',
        date: 'Sat 1 Nov', venue: 'Motion', priceFrom: 'From £20',
      },
      social: { instagram: 'bristolunderground', tiktok: 'bristolug', youtube: 'bristolug' },
    },
    {
      id: 'p_07', userId: 'u_07', slug: 'glasgow-sound-collective',
      name: 'Glasgow Sound Collective', city: 'Glasgow',
      bio: 'Scottish independent promoter.',
      eventCount: 11, ticketsSold: 2800,
      photos: ['/img/p1.jpg'],
      nextEvent: {
        slug: 'glasgow-1108', title: 'Sound Collective 08',
        date: 'Fri 8 Nov', venue: 'SWG3', priceFrom: 'From £16',
      },
      social: { instagram: 'glasgowsound', tiktok: 'glasgowsound', youtube: 'glasgowsound' },
    },
    {
      id: 'p_08', userId: 'u_08', slug: 'paris-nocturne',
      name: 'Paris Nocturne', city: 'Paris',
      bio: 'French electronic music events.',
      eventCount: 14, ticketsSold: 3900,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      nextEvent: {
        slug: 'paris-1115', title: 'Nocturne 15',
        date: 'Fri 15 Nov', venue: 'Rex Club', priceFrom: 'From EUR 22',
      },
      social: { instagram: 'parisnocturne', tiktok: 'parisnocturne', youtube: 'parisnocturne' },
    },
    {
      id: 'p_09', userId: 'u_09', slug: 'amsterdam-dance-events',
      name: 'Amsterdam Dance Events', city: 'Amsterdam',
      bio: 'ADE regulars and year-round parties.',
      verified: true, eventCount: 31, ticketsSold: 9500,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      nextEvent: {
        slug: 'ade-1017', title: 'ADE Opening Night',
        date: 'Thu 17 Oct', venue: 'Shelter', priceFrom: 'From EUR 28',
      },
      social: { instagram: 'amsterdamdance', tiktok: 'amsterdamdance', youtube: 'amsterdamdance' },
    },
    {
      id: 'p_10', userId: 'u_10', slug: 'barcelona-beats',
      name: 'Barcelona Beats', city: 'Barcelona',
      bio: 'Mediterranean electronic festivals.',
      eventCount: 9, ticketsSold: 2400,
      photos: ['/img/p1.jpg'],
      nextEvent: {
        slug: 'barcelona-1122', title: 'Mediterranean Nights',
        date: 'Fri 22 Nov', venue: 'Razzmatazz', priceFrom: 'From EUR 25',
      },
      social: { instagram: 'barcelonabeats', tiktok: 'barcelonabeats', youtube: 'barcelonabeats' },
    },
    {
      id: 'p_11', userId: 'u_11', slug: 'dublin-nightlife',
      name: 'Dublin Nightlife', city: 'Dublin',
      bio: 'Irish club culture and events.',
      eventCount: 13, ticketsSold: 3100,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      nextEvent: {
        slug: 'dublin-1109', title: 'Dublin Nights',
        date: 'Sat 9 Nov', venue: 'Index', priceFrom: 'From EUR 20',
      },
      social: { instagram: 'dublinnightlife', tiktok: 'dublinnightlife', youtube: 'dublinnightlife' },
    },
    {
      id: 'p_12', userId: 'u_12', slug: 'leeds-live',
      name: 'Leeds Live', city: 'Leeds',
      bio: 'Yorkshire music events and gigs.',
      eventCount: 10, ticketsSold: 2300,
      photos: ['/img/p1.jpg'],
      nextEvent: {
        slug: 'leeds-1102', title: 'Leeds Live Session',
        date: 'Sat 2 Nov', venue: 'Brudenell Social Club', priceFrom: 'From £14',
      },
      social: { instagram: 'leedslive', tiktok: 'leedslive', youtube: 'leedslive' },
    },
    {
      id: 'p_13', userId: 'u_13', slug: 'east-end-promotions',
      name: 'East End Promotions', city: 'London',
      bio: 'Shoreditch and Hackney events.',
      eventCount: 24, ticketsSold: 6700,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      nextEvent: {
        slug: 'eastend-1025', title: 'East End All-Nighter',
        date: 'Fri 25 Oct', venue: 'Village Underground', priceFrom: 'From £22',
      },
      social: { instagram: 'eastendpromo', tiktok: 'eastendpromo', youtube: 'eastendpromo' },
    },
    {
      id: 'p_14', userId: 'u_14', slug: 'jazz-at-the-loft',
      name: 'Jazz at the Loft', city: 'London',
      bio: 'Intimate jazz nights.',
      eventCount: 36, ticketsSold: 4200,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      nextEvent: {
        slug: 'jazzloft-1023', title: 'Late Set: Trio Nights',
        date: 'Wed 23 Oct', venue: 'The Loft', priceFrom: 'From £18',
      },
      social: { instagram: 'jazzloft', tiktok: 'jazzloft', youtube: 'jazzloft' },
    },
    {
      id: 'p_15', userId: 'u_15', slug: 'techno-nation',
      name: 'Techno Nation', city: 'London',
      bio: 'UK-wide techno events.',
      verified: true, eventCount: 41, ticketsSold: 14500,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      nextEvent: {
        slug: 'technonation-1101', title: 'Techno Nation 11',
        date: 'Sat 1 Nov', venue: 'Printworks', priceFrom: 'From £35',
      },
      social: { instagram: 'technonation', tiktok: 'technonation', youtube: 'technonation' },
    },
    {
      id: 'p_16', userId: 'u_16', slug: 'house-party-collective',
      name: 'House Party Collective', city: 'Manchester',
      bio: 'House music promoters.',
      eventCount: 17, ticketsSold: 5100,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      nextEvent: {
        slug: 'houseparty-1026', title: 'House Party 06',
        date: 'Sat 26 Oct', venue: 'Hidden', priceFrom: 'From £20',
      },
      social: { instagram: 'housepartyco', tiktok: 'housepartyco', youtube: 'housepartyco' },
    },
    {
      id: 'p_17', userId: 'u_17', slug: 'folk-and-roots-uk',
      name: 'Folk and Roots UK', city: 'Bristol',
      bio: 'Folk, roots and acoustic events.',
      eventCount: 7, ticketsSold: 1600,
      photos: ['/img/p1.jpg'],
      nextEvent: {
        slug: 'folkroots-1115', title: 'Roots Night',
        date: 'Fri 15 Nov', venue: 'Thekla', priceFrom: 'From £12',
      },
      social: { instagram: 'folkrootsuk', tiktok: 'folkrootsuk', youtube: 'folkrootsuk' },
    },
    {
      id: 'p_18', userId: 'u_18', slug: 'shoegaze-sundays',
      name: 'Shoegaze Sundays', city: 'Birmingham',
      bio: 'Alternative and shoegaze nights.',
      eventCount: 6, ticketsSold: 1200,
      photos: ['/img/p1.jpg'],
      nextEvent: {
        slug: 'shoegaze-1027', title: 'Shoegaze Sundays #42',
        date: 'Sun 27 Oct', venue: 'Hare & Hounds', priceFrom: 'From £10',
      },
      social: { instagram: 'shoegazesun', tiktok: 'shoegazesun', youtube: 'shoegazesun' },
    },
    {
      id: 'p_19', userId: 'u_19', slug: 'drum-and-bass-nation',
      name: 'Drum and Bass Nation', city: 'Bristol',
      bio: "The UK's largest DnB promoters.",
      verified: true, eventCount: 38, ticketsSold: 18900,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      nextEvent: {
        slug: 'dnb-1102', title: 'DnB Nation 11',
        date: 'Sat 2 Nov', venue: 'Motion', priceFrom: 'From £28',
      },
      social: { instagram: 'dnnation', tiktok: 'dnnation', youtube: 'dnnation' },
    },
    {
      id: 'p_20', userId: 'u_20', slug: 'electronic-europe',
      name: 'Electronic Europe', city: 'Amsterdam',
      bio: 'Pan-European electronic events.',
      eventCount: 21, ticketsSold: 6200,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      nextEvent: {
        slug: 'electroniceu-1116', title: 'Europe Unite',
        date: 'Sat 16 Nov', venue: 'Melkweg', priceFrom: 'From EUR 24',
      },
      social: { instagram: 'electroniceu', tiktok: 'electroniceu', youtube: 'electroniceu' },
    },
    {
      id: 'p_21', userId: 'u_21', slug: 'dj-proxy',
      name: 'DJ Proxy', city: 'London',
      bio: 'Best DJ in town.',
      eventCount: 5, ticketsSold: 900,
      photos: ['/img/p1.jpg'],
      nextEvent: {
        slug: 'djproxy-1109', title: 'Proxy Night',
        date: 'Sat 9 Nov', venue: 'The Cause', priceFrom: 'From £15',
      },
      social: { instagram: 'djproxy', tiktok: 'djproxy', youtube: 'djproxy' },
    },
  ];
}
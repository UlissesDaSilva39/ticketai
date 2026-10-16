export type DJ = {
  id: string;
  userId: string;
  slug: string;
  name: string;
  city: string;
  bio: string;
  verified?: boolean;
  style: string;             // 'House' | 'Techno' | 'DnB' | 'Disco' | 'Hip-Hop' | ...
  tier: string;              // 'Resident' | 'Headliner' | 'International'
  draw: string;              // '<100' | '100-500' | '500-1000' | '1000+'
  gigCount: number;
  ticketsSold: number;
  photos: string[];
  nextSet?: {
    slug: string;
    venue: string;
    city: string;
    date: string;
    setTime: string;
    feeFrom: string;
  };
  social: {
    instagram?: string;
    soundcloud?: string;
    spotify?: string;
    mixcloud?: string;
  };
};

export async function getDJs(): Promise<DJ[]> {
  return [
    {
      id: 'd_01', userId: 'du_01', slug: 'dj-proxy',
      name: 'DJ Proxy', city: 'London',
      bio: 'House and tech-house. 12-year Fabric resident.',
      verified: true, style: 'House', tier: 'Headliner', draw: '1000+',
      gigCount: 48, ticketsSold: 14200,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      nextSet: {
        slug: 'djproxy-1018', venue: 'Fabric', city: 'London',
        date: 'Sat 18 Oct', setTime: '1:00am', feeFrom: 'From £800',
      },
      social: { instagram: 'djproxy', soundcloud: 'djproxy', spotify: 'djproxy', mixcloud: 'djproxy' },
    },
    {
      id: 'd_02', userId: 'du_02', slug: 'nightshift-nina',
      name: 'Nightshift Nina', city: 'Manchester',
      bio: 'Techno resident at Hidden. Warehouse specialist.',
      verified: true, style: 'Techno', tier: 'Headliner', draw: '500-1000',
      gigCount: 42, ticketsSold: 11800,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      nextSet: {
        slug: 'nina-1024', venue: 'Hidden', city: 'Manchester',
        date: 'Fri 24 Oct', setTime: '12:00am', feeFrom: 'From £700',
      },
      social: { instagram: 'nightshiftnina', soundcloud: 'nightshiftnina', tiktok: 'nightshiftnina' },
    },
    {
      id: 'd_03', userId: 'du_03', slug: 'berlin-bass',
      name: 'Berlin Bass', city: 'Berlin',
      bio: 'Industrial techno. Berghain regular.',
      verified: true, style: 'Industrial Techno', tier: 'International', draw: '1000+',
      gigCount: 55, ticketsSold: 22400,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      nextSet: {
        slug: 'berlinbass-1102', venue: 'Kraftwerk', city: 'Berlin',
        date: 'Sat 2 Nov', setTime: '2:00am', feeFrom: 'From EUR 1500',
      },
      social: { instagram: 'berlinbass', soundcloud: 'berlinbass', spotify: 'berlinbass' },
    },
    {
      id: 'd_04', userId: 'du_04', slug: 'soul-selector',
      name: 'Soul Selector', city: 'London',
      bio: 'Soul, funk, and boogie. Vinyl-only sets.',
      style: 'Disco', tier: 'Resident', draw: '100-500',
      gigCount: 28, ticketsSold: 5600,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      nextSet: {
        slug: 'soulselector-1023', venue: 'The Loft', city: 'London',
        date: 'Wed 23 Oct', setTime: '9:00pm', feeFrom: 'From £350',
      },
      social: { instagram: 'soulselector', soundcloud: 'soulselector', mixcloud: 'soulselector' },
    },
    {
      id: 'd_05', userId: 'du_05', slug: 'selecta-jade',
      name: 'Selecta Jade', city: 'London',
      bio: 'DnB and jungle. Liquid specialist.',
      verified: true, style: 'DnB', tier: 'Headliner', draw: '1000+',
      gigCount: 44, ticketsSold: 15600,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      nextSet: {
        slug: 'jade-1101', venue: 'Printworks', city: 'London',
        date: 'Sat 1 Nov', setTime: '1:30am', feeFrom: 'From £900',
      },
      social: { instagram: 'selectajade', soundcloud: 'selectajade', spotify: 'selectajade' },
    },
    {
      id: 'd_06', userId: 'du_06', slug: 'acid-amy',
      name: 'Acid Amy', city: 'Manchester',
      bio: 'Acid house and 303 worship. Vinyl only.',
      style: 'Acid House', tier: 'Headliner', draw: '500-1000',
      gigCount: 38, ticketsSold: 9800,
      photos: ['/img/p1.jpg'],
      nextSet: {
        slug: 'acidamy-1026', venue: 'Band on the Wall', city: 'Manchester',
        date: 'Sun 26 Oct', setTime: '10:00pm', feeFrom: 'From £650',
      },
      social: { instagram: 'acidamy', soundcloud: 'acidamy', spotify: 'acidamy' },
    },
    {
      id: 'd_07', userId: 'du_07', slug: 'glasgow-groove',
      name: 'Glasgow Groove', city: 'Glasgow',
      bio: 'Disco and boogie. All-night-long specialist.',
      style: 'Disco', tier: 'Resident', draw: '100-500',
      gigCount: 27, ticketsSold: 5400,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      nextSet: {
        slug: 'glasgowgroove-1108', venue: 'SWG3', city: 'Glasgow',
        date: 'Fri 8 Nov', setTime: '11:30pm', feeFrom: 'From £450',
      },
      social: { instagram: 'glasgowgroove', soundcloud: 'glasgowgroove', mixcloud: 'glasgowgroove' },
    },
    {
      id: 'd_08', userId: 'du_08', slug: 'paris-pulse',
      name: 'Paris Pulse', city: 'Paris',
      bio: 'French house and filter disco.',
      style: 'House', tier: 'Headliner', draw: '500-1000',
      gigCount: 36, ticketsSold: 10200,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      nextSet: {
        slug: 'parispulse-1115', venue: 'Rex Club', city: 'Paris',
        date: 'Fri 15 Nov', setTime: '1:00am', feeFrom: 'From EUR 800',
      },
      social: { instagram: 'parispulse', soundcloud: 'parispulse', spotify: 'parispulse' },
    },
    {
      id: 'd_09', userId: 'du_09', slug: 'amsterdam-ade',
      name: 'Amsterdam ADE', city: 'Amsterdam',
      bio: 'Melodic techno. ADE mainstage regular.',
      verified: true, style: 'Melodic Techno', tier: 'International', draw: '1000+',
      gigCount: 52, ticketsSold: 19800,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      nextSet: {
        slug: 'ade-1017', venue: 'Shelter', city: 'Amsterdam',
        date: 'Thu 17 Oct', setTime: '3:00am', feeFrom: 'From EUR 1200',
      },
      social: { instagram: 'amsterdamade', soundcloud: 'amsterdamade', spotify: 'amsterdamade' },
    },
    {
      id: 'd_10', userId: 'du_10', slug: 'barcelona-sunset',
      name: 'Barcelona Sunset', city: 'Barcelona',
      bio: 'Balearic house and sunset sets.',
      style: 'House', tier: 'Headliner', draw: '500-1000',
      gigCount: 29, ticketsSold: 8100,
      photos: ['/img/p1.jpg'],
      nextSet: {
        slug: 'barcelonasunset-1122', venue: 'Razzmatazz', city: 'Barcelona',
        date: 'Fri 22 Nov', setTime: '12:00am', feeFrom: 'From EUR 700',
      },
      social: { instagram: 'barcelonasunset', soundcloud: 'barcelonasunset', spotify: 'barcelonasunset' },
    },
    {
      id: 'd_11', userId: 'du_11', slug: 'dublin-dub',
      name: 'Dublin Dub', city: 'Dublin',
      bio: 'Dub techno and ambient sets.',
      style: 'Techno', tier: 'Resident', draw: '100-500',
      gigCount: 21, ticketsSold: 4200,
      photos: ['/img/p1.jpg'],
      nextSet: {
        slug: 'dublindub-1109', venue: 'Index', city: 'Dublin',
        date: 'Sat 9 Nov', setTime: '11:00pm', feeFrom: 'From EUR 450',
      },
      social: { instagram: 'dublindub', soundcloud: 'dublindub', mixcloud: 'dublindub' },
    },
    {
      id: 'd_12', userId: 'du_12', slug: 'leeds-liquid',
      name: 'Leeds Liquid', city: 'Leeds',
      bio: 'Liquid DnB and rollers.',
      style: 'DnB', tier: 'Headliner', draw: '500-1000',
      gigCount: 34, ticketsSold: 9600,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      nextSet: {
        slug: 'leedsliquid-1102', venue: 'Brudenell', city: 'Leeds',
        date: 'Sat 2 Nov', setTime: '12:30am', feeFrom: 'From £600',
      },
      social: { instagram: 'leedsliquid', soundcloud: 'leedsliquid', spotify: 'leedsliquid' },
    },
    {
      id: 'd_13', userId: 'du_13', slug: 'east-end-selecta',
      name: 'East End Selecta', city: 'London',
      bio: 'Grime and UK drill. Radio regular.',
      verified: true, style: 'Hip-Hop', tier: 'Headliner', draw: '500-1000',
      gigCount: 41, ticketsSold: 12400,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      nextSet: {
        slug: 'eastendselecta-1025', venue: 'Village Underground', city: 'London',
        date: 'Fri 25 Oct', setTime: '11:30pm', feeFrom: 'From £750',
      },
      social: { instagram: 'eastendselecta', soundcloud: 'eastendselecta', spotify: 'eastendselecta' },
    },
    {
      id: 'd_14', userId: 'du_14', slug: 'jazz-on-wax',
      name: 'Jazz on Wax', city: 'London',
      bio: 'Jazz-funk, soul, and rare groove. Vinyl only.',
      style: 'Jazz', tier: 'Resident', draw: '100-500',
      gigCount: 46, ticketsSold: 5800,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      nextSet: {
        slug: 'jazzonwax-1023', venue: 'The Loft', city: 'London',
        date: 'Wed 23 Oct', setTime: '9:00pm', feeFrom: 'From £350',
      },
      social: { instagram: 'jazzonwax', soundcloud: 'jazzonwax', mixcloud: 'jazzonwax' },
    },
    {
      id: 'd_15', userId: 'du_15', slug: 'techno-nation-dj',
      name: 'Techno Nation', city: 'London',
      bio: 'Hard techno. Festival main stage regular.',
      verified: true, style: 'Techno', tier: 'International', draw: '1000+',
      gigCount: 49, ticketsSold: 18200,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      nextSet: {
        slug: 'technonation-1101', venue: 'Printworks', city: 'London',
        date: 'Sat 1 Nov', setTime: '2:00am', feeFrom: 'From £1200',
      },
      social: { instagram: 'technonationdj', soundcloud: 'technonationdj', spotify: 'technonationdj' },
    },
    {
      id: 'd_16', userId: 'du_16', slug: 'house-party-dj',
      name: 'House Party', city: 'Manchester',
      bio: 'Deep house and minimal. Warmup specialist.',
      style: 'House', tier: 'Resident', draw: '100-500',
      gigCount: 32, ticketsSold: 6100,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      nextSet: {
        slug: 'houseparty-1026', venue: 'Hidden', city: 'Manchester',
        date: 'Sat 26 Oct', setTime: '10:00pm', feeFrom: 'From £450',
      },
      social: { instagram: 'housepartydj', soundcloud: 'housepartydj', mixcloud: 'housepartydj' },
    },
    {
      id: 'd_17', userId: 'du_17', slug: 'folk-roots-dj',
      name: 'Folk & Roots', city: 'Bristol',
      bio: 'World music, folk, and roots selections.',
      style: 'Folk', tier: 'Resident', draw: '<100',
      gigCount: 14, ticketsSold: 2200,
      photos: ['/img/p1.jpg'],
      nextSet: {
        slug: 'folkroots-1115', venue: 'Thekla', city: 'Bristol',
        date: 'Fri 15 Nov', setTime: '8:00pm', feeFrom: 'From £250',
      },
      social: { instagram: 'folkrootsdj', soundcloud: 'folkrootsdj', mixcloud: 'folkrootsdj' },
    },
    {
      id: 'd_18', userId: 'du_18', slug: 'shoegaze-sundays-dj',
      name: 'Shoegaze Sundays', city: 'Birmingham',
      bio: 'Shoegaze, dream-pop, and post-punk DJ sets.',
      style: 'Shoegaze', tier: 'Resident', draw: '<100',
      gigCount: 11, ticketsSold: 1600,
      photos: ['/img/p1.jpg'],
      nextSet: {
        slug: 'shoegazesun-1027', venue: 'Hare & Hounds', city: 'Birmingham',
        date: 'Sun 27 Oct', setTime: '8:30pm', feeFrom: 'From £200',
      },
      social: { instagram: 'shoegazesundaysdj', soundcloud: 'shoegazesundaysdj' },
    },
    {
      id: 'd_19', userId: 'du_19', slug: 'dnb-forge-dj',
      name: 'DnB Forge', city: 'Bristol',
      bio: 'Neurofunk and jump-up DnB.',
      verified: true, style: 'DnB', tier: 'Headliner', draw: '1000+',
      gigCount: 45, ticketsSold: 16800,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      nextSet: {
        slug: 'dnbforge-1102', venue: 'Motion', city: 'Bristol',
        date: 'Sat 2 Nov', setTime: '1:00am', feeFrom: 'From £800',
      },
      social: { instagram: 'dnbforgedj', soundcloud: 'dnbforgedj', spotify: 'dnbforgedj' },
    },
    {
      id: 'd_20', userId: 'du_20', slug: 'electronic-europe-dj',
      name: 'Electronic Europe', city: 'Amsterdam',
      bio: 'IDM and downtempo. Album listening sets.',
      style: 'Electronic', tier: 'Headliner', draw: '500-1000',
      gigCount: 24, ticketsSold: 5200,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      nextSet: {
        slug: 'electroniceu-1116', venue: 'Melkweg', city: 'Amsterdam',
        date: 'Sat 16 Nov', setTime: '10:00pm', feeFrom: 'From EUR 700',
      },
      social: { instagram: 'electroniceuropedj', soundcloud: 'electroniceuropedj' },
    },
    {
      id: 'd_21', userId: 'du_21', slug: 'lo-fi-matt-dj',
      name: 'Lo-Fi Matt', city: 'London',
      bio: 'Lo-fi and chillhop warmup sets.',
      style: 'Lo-fi', tier: 'Resident', draw: '<100',
      gigCount: 8, ticketsSold: 1200,
      photos: ['/img/p1.jpg'],
      nextSet: {
        slug: 'lofimatt-1109', venue: 'The Cause', city: 'London',
        date: 'Sat 9 Nov', setTime: '9:00pm', feeFrom: 'From £200',
      },
      social: { instagram: 'lofimatt', soundcloud: 'lofimatt', spotify: 'lofimatt' },
    },
  ];
}
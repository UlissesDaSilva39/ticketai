export type Band = {
  id: string;
  userId: string;
  slug: string;
  name: string;
  city: string;
  bio: string;
  verified?: boolean;
  genre: string;
  lineup: string;            // 'Solo' | 'Duo' | 'Trio' | '4-piece' | '5-piece+'
  draw: string;              // '<100' | '100-500' | '500-1000' | '1000+'
  gigCount: number;
  ticketsSold: number;
  photos: string[];
  nextGig?: {
    slug: string;
    venue: string;
    city: string;
    doors: string;
    date: string;
    priceFrom: string;
  };
  social: {
    instagram?: string;
    tiktok?: string;
    spotify?: string;
    appleMusic?: string;
  };
};

export async function getBands(): Promise<Band[]> {
  return [
    {
      id: 'b_01', userId: 'bu_01', slug: 'the-static-frames',
      name: 'The Static Frames', city: 'London',
      bio: 'Post-punk four-piece. Two UK tours.',
      verified: true, genre: 'Post-Punk', lineup: '4-piece', draw: '500-1000',
      gigCount: 24, ticketsSold: 5400,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      nextGig: {
        slug: 'staticframes-1018', venue: 'Village Underground', city: 'London',
        doors: '7:30pm', date: 'Sat 18 Oct', priceFrom: 'From £18',
      },
      social: { instagram: 'staticframes', tiktok: 'staticframes', spotify: 'staticframes' },
    },
    {
      id: 'b_02', userId: 'bu_02', slug: 'low-tide',
      name: 'Low Tide', city: 'Bristol',
      bio: 'Dub and reggae collective. Resident at Motion.',
      genre: 'Dub', lineup: '5-piece+', draw: '500-1000',
      gigCount: 18, ticketsSold: 3200,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      nextGig: {
        slug: 'lowtide-1024', venue: 'Motion', city: 'Bristol',
        doors: '9:00pm', date: 'Fri 24 Oct', priceFrom: 'From £22',
      },
      social: { instagram: 'lowtide', tiktok: 'lowtide', spotify: 'lowtide' },
    },
    {
      id: 'b_03', userId: 'bu_03', slug: 'ghost-signals',
      name: 'Ghost Signals', city: 'Manchester',
      bio: 'Indie five-piece. Three festival slots booked through GRID.',
      verified: true, genre: 'Indie', lineup: '5-piece+', draw: '500-1000',
      gigCount: 32, ticketsSold: 7800,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      nextGig: {
        slug: 'ghostsignals-1022', venue: 'YES', city: 'Manchester',
        doors: '8:00pm', date: 'Wed 22 Oct', priceFrom: 'From £16',
      },
      social: { instagram: 'ghostsignals', tiktok: 'ghostsignals', spotify: 'ghostsignals' },
    },
    {
      id: 'b_04', userId: 'bu_04', slug: 'northern-lights-band',
      name: 'Northern Lights', city: 'Leeds',
      bio: 'Folk trio. Sold out three UK tours.',
      genre: 'Folk', lineup: 'Trio', draw: '100-500',
      gigCount: 41, ticketsSold: 9200,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      nextGig: {
        slug: 'northernlights-1025', venue: 'Brudenell Social Club', city: 'Leeds',
        doors: '8:30pm', date: 'Sat 25 Oct', priceFrom: 'From £14',
      },
      social: { instagram: 'northernlights', tiktok: 'northernlights', spotify: 'northernlights' },
    },
    {
      id: 'b_05', userId: 'bu_05', slug: 'hard-knocks-band',
      name: 'Hard Knocks', city: 'Birmingham',
      bio: 'Hard rock four-piece. Two arena supports.',
      verified: true, genre: 'Rock', lineup: '4-piece', draw: '1000+',
      gigCount: 38, ticketsSold: 12500,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      nextGig: {
        slug: 'hardknocks-1026', venue: 'O2 Academy', city: 'Birmingham',
        doors: '7:00pm', date: 'Sun 26 Oct', priceFrom: 'From £20',
      },
      social: { instagram: 'hardknocks', tiktok: 'hardknocks', spotify: 'hardknocks' },
    },
    {
      id: 'b_06', userId: 'bu_06', slug: 'bristol-underground-band',
      name: 'Bristol Underground', city: 'Bristol',
      bio: 'Electronic duo. Bass-driven live sets.',
      genre: 'Electronic', lineup: 'Duo', draw: '500-1000',
      gigCount: 22, ticketsSold: 4100,
      photos: ['/img/p1.jpg'],
      nextGig: {
        slug: 'bristolug-1101', venue: 'Thekla', city: 'Bristol',
        doors: '9:30pm', date: 'Sat 1 Nov', priceFrom: 'From £18',
      },
      social: { instagram: 'bristolunderground', tiktok: 'bristolug', spotify: 'bristolug' },
    },
    {
      id: 'b_07', userId: 'bu_07', slug: 'glasgow-sound-band',
      name: 'Glasgow Sound', city: 'Glasgow',
      bio: 'Post-rock six-piece. Instrumental.',
      genre: 'Post-Rock', lineup: '5-piece+', draw: '100-500',
      gigCount: 14, ticketsSold: 2800,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      nextGig: {
        slug: 'glasgowsound-1108', venue: 'SWG3', city: 'Glasgow',
        doors: '8:00pm', date: 'Fri 8 Nov', priceFrom: 'From £16',
      },
      social: { instagram: 'glasgowsound', tiktok: 'glasgowsound', spotify: 'glasgowsound' },
    },
    {
      id: 'b_08', userId: 'bu_08', slug: 'paris-nocturne-band',
      name: 'Paris Nocturne', city: 'Paris',
      bio: 'Synth-pop trio. French and English.',
      genre: 'Synth-Pop', lineup: 'Trio', draw: '500-1000',
      gigCount: 26, ticketsSold: 5100,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      nextGig: {
        slug: 'parisnocturne-1115', venue: 'Rex Club', city: 'Paris',
        doors: '10:00pm', date: 'Fri 15 Nov', priceFrom: 'From EUR 22',
      },
      social: { instagram: 'parisnocturne', tiktok: 'parisnocturne', spotify: 'parisnocturne' },
    },
    {
      id: 'b_09', userId: 'bu_09', slug: 'amsterdam-dance-band',
      name: 'Amsterdam Dance', city: 'Amsterdam',
      bio: 'Live-house collective. ADE regulars.',
      verified: true, genre: 'House', lineup: '5-piece+', draw: '1000+',
      gigCount: 31, ticketsSold: 8900,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      nextGig: {
        slug: 'amsterdamdance-1017', venue: 'Shelter', city: 'Amsterdam',
        doors: '11:00pm', date: 'Thu 17 Oct', priceFrom: 'From EUR 28',
      },
      social: { instagram: 'amsterdamdance', tiktok: 'amsterdamdance', spotify: 'amsterdamdance' },
    },
    {
      id: 'b_10', userId: 'bu_10', slug: 'barcelona-beats-band',
      name: 'Barcelona Beats', city: 'Barcelona',
      bio: 'Latin-electronic trio. Mediterranean festival circuit.',
      genre: 'Latin Electronic', lineup: 'Trio', draw: '500-1000',
      gigCount: 19, ticketsSold: 3900,
      photos: ['/img/p1.jpg'],
      nextGig: {
        slug: 'barcelonabeats-1122', venue: 'Razzmatazz', city: 'Barcelona',
        doors: '9:00pm', date: 'Fri 22 Nov', priceFrom: 'From EUR 25',
      },
      social: { instagram: 'barcelonabeats', tiktok: 'barcelonabeats', spotify: 'barcelonabeats' },
    },
    {
      id: 'b_11', userId: 'bu_11', slug: 'dublin-nightlife-band',
      name: 'Dublin Nightlife', city: 'Dublin',
      bio: 'Irish folk-rock four-piece.',
      genre: 'Folk-Rock', lineup: '4-piece', draw: '100-500',
      gigCount: 15, ticketsSold: 2600,
      photos: ['/img/p1.jpg'],
      nextGig: {
        slug: 'dublinnightlife-1109', venue: 'Index', city: 'Dublin',
        doors: '8:00pm', date: 'Sat 9 Nov', priceFrom: 'From EUR 20',
      },
      social: { instagram: 'dublinnightlife', tiktok: 'dublinnightlife', spotify: 'dublinnightlife' },
    },
    {
      id: 'b_12', userId: 'bu_12', slug: 'leeds-live-band',
      name: 'Leeds Live', city: 'Leeds',
      bio: 'Indie-rock five-piece. Two singles out.',
      genre: 'Indie-Rock', lineup: '5-piece+', draw: '100-500',
      gigCount: 12, ticketsSold: 2100,
      photos: ['/img/p1.jpg'],
      nextGig: {
        slug: 'leedslive-1102', venue: 'Brudenell Social Club', city: 'Leeds',
        doors: '8:00pm', date: 'Sat 2 Nov', priceFrom: 'From £12',
      },
      social: { instagram: 'leedslive', tiktok: 'leedslive', spotify: 'leedslive' },
    },
    {
      id: 'b_13', userId: 'bu_13', slug: 'east-end-collective',
      name: 'East End Collective', city: 'London',
      bio: 'Hip-hop collective. Twelve members, rotating lineup.',
      genre: 'Hip-Hop', lineup: '5-piece+', draw: '500-1000',
      gigCount: 28, ticketsSold: 6400,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      nextGig: {
        slug: 'eastend-1025', venue: 'Village Underground', city: 'London',
        doors: '9:00pm', date: 'Fri 25 Oct', priceFrom: 'From £22',
      },
      social: { instagram: 'eastendcollective', tiktok: 'eastendcollective', spotify: 'eastendcollective' },
    },
    {
      id: 'b_14', userId: 'bu_14', slug: 'jazz-collective-band',
      name: 'The Loft Jazz Collective', city: 'London',
      bio: 'Modern jazz septet. Weekly residency.',
      verified: true, genre: 'Jazz', lineup: '5-piece+', draw: '100-500',
      gigCount: 52, ticketsSold: 5100,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      nextGig: {
        slug: 'jazzcollective-1023', venue: 'The Loft', city: 'London',
        doors: '7:30pm', date: 'Wed 23 Oct', priceFrom: 'From £18',
      },
      social: { instagram: 'jazzcollective', spotify: 'jazzcollective' },
    },
    {
      id: 'b_15', userId: 'bu_15', slug: 'techno-nation-band',
      name: 'Techno Nation Live', city: 'London',
      bio: 'Techno live act. Modular and hardware only.',
      verified: true, genre: 'Techno', lineup: 'Trio', draw: '1000+',
      gigCount: 34, ticketsSold: 14200,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      nextGig: {
        slug: 'technonation-1101', venue: 'Printworks', city: 'London',
        doors: '10:00pm', date: 'Sat 1 Nov', priceFrom: 'From £35',
      },
      social: { instagram: 'technonationlive', tiktok: 'technonationlive', spotify: 'technonationlive' },
    },
    {
      id: 'b_16', userId: 'bu_16', slug: 'house-party-band',
      name: 'House Party', city: 'Manchester',
      bio: 'Live house band. Horns and vocals.',
      genre: 'House', lineup: '5-piece+', draw: '500-1000',
      gigCount: 20, ticketsSold: 4600,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      nextGig: {
        slug: 'houseparty-1026', venue: 'Hidden', city: 'Manchester',
        doors: '10:00pm', date: 'Sat 26 Oct', priceFrom: 'From £20',
      },
      social: { instagram: 'housepartyband', tiktok: 'housepartyband', spotify: 'housepartyband' },
    },
    {
      id: 'b_17', userId: 'bu_17', slug: 'folk-roots-band',
      name: 'Folk & Roots', city: 'Bristol',
      bio: 'Acoustic folk trio. Storytellers.',
      genre: 'Folk', lineup: 'Trio', draw: '<100',
      gigCount: 8, ticketsSold: 900,
      photos: ['/img/p1.jpg'],
      nextGig: {
        slug: 'folkroots-1115', venue: 'Thekla', city: 'Bristol',
        doors: '7:30pm', date: 'Fri 15 Nov', priceFrom: 'From £12',
      },
      social: { instagram: 'folkrootsband', tiktok: 'folkrootsband', spotify: 'folkrootsband' },
    },
    {
      id: 'b_18', userId: 'bu_18', slug: 'shoegaze-sundays-band',
      name: 'Shoegaze Sundays', city: 'Birmingham',
      bio: 'Shoegaze four-piece. Wall of sound.',
      genre: 'Shoegaze', lineup: '4-piece', draw: '100-500',
      gigCount: 11, ticketsSold: 1600,
      photos: ['/img/p1.jpg'],
      nextGig: {
        slug: 'shoegaze-1027', venue: 'Hare & Hounds', city: 'Birmingham',
        doors: '8:00pm', date: 'Sun 27 Oct', priceFrom: 'From £10',
      },
      social: { instagram: 'shoegazesundays', tiktok: 'shoegazesundays', spotify: 'shoegazesundays' },
    },
    {
      id: 'b_19', userId: 'bu_19', slug: 'dnb-nation-band',
      name: 'DnB Nation Live', city: 'Bristol',
      bio: 'Live drum and bass band. Vocalist + MC + rhythm section.',
      verified: true, genre: 'DnB', lineup: '5-piece+', draw: '1000+',
      gigCount: 42, ticketsSold: 18600,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      nextGig: {
        slug: 'dnbnation-1102', venue: 'Motion', city: 'Bristol',
        doors: '10:00pm', date: 'Sat 2 Nov', priceFrom: 'From £28',
      },
      social: { instagram: 'dnbnationlive', tiktok: 'dnbnationlive', spotify: 'dnbnationlive' },
    },
    {
      id: 'b_20', userId: 'bu_20', slug: 'electronic-europe-band',
      name: 'Electronic Europe', city: 'Amsterdam',
      bio: 'Pan-European electronic trio.',
      genre: 'Electronic', lineup: 'Trio', draw: '500-1000',
      gigCount: 24, ticketsSold: 5800,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      nextGig: {
        slug: 'electroniceu-1116', venue: 'Melkweg', city: 'Amsterdam',
        doors: '9:00pm', date: 'Sat 16 Nov', priceFrom: 'From EUR 24',
      },
      social: { instagram: 'electroniceurope', tiktok: 'electroniceurope', spotify: 'electroniceurope' },
    },
    {
      id: 'b_21', userId: 'bu_21', slug: 'dj-proxy-band',
      name: 'DJ Proxy', city: 'London',
      bio: 'Solo DJ act. Best DJ in town.',
      genre: 'House', lineup: 'Solo', draw: '100-500',
      gigCount: 5, ticketsSold: 900,
      photos: ['/img/p1.jpg'],
      nextGig: {
        slug: 'djproxy-1109', venue: 'The Cause', city: 'London',
        doors: '10:00pm', date: 'Sat 9 Nov', priceFrom: 'From £15',
      },
      social: { instagram: 'djproxy', tiktok: 'djproxy', spotify: 'djproxy' },
    },
  ];
}
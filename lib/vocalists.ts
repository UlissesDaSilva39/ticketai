export type Vocalist = {
  id: string;
  userId: string;
  slug: string;
  name: string;
  city: string;
  bio: string;
  verified?: boolean;
  type: string;             // 'Topliner' | 'Session' | 'Featured Hook' | 'Verse'
  range: string;            // 'Alto' | 'Soprano' | 'Tenor' | 'Baritone'
  genres: string[];
  bookingCount: number;
  placements: number;
  photos: string[];
  featuredDemo?: {
    slug: string;
    title: string;
    key: string;
    range: string;
    genre: string;
    rate: string;
    previewUrl: string;
  };
  social: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    spotify?: stringbandcamp?: string;;
  };
};

export async function getVocalists(): Promise<Vocalist[]> {
  return [
    {
      id: 'v_01', userId: 'vu_01', slug: 'aaliyah-j',
      name: 'Aaliyah J.', city: 'London',
      bio: 'R&B topliner. Hookwriter. 4 chart features.',
      verified: true, type: 'Topliner', range: 'Alto', genres: ['R&B', 'Pop'],
      bookingCount: 24, placements: 8,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      featuredDemo: {
        slug: 'golden-hour', title: 'Golden Hour',
        key: 'Am', range: 'Alto', genre: 'R&B',
        rate: 'Hook £180', previewUrl: '/audio/goldenhour.mp3',
      },
      social: { instagram: 'aaliyahj', tiktok: 'aaliyahj', spotify: 'aaliyahj' },
    },
    {
      id: 'v_02', userId: 'vu_02', slug: 'marcus-k',
      name: 'Marcus K.', city: 'Manchester',
      bio: 'Session tenor. Studio-ready, 12 years experience.',
      verified: true, type: 'Session', range: 'Tenor', genres: ['Soul', 'R&B'],
      bookingCount: 42, placements: 15,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      featuredDemo: {
        slug: 'lately', title: 'Lately',
        key: 'Cm', range: 'Tenor', genre: 'Soul',
        rate: 'Session £280', previewUrl: '/audio/lately.mp3',
      },
      social: { instagram: 'marcusk', tiktok: 'marcusk', youtube: 'marcusk' },
    },
    {
      id: 'v_03', userId: 'vu_03', slug: 'nova-rae',
      name: 'Nova Rae', city: 'Berlin',
      bio: 'Soprano topliner. Sync placements with Netflix, ad campaigns.',
      verified: true, type: 'Featured Hook', range: 'Soprano', genres: ['Pop', 'Electronic'],
      bookingCount: 31, placements: 19,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      featuredDemo: {
        slug: 'aurora', title: 'Aurora',
        key: 'F', range: 'Soprano', genre: 'Pop',
        rate: 'Feature £450', previewUrl: '/audio/aurora.mp3',
      },
      social: { instagram: 'novarae', tiktok: 'novarae', spotify: 'novarae' },
    },
    {
      id: 'v_04', userId: 'vu_04', slug: 'bristol-soul-co',
      name: 'Bristol Soul Co.', city: 'Bristol',
      bio: 'Baritone session singer. Soul, jazz, and rare groove.',
      type: 'Session', range: 'Baritone', genres: ['Soul', 'Jazz'],
      bookingCount: 18, placements: 6,
      photos: ['/img/p1.jpg'],
      featuredDemo: {
        slug: 'seafront', title: 'Seafront',
        key: 'G', range: 'Baritone', genre: 'Soul',
        rate: 'Session £220', previewUrl: '/audio/seafront.mp3',
      },
      social: { instagram: 'bristolsoulco', tiktok: 'bristolsoulco', youtube: 'bristolsoulco' },
    },
    {
      id: 'v_05', userId: 'vu_05', slug: 'jade-voss',
      name: 'Jade Voss', city: 'London',
      bio: 'Alto hookwriter. Drill, afrobeats, and R&B.',
      verified: true, type: 'Featured Hook', range: 'Alto', genres: ['Drill', 'R&B'],
      bookingCount: 38, placements: 22,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      featuredDemo: {
        slug: 'midtown', title: 'Midtown',
        key: 'Dm', range: 'Alto', genre: 'Drill',
        rate: 'Hook £180', previewUrl: '/audio/midtown.mp3',
      },
      social: { instagram: 'jadevoss', tiktok: 'jadevoss', spotify: 'jadevoss' },
    },
    {
      id: 'v_06', userId: 'vu_06', slug: 'eli-moore',
      name: 'Eli Moore', city: 'Manchester',
      bio: 'Tenor session singer. Studio pro, 200+ records.',
      type: 'Session', range: 'Tenor', genres: ['Pop', 'Rock'],
      bookingCount: 55, placements: 40,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      featuredDemo: {
        slug: 'wildfires', title: 'Wildfires',
        key: 'Bm', range: 'Tenor', genre: 'Pop',
        rate: 'Session £320', previewUrl: '/audio/wildfires.mp3',
      },
      social: { instagram: 'elimoore', tiktok: 'elimoore', youtube: 'elimoore' },
    },
    {
      id: 'v_07', userId: 'vu_07', slug: 'ivy-nocturne',
      name: 'Ivy Nocturne', city: 'Glasgow',
      bio: 'Soprano topliner. Cinematic, ambient, soundtrack work.',
      type: 'Topliner', range: 'Soprano', genres: ['Ambient', 'Cinematic'],
      bookingCount: 15, placements: 11,
      photos: ['/img/p1.jpg'],
      featuredDemo: {
        slug: 'fog-light', title: 'Fog Light',
        key: 'Em', range: 'Soprano', genre: 'Ambient',
        rate: 'Feature £380', previewUrl: '/audio/foglight.mp3',
      },
      social: { instagram: 'ivynocturne', tiktok: 'ivynocturne', spotify: 'ivynocturne' },
    },
    {
      id: 'v_08', userId: 'vu_08', slug: 'paris-blanc',
      name: 'Paris Blanc', city: 'Paris',
      bio: 'French topliner. Disco, boogie, and electronic.',
      type: 'Topliner', range: 'Alto', genres: ['Disco', 'Electronic'],
      bookingCount: 22, placements: 9,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      featuredDemo: {
        slug: 'chateau-voice', title: 'Château Voice',
        key: 'Am', range: 'Alto', genre: 'Disco',
        rate: 'Feature £420', previewUrl: '/audio/chateauvoice.mp3',
      },
      social: { instagram: 'parisblanc', tiktok: 'parisblanc', spotify: 'parisblanc' },
    },
    {
      id: 'v_09', userId: 'vu_09', slug: 'amsterdam-echo',
      name: 'Amsterdam Echo', city: 'Amsterdam',
      bio: 'Hip-hop hooks and boom-bap vocals.',
      verified: true, type: 'Featured Hook', range: 'Alto', genres: ['Hip-Hop', 'Boom-Bap'],
      bookingCount: 34, placements: 18,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      featuredDemo: {
        slug: 'canal-lights', title: 'Canal Lights',
        key: 'Bm', range: 'Alto', genre: 'Hip-Hop',
        rate: 'Hook £240', previewUrl: '/audio/canallights.mp3',
      },
      social: { instagram: 'amsterdamecho', tiktok: 'amsterdamecho', spotify: 'amsterdamecho' },
    },
    {
      id: 'v_10', userId: 'vu_10', slug: 'barcelona-bella',
      name: 'Barcelona Bella', city: 'Barcelona',
      bio: 'Latin trap and reggaeton features. Bilingual ES/EN.',
      type: 'Featured Hook', range: 'Soprano', genres: ['Latin Trap', 'Reggaeton'],
      bookingCount: 27, placements: 12,
      photos: ['/img/p1.jpg'],
      featuredDemo: {
        slug: 'fuego-voz', title: 'Fuego Voz',
        key: 'Am', range: 'Soprano', genre: 'Latin Trap',
        rate: 'Feature £400', previewUrl: '/audio/fuegovoz.mp3',
      },
      social: { instagram: 'barcelonabella', tiktok: 'barcelonabella', spotify: 'barcelonabella' },
    },
    {
      id: 'v_11', userId: 'vu_11', slug: 'dublin-eire',
      name: 'Dublin Éire', city: 'Dublin',
      bio: 'Folk-tronica vocals. Irish and English.',
      type: 'Topliner', range: 'Alto', genres: ['Folk', 'Electronic'],
      bookingCount: 14, placements: 5,
      photos: ['/img/p1.jpg'],
      featuredDemo: {
        slug: 'liffey-song', title: 'Liffey Song',
        key: 'G', range: 'Alto', genre: 'Folk-Hop',
        rate: 'Feature £320', previewUrl: '/audio/liffeysong.mp3',
      },
      social: { instagram: 'dublineire', tiktok: 'dublineire', youtube: 'dublineire' },
    },
    {
      id: 'v_12', userId: 'vu_12', slug: 'leeds-lyric',
      name: 'Leeds Lyric', city: 'Leeds',
      bio: 'UK drill and grime hooks. 3 chart placements.',
      verified: true, type: 'Featured Hook', range: 'Tenor', genres: ['Drill', 'Grime'],
      bookingCount: 44, placements: 26,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      featuredDemo: {
        slug: 'northern-flow', title: 'Northern Flow',
        key: 'Em', range: 'Tenor', genre: 'Drill',
        rate: 'Hook £200', previewUrl: '/audio/northernflow.mp3',
      },
      social: { instagram: 'leedslyric', tiktok: 'leedslyric', spotify: 'leedslyric' },
    },
    {
      id: 'v_13', userId: 'vu_13', slug: 'east-side-vox',
      name: 'East Side Vox', city: 'London',
      bio: 'Afrobeats and amapiano topliner. Nigerian & UK.',
      type: 'Topliner', range: 'Alto', genres: ['Afrobeats', 'Amapiano'],
      bookingCount: 29, placements: 14,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      featuredDemo: {
        slug: 'lagos-vibe', title: 'Lagos Vibe',
        key: 'Fm', range: 'Alto', genre: 'Afrobeats',
        rate: 'Feature £380', previewUrl: '/audio/lagosvibe.mp3',
      },
      social: { instagram: 'eastsidevox', tiktok: 'eastsidevox', spotify: 'eastsidevox' },
    },
    {
      id: 'v_14', userId: 'vu_14', slug: 'jazz-velvet',
      name: 'Jazz Velvet', city: 'London',
      bio: 'Jazz and soul vocalist. Rare groove specialist.',
      verified: true, type: 'Session', range: 'Alto', genres: ['Jazz', 'Soul'],
      bookingCount: 61, placements: 32,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      featuredDemo: {
        slug: 'blue-hour', title: 'Blue Hour',
        key: 'Cm', range: 'Alto', genre: 'Jazz',
        rate: 'Session £300', previewUrl: '/audio/bluehour.mp3',
      },
      social: { instagram: 'jazzvelvet', tiktok: 'jazzvelvet', spotify: 'jazzvelvet' },
    },
    {
      id: 'v_15', userId: 'vu_15', slug: 'hard-vox',
      name: 'Hard Vox', city: 'London',
      bio: 'Dark trap and drill vocals. Cinematic scoring.',
      verified: true, type: 'Featured Hook', range: 'Baritone', genres: ['Trap', 'Drill'],
      bookingCount: 47, placements: 28,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      featuredDemo: {
        slug: 'kings-vox', title: "King's Vox",
        key: 'Am', range: 'Baritone', genre: 'Trap',
        rate: 'Feature £360', previewUrl: '/audio/kingsvox.mp3',
      },
      social: { instagram: 'hardvox', tiktok: 'hardvox', spotify: 'hardvox' },
    },
    {
      id: 'v_16', userId: 'vu_16', slug: 'northern-soul-vox',
      name: 'Northern Soul Vox', city: 'Manchester',
      bio: 'Northern soul and motown vocals.',
      type: 'Session', range: 'Tenor', genres: ['Soul', 'Funk'],
      bookingCount: 20, placements: 7,
      photos: ['/img/p1.jpg'],
      featuredDemo: {
        slug: 'twisted-vox', title: 'Twisted Vox',
        key: 'B', range: 'Tenor', genre: 'Soul',
        rate: 'Session £260', previewUrl: '/audio/twistedvox.mp3',
      },
      social: { instagram: 'northernsoulvox', tiktok: 'northernsoulvox', youtube: 'northernsoulvox' },
    },
    {
      id: 'v_17', userId: 'vu_17', slug: 'roots-vox',
      name: 'Roots Vox', city: 'Bristol',
      bio: 'Reggae and dub vocals. Soundsystem veterans.',
      type: 'Session', range: 'Baritone', genres: ['Reggae', 'Dub'],
      bookingCount: 14, placements: 4,
      photos: ['/img/p1.jpg'],
      featuredDemo: {
        slug: 'faraway-vox', title: 'Faraway Vox',
        key: 'Gm', range: 'Baritone', genre: 'Dub',
        rate: 'Session £240', previewUrl: '/audio/farawayvox.mp3',
      },
      social: { instagram: 'rootsvox', tiktok: 'rootsvox', youtube: 'rootsvox' },
    },
    {
      id: 'v_18', userId: 'vu_18', slug: 'shoegaze-ghost',
      name: 'Shoegaze Ghost', city: 'Birmingham',
      bio: 'Shoegaze and dream-pop vocalist. Tape-warped.',
      type: 'Topliner', range: 'Soprano', genres: ['Shoegaze', 'Dream-Pop'],
      bookingCount: 12, placements: 3,
      photos: ['/img/p1.jpg'],
      featuredDemo: {
        slug: 'reverb-vox', title: 'Reverb Vox',
        key: 'D', range: 'Soprano', genre: 'Shoegaze',
        rate: 'Feature £280', previewUrl: '/audio/reverbvox.mp3',
      },
      social: { instagram: 'shoegazeghost', tiktok: 'shoegazeghost', bandcamp: 'shoegazeghost' },
    },
    {
      id: 'v_19', userId: 'vu_19', slug: 'dnb-vox',
      name: 'DnB Vox', city: 'Bristol',
      bio: 'Liquid DnB and jungle vocals. 8 label releases.',
      verified: true, type: 'Featured Hook', range: 'Alto', genres: ['DnB', 'Jungle'],
      bookingCount: 41, placements: 22,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      featuredDemo: {
        slug: 'forged-vox', title: 'Forged Vox',
        key: 'Em', range: 'Alto', genre: 'DnB',
        rate: 'Feature £320', previewUrl: '/audio/forgedvox.mp3',
      },
      social: { instagram: 'dnbvox', tiktok: 'dnbvox', spotify: 'dnbvox' },
    },
    {
      id: 'v_20', userId: 'vu_20', slug: 'pan-eu-vox',
      name: 'Pan-EU Vox', city: 'Amsterdam',
      bio: 'Pan-European IDM and downtempo vocals.',
      type: 'Topliner', range: 'Alto', genres: ['IDM', 'Downtempo'],
      bookingCount: 26, placements: 11,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      featuredDemo: {
        slug: 'transit-vox', title: 'Transit Vox',
        key: 'Cm', range: 'Alto', genre: 'IDM',
        rate: 'Feature £380', previewUrl: '/audio/transitvox.mp3',
      },
      social: { instagram: 'paneuvox', tiktok: 'paneuvox', spotify: 'paneuvox' },
    },
    {
      id: 'v_21', userId: 'vu_21', slug: 'lofi-lyric',
      name: 'Lo-Fi Lyric', city: 'London',
      bio: 'Lo-fi and chillhop hooks. Study beats specialist.',
      type: 'Featured Hook', range: 'Alto', genres: ['Lo-fi', 'Chillhop'],
      bookingCount: 8, placements: 2,
      photos: ['/img/p1.jpg'],
      featuredDemo: {
        slug: 'late-vox', title: 'Late Vox',
        key: 'F', range: 'Alto', genre: 'Lo-fi',
        rate: 'Hook £160', previewUrl: '/audio/latevox.mp3',
      },
      social: { instagram: 'lofilyric', tiktok: 'lofilyric', spotify: 'lofilyric' },
    },
  ];
}
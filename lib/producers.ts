export type Producer = {
  id: string;
  userId: string;
  slug: string;
  name: string;
  city: string;
  bio: string;
  verified?: boolean;
  beatCount: number;
  placements: number;
  photos: string[];
  latestBeat?: {
    slug: string;
    title: string;
    key: string;
    bpm: number;
    genre: string;
    priceFrom: string;
    previewUrl: string;
  };
  social: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    bandcamp?: string;
  };
};

export async function getProducers(): Promise<Producer[]> {
  return [
    {
      id: 'pr_01', userId: 'pu_01', slug: 'kaytranada-jr',
      name: 'Kaytranada Jr.', city: 'London',
      bio: 'Smooth, sample-flipped hip-hop and R&B. 4 album credits.',
      verified: true, beatCount: 42, placements: 12,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      latestBeat: {
        slug: 'motion', title: 'Motion',
        key: 'Am', bpm: 92, genre: 'Hip-Hop',
        priceFrom: 'Lease £49', previewUrl: '/audio/motion.mp3',
      },
      social: { instagram: 'kaytranadajr', tiktok: 'kaytranadajr', youtube: 'kaytranadajr' },
    },
    {
      id: 'pr_02', userId: 'pu_02', slug: 'ghost-loops',
      name: 'Ghost Loops', city: 'Manchester',
      bio: 'Lo-fi, experimental, tape saturation. 12 placements.',
      verified: true, beatCount: 28, placements: 18,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      latestBeat: {
        slug: 'static', title: 'Static',
        key: 'Cm', bpm: 140, genre: 'Lo-fi',
        priceFrom: 'Lease £79', previewUrl: '/audio/static.mp3',
      },
      social: { instagram: 'ghostloops', tiktok: 'ghostloops', bandcamp: 'ghostloops' },
    },
    {
      id: 'pr_03', userId: 'pu_03', slug: 'neon-frames',
      name: 'Neon Frames', city: 'Berlin',
      bio: 'Melodic techno and progressive house. Syncs with Netflix, Netflix Originals.',
      beatCount: 34, placements: 9,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      latestBeat: {
        slug: 'afterglow', title: 'Afterglow',
        key: 'F', bpm: 128, genre: 'Techno',
        priceFrom: 'Lease £39', previewUrl: '/audio/afterglow.mp3',
      },
      social: { instagram: 'neonframes', tiktok: 'neonframes', youtube: 'neonframes' },
    },
    {
      id: 'pr_04', userId: 'pu_04', slug: 'bristol-bass-co',
      name: 'Bristol Bass Co.', city: 'Bristol',
      bio: 'Bass, garage, and breaks. Resident at Motion.',
      beatCount: 22, placements: 6,
      photos: ['/img/p1.jpg'],
      latestBeat: {
        slug: 'low-tide', title: 'Low Tide',
        key: 'G', bpm: 174, genre: 'DnB',
        priceFrom: 'Lease £59', previewUrl: '/audio/lowtide.mp3',
      },
      social: { instagram: 'bristolbassco', tiktok: 'bristolbassco', youtube: 'bristolbassco' },
    },
    {
      id: 'pr_05', userId: 'pu_05', slug: 'soul-sample',
      name: 'Soul Sample', city: 'London',
      bio: 'Soulful, jazzy, MPC-driven. Placed with three UK chart records.',
      verified: true, beatCount: 56, placements: 31,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      latestBeat: {
        slug: 'reflection', title: 'Reflection',
        key: 'Dm', bpm: 88, genre: 'R&B',
        priceFrom: 'Lease £49', previewUrl: '/audio/reflection.mp3',
      },
      social: { instagram: 'soulsample', tiktok: 'soulsample', youtube: 'soulsample' },
    },
    {
      id: 'pr_06', userId: 'pu_06', slug: 'house-of-dubs',
      name: 'House of Dubs', city: 'Manchester',
      bio: 'Deep house, minimal, and tech-house.',
      beatCount: 18, placements: 4,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      latestBeat: {
        slug: 'deep-dive', title: 'Deep Dive',
        key: 'Fm', bpm: 124, genre: 'House',
        priceFrom: 'Lease £55', previewUrl: '/audio/deepdive.mp3',
      },
      social: { instagram: 'houseofdubs', tiktok: 'houseofdubs', youtube: 'houseofdubs' },
    },
    {
      id: 'pr_07', userId: 'pu_07', slug: 'grief-productions',
      name: 'Grief Productions', city: 'Glasgow',
      bio: 'Shoegaze, ambient, cinematic textures.',
      beatCount: 24, placements: 7,
      photos: ['/img/p1.jpg'],
      latestBeat: {
        slug: 'fog', title: 'Fog',
        key: 'Em', bpm: 78, genre: 'Ambient',
        priceFrom: 'Lease £65', previewUrl: '/audio/fog.mp3',
      },
      social: { instagram: 'griefprod', tiktok: 'griefprod', bandcamp: 'griefprod' },
    },
    {
      id: 'pr_08', userId: 'pu_08', slug: 'paris-sounds',
      name: 'Paris Sounds', city: 'Paris',
      bio: 'French electronic, disco, and boogie.',
      beatCount: 31, placements: 11,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      latestBeat: {
        slug: 'chateau', title: 'Château',
        key: 'Am', bpm: 118, genre: 'Disco',
        priceFrom: 'Lease £69', previewUrl: '/audio/chateau.mp3',
      },
      social: { instagram: 'parissounds', tiktok: 'parissounds', youtube: 'parissounds' },
    },
    {
      id: 'pr_09', userId: 'pu_09', slug: 'amsterdam-crates',
      name: 'Amsterdam Crates', city: 'Amsterdam',
      bio: 'Crate-dug samples, hip-hop, boom-bap.',
      verified: true, beatCount: 44, placements: 19,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      latestBeat: {
        slug: 'dutch-gold', title: 'Dutch Gold',
        key: 'Bm', bpm: 95, genre: 'Hip-Hop',
        priceFrom: 'Lease £49', previewUrl: '/audio/dutchgold.mp3',
      },
      social: { instagram: 'amsterdamcrates', tiktok: 'amsterdamcrates', youtube: 'amsterdamcrates' },
    },
    {
      id: 'pr_10', userId: 'pu_10', slug: 'barcelona-fever',
      name: 'Barcelona Fever', city: 'Barcelona',
      bio: 'Latin-trap, reggaeton, and medellín-influenced beats.',
      beatCount: 27, placements: 8,
      photos: ['/img/p1.jpg'],
      latestBeat: {
        slug: 'fuego', title: 'Fuego',
        key: 'Am', bpm: 92, genre: 'Latin Trap',
        priceFrom: 'Lease £59', previewUrl: '/audio/fuego.mp3',
      },
      social: { instagram: 'barcelonafever', tiktok: 'barcelonafever', youtube: 'barcelonafever' },
    },
    {
      id: 'pr_11', userId: 'pu_11', slug: 'dublin-low',
      name: 'Dublin Low', city: 'Dublin',
      bio: 'Irish folk-tronica and hip-hop mashups.',
      beatCount: 16, placements: 3,
      photos: ['/img/p1.jpg'],
      latestBeat: {
        slug: 'liffey', title: 'Liffey',
        key: 'G', bpm: 84, genre: 'Folk-Hop',
        priceFrom: 'Lease £45', previewUrl: '/audio/liffey.mp3',
      },
      social: { instagram: 'dublinlow', tiktok: 'dublinlow', youtube: 'dublinlow' },
    },
    {
      id: 'pr_12', userId: 'pu_12', slug: 'leeds-loops',
      name: 'Leeds Loops', city: 'Leeds',
      bio: 'UK drill and grime. Placed with three UK top-40s.',
      verified: true, beatCount: 38, placements: 22,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      latestBeat: {
        slug: 'northern-slide', title: 'Northern Slide',
        key: 'Em', bpm: 141, genre: 'Drill',
        priceFrom: 'Lease £55', previewUrl: '/audio/northernslide.mp3',
      },
      social: { instagram: 'leedsloops', tiktok: 'leedsloops', youtube: 'leedsloops' },
    },
    {
      id: 'pr_13', userId: 'pu_13', slug: 'east-side-beats',
      name: 'East Side Beats', city: 'London',
      bio: 'Afrobeats, amapiano, and UK funky fusions.',
      beatCount: 29, placements: 10,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      latestBeat: {
        slug: 'lagos-lights', title: 'Lagos Lights',
        key: 'Fm', bpm: 108, genre: 'Afrobeats',
        priceFrom: 'Lease £69', previewUrl: '/audio/lagoslights.mp3',
      },
      social: { instagram: 'eastsidebeats', tiktok: 'eastsidebeats', youtube: 'eastsidebeats' },
    },
    {
      id: 'pr_14', userId: 'pu_14', slug: 'jazz-crate',
      name: 'Jazz Crate', city: 'London',
      bio: 'Sample-based jazz, soul, and rare groove.',
      verified: true, beatCount: 61, placements: 27,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      latestBeat: {
        slug: 'blue-note', title: 'Blue Note',
        key: 'Cm', bpm: 82, genre: 'Jazz-Hop',
        priceFrom: 'Lease £79', previewUrl: '/audio/bluenote.mp3',
      },
      social: { instagram: 'jazzcrate', tiktok: 'jazzcrate', youtube: 'jazzcrate' },
    },
    {
      id: 'pr_15', userId: 'pu_15', slug: 'hard-knocks',
      name: 'Hard Knocks', city: 'London',
      bio: 'Dark trap, drill, and cinematic scoring.',
      verified: true, beatCount: 47, placements: 25,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      latestBeat: {
        slug: 'kings-cross', title: "King's Cross",
        key: 'Am', bpm: 145, genre: 'Trap',
        priceFrom: 'Lease £65', previewUrl: '/audio/kingscross.mp3',
      },
      social: { instagram: 'hardknocks', tiktok: 'hardknocks', youtube: 'hardknocks' },
    },
    {
      id: 'pr_16', userId: 'pu_16', slug: 'northern-soul',
      name: 'Northern Soul', city: 'Manchester',
      bio: 'Northern soul, motown, and modern funk.',
      beatCount: 20, placements: 5,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      latestBeat: {
        slug: 'twisted', title: 'Twisted',
        key: 'B', bpm: 126, genre: 'Soul',
        priceFrom: 'Lease £55', previewUrl: '/audio/twisted.mp3',
      },
      social: { instagram: 'northernsoul', tiktok: 'northernsoul', youtube: 'northernsoul' },
    },
    {
      id: 'pr_17', userId: 'pu_17', slug: 'roots-and-dub',
      name: 'Roots & Dub', city: 'Bristol',
      bio: 'Reggae, dub, and soundsystem instrumentals.',
      beatCount: 14, placements: 3,
      photos: ['/img/p1.jpg'],
      latestBeat: {
        slug: 'faraway', title: 'Faraway',
        key: 'Gm', bpm: 74, genre: 'Dub',
        priceFrom: 'Lease £45', previewUrl: '/audio/faraway.mp3',
      },
      social: { instagram: 'rootsanddub', tiktok: 'rootsanddub', youtube: 'rootsanddub' },
    },
    {
      id: 'pr_18', userId: 'pu_18', slug: 'shoegaze-tapes',
      name: 'Shoegaze Tapes', city: 'Birmingham',
      bio: 'Shoegaze, dream-pop, and tape-warped textures.',
      beatCount: 12, placements: 2,
      photos: ['/img/p1.jpg'],
      latestBeat: {
        slug: 'reverb-city', title: 'Reverb City',
        key: 'D', bpm: 96, genre: 'Shoegaze',
        priceFrom: 'Lease £39', previewUrl: '/audio/reverbcity.mp3',
      },
      social: { instagram: 'shoegazetapes', tiktok: 'shoegazetapes', bandcamp: 'shoegazetapes' },
    },
    {
      id: 'pr_19', userId: 'pu_19', slug: 'dnb-forge',
      name: 'DnB Forge', city: 'Bristol',
      bio: 'Liquid DnB, jungle, and neurofunk.',
      verified: true, beatCount: 41, placements: 16,
      photos: ['/img/p1.jpg', '/img/p2.jpg', '/img/p3.jpg'],
      latestBeat: {
        slug: 'forged', title: 'Forged',
        key: 'Em', bpm: 174, genre: 'DnB',
        priceFrom: 'Lease £55', previewUrl: '/audio/forged.mp3',
      },
      social: { instagram: 'dnbforge', tiktok: 'dnbforge', youtube: 'dnbforge' },
    },
    {
      id: 'pr_20', userId: 'pu_20', slug: 'pan-eu-sound',
      name: 'Pan-EU Sound', city: 'Amsterdam',
      bio: 'Pan-European electronica, IDM, and downtempo.',
      beatCount: 26, placements: 9,
      photos: ['/img/p1.jpg', '/img/p2.jpg'],
      latestBeat: {
        slug: 'transit', title: 'Transit',
        key: 'Cm', bpm: 110, genre: 'IDM',
        priceFrom: 'Lease £65', previewUrl: '/audio/transit.mp3',
      },
      social: { instagram: 'paneusound', tiktok: 'paneusound', youtube: 'paneusound' },
    },
    {
      id: 'pr_21', userId: 'pu_21', slug: 'lo-fi-matt',
      name: 'Lo-Fi Matt', city: 'London',
      bio: 'Lo-fi hip-hop, chillhop, and study beats.',
      beatCount: 8, placements: 1,
      photos: ['/img/p1.jpg'],
      latestBeat: {
        slug: 'late-night', title: 'Late Night',
        key: 'F', bpm: 76, genre: 'Lo-fi',
        priceFrom: 'Lease £29', previewUrl: '/audio/latenight.mp3',
      },
      social: { instagram: 'lofimatt', tiktok: 'lofimatt', youtube: 'lofimatt' },
    },
  ];
}
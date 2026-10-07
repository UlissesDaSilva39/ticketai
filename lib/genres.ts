export type Genre = {
  slug: string;
  name: string;
  keywords: string[];
  description: string;
};

export const GENRES: Genre[] = [
  { slug: "house",      name: "House",       keywords: ["house", "deep house", "tech house"], description: "House music events - from intimate club nights to big-room shows." },
  { slug: "techno",     name: "Techno",      keywords: ["techno"], description: "Techno events - dark rooms, driving beats, late nights." },
  { slug: "hip-hop",    name: "Hip-Hop",     keywords: ["hip hop", "hip-hop", "rap"], description: "Hip-hop and rap events across the UK and beyond." },
  { slug: "afrobeats",  name: "Afrobeats",   keywords: ["afrobeats", "afrobeat", "amapiano"], description: "Afrobeats, amapiano, and afro-fusion events." },
  { slug: "live-music", name: "Live Music",  keywords: ["live music", "live band"], description: "Live music events - bands, solo artists, and everything in between." },
  { slug: "comedy",     name: "Comedy",      keywords: ["comedy", "stand-up", "stand up"], description: "Comedy nights, stand-up shows, and touring comedians." },
  { slug: "festivals",  name: "Festivals",   keywords: ["festival"], description: "Festivals across music, culture, and food." },
  { slug: "clubs",      name: "Clubs",       keywords: ["club", "nightclub", "club night"], description: "Club nights and DJ events." },
  { slug: "sports",     name: "Sports",      keywords: ["sport", "football", "boxing", "mma"], description: "Live sports events, matches, and fights." },
];

export function findGenre(slug: string): Genre | undefined {
  const s = slug.toLowerCase();
  return GENRES.find((g) => g.slug === s || g.name.toLowerCase() === s);
}
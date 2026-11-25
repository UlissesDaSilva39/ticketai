export interface Artist {
  id: string;
  name: string;
  role: string;
  color: string;
  location: string;
  bio: string;
  followers: number;
  genres: string[];
}

export const ARTISTS: Artist[] = [
  {
    id: "1",
    name: "Sarah Jenkins",
    role: "Vocalist",
    color: "bg-pink-500",
    location: "London, UK",
    bio: "House and soul vocalist with 10 years of session work. Featured on Toolroom and Defected releases.",
    followers: 12480,
    genres: ["House", "Soul", "R&B"],
  },
  {
    id: "2",
    name: "Taimoor Khan",
    role: "Producer",
    color: "bg-emerald-600",
    location: "Manchester, UK",
    bio: "Techno and breakbeat producer. Releases on Sellick and Breakbeat Paradise.",
    followers: 8730,
    genres: ["Techno", "Breakbeat"],
  },
  {
    id: "3",
    name: "Alex Rivera",
    role: "Producer / DJ",
    color: "bg-indigo-600",
    location: "Berlin, DE",
    bio: "Dark techno and industrial. Regular at Berghain and Tresor.",
    followers: 22150,
    genres: ["Techno", "Industrial"],
  },
  {
    id: "4",
    name: "Luna Park",
    role: "Vocalist",
    color: "bg-purple-600",
    location: "Lisbon, PT",
    bio: "Dream-pop vocalist and songwriter. Solo work plus collabs with Portuguese producers.",
    followers: 5410,
    genres: ["Dream Pop", "Indie"],
  },
  {
    id: "5",
    name: "Marco Bianchi",
    role: "Producer / DJ",
    color: "bg-blue-600",
    location: "Milan, IT",
    bio: "Deep house and soulful house producer. Releases on Defected and Glitterbox.",
    followers: 15620,
    genres: ["House", "Soul", "Deep House"],
  },
  {
    id: "6",
    name: "Nia Okafor",
    role: "Vocalist",
    color: "bg-rose-600",
    location: "Bristol, UK",
    bio: "Neo-soul and R&B vocalist. Featured on BBC Introducing and Spotify Fresh Finds.",
    followers: 9840,
    genres: ["Soul", "R&B", "Neo-Soul"],
  },
  {
    id: "7",
    name: "Kai Andersen",
    role: "Producer",
    color: "bg-teal-600",
    location: "Copenhagen, DK",
    bio: "Minimal techno and industrial sound design. Runs the Cold Matter label.",
    followers: 11200,
    genres: ["Techno", "Industrial", "Minimal"],
  },
  {
    id: "8",
    name: "Ivy Chen",
    role: "Producer / Vocalist",
    color: "bg-fuchsia-600",
    location: "Vancouver, CA",
    bio: "Indie pop and dream-pop crossover. Mixes bedroom production with lush vocals.",
    followers: 7320,
    genres: ["Indie", "Dream Pop", "Bedroom Pop"],
  },
  {
    id: "9",
    name: "Dmitri Volkov",
    role: "DJ",
    color: "bg-zinc-700",
    location: "Amsterdam, NL",
    bio: "Breakbeat and drum & bass. Resident at Jungle Babylon and Noorderslag.",
    followers: 13890,
    genres: ["Breakbeat", "Drum & Bass", "Jungle"],
  },
  {
    id: "10",
    name: "Priya Sharma",
    role: "Vocalist",
    color: "bg-amber-500",
    location: "Birmingham, UK",
    bio: "Soul and R&B vocalist. Backing vocalist for UK house producers and live sessions.",
    followers: 6150,
    genres: ["Soul", "R&B", "House"],
  },
];

export function getArtist(id: string): Artist | undefined {
  return ARTISTS.find((a) => a.id === String(id));
}

export function getAllArtists(): Artist[] {
  return ARTISTS;
}

/**
 * Jaccard similarity on genre sets, blended with follower-count proximity.
 * Returns artists most similar to the one with `currentId`, excluding self.
 * Falls back to follower proximity when no genre overlap exists.
 */
export function getSimilarArtists(currentId: string, limit: number = 5): Artist[] {
  const current = getArtist(currentId);
  if (!current) return [];

  const currentGenres = new Set(current.genres.map((g) => g.toLowerCase()));

  const scored = ARTISTS.filter((a) => a.id !== current.id).map((a) => {
    const genres = new Set(a.genres.map((g) => g.toLowerCase()));
    let intersection = 0;
    for (const g of currentGenres) if (genres.has(g)) intersection++;
    const union = new Set([...currentGenres, ...genres]).size;
    const jaccard = union === 0 ? 0 : intersection / union;

    // Follower proximity: 1.0 when identical, decays toward 0 as gap widens.
    const maxFollowers = Math.max(current.followers, a.followers, 1);
    const followerScore = 1 - Math.abs(current.followers - a.followers) / maxFollowers;

    // Genre overlap is weighted 3x vs follower proximity.
    const score = jaccard * 0.75 + followerScore * 0.25;
    return { artist: a, score, jaccard };
  });

  scored.sort((x, y) => {
    if (y.score !== x.score) return y.score - x.score;
    if (y.jaccard !== x.jaccard) return y.jaccard - x.jaccard;
    return y.artist.followers - x.artist.followers;
  });

  return scored.slice(0, limit).map((s) => s.artist);
}
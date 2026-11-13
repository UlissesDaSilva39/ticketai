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
];

export function getArtist(id: string): Artist | undefined {
  return ARTISTS.find((a) => a.id === String(id));
}

export function getAllArtists(): Artist[] {
  return ARTISTS;
}
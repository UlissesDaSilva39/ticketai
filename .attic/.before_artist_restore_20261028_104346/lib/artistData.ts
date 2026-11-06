// lib/artistData.ts
export type ArtistEvent = { id: string; date: string; city: string; venue: string; ticketUrl: string };
export type ArtistMerch = { id: string; name: string; price: number; currency: string; imageUrl: string; buyUrl: string };
export type ArtistClip  = { id: string; title: string; platform: "youtube" | "tiktok" | "other"; embedUrl: string; watchUrl: string };

export type Artist = {
  id: string;
  name: string;
  spotifyId: string;
  imageUrl?: string;
  genre?: string;
  followers?: number;
  followed?: boolean;
  events: ArtistEvent[];
  merch: ArtistMerch[];
  clips: ArtistClip[];
};

export const artists: Artist[] = [
  {
    id: "james-b-partridge",
    name: "James B Partridge",
    spotifyId: "0gxyHStUsqpMadRV0Di1Qt",
    genre: "Primary School Bangers",
    followers: 42000,
    events: [{ id: "ev-1", date: "2026-11-14", city: "London", venue: "The Dome", ticketUrl: "https://example.com/tickets/jbp-london" }],
    merch: [{ id: "m-1", name: "Primary School Bangers Tour Tee", price: 25, currency: "GBP", imageUrl: "https://picsum.photos/seed/tee1/200/200", buyUrl: "https://example.com/merch/jbp-tee" }],
    clips: [{ id: "c-1", title: "Behind the assembly", platform: "youtube", embedUrl: "https://picsum.photos/seed/clip1/320/180", watchUrl: "https://example.com/clips/jbp-1" }],
  },
  {
    id: "bezerra-da-silva",
    name: "Bezerra da Silva",
    spotifyId: "2LtHfB7Hk8h0Q0Xz2rYh4N",
    genre: "Samba",
    followers: 185000,
    events: [{ id: "ev-2", date: "2026-12-01", city: "Rio de Janeiro", venue: "Circo Voador", ticketUrl: "https://example.com/tickets/bezerra-rio" }],
    merch: [{ id: "m-2", name: "Bezerra 100 Anos Cap", price: 18, currency: "GBP", imageUrl: "https://picsum.photos/seed/cap2/200/200", buyUrl: "https://example.com/merch/bezerra-cap" }],
    clips: [],
  },
  {
    id: "peter-fox",
    name: "Peter Fox",
    spotifyId: "1qYz0HfS4eC7mJx9fQbYbT",
    genre: "German Hip-Hop",
    followers: 620000,
    events: [],
    merch: [],
    clips: [],
  },
];

export function getArtist(idOrSpotifyId: string): Artist | undefined {
  return artists.find((a) => a.id === idOrSpotifyId || a.spotifyId === idOrSpotifyId);
}

export function spotifyEmbedUrl(spotifyId: string): string {
  return `https://open.spotify.com/embed/artist/${spotifyId}?utm_source=generator&theme=0`;
}
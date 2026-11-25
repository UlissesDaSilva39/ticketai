/**
 * Canonical response shapes. Frontend + middle layer MUST agree.
 */

export const mockArtist = {
  id: "art_001",
  name: "Bezerra da Silva",
  slug: "bezerra-da-silva",
  bio: "Samba legend",
  imageUrl: "https://cdn.example.com/bezerra.jpg",
  genres: ["samba", "pagode"],
  socialLinks: { spotify: "https://open.spotify.com/artist/..." },
  merchCount: 3,
  createdAt: "2024-01-01T00:00:00Z",
};

export const mockDiscovery = {
  id: "disc_001",
  slug: "hologram",
  title: "Hologram",
  summary: "Bezerra Centenary Tour hologram project",
  coverUrl: "https://cdn.example.com/hologram.jpg",
  body: "...",
  tags: ["tour", "hologram"],
  publishedAt: "2024-03-01T00:00:00Z",
};

export const mockAnalytics = {
  range: "30d",
  totals: { streams: 125000, revenue: 3400.5, tickets: 820 },
  timeseries: [
    { date: "2024-06-01", streams: 4000, revenue: 120.5 },
  ],
  topArtists: [{ artistId: "art_001", name: "Bezerra da Silva", streams: 50000 }],
};

export const mockUser = {
  id: "usr_001",
  email: "user@example.com",
  name: "Test User",
  role: "artist" as "artist" | "admin" | "fan",
  premium: false,
  verified: false,
};

export const mockNotification = {
  id: "ntf_001",
  type: "royalty" as "royalty" | "social" | "system",
  title: "Royalty payment received",
  body: "You received £120.50 from Spotify",
  read: false,
  createdAt: "2024-06-10T00:00:00Z",
};
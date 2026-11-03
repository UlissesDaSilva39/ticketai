// ============================================================
// GRID Tracks — marketplace for buying, selling, collaborating
// ============================================================

export type TrackLicense = "exclusive" | "non-exclusive" | "lease" | "stems";
export type TrackPricing = "fixed" | "pay-what-you-want" | "split-only";
export type TrackStatus = "available" | "sold" | "reserved";
export type TrackKind = "beat" | "full-track" | "loop-pack" | "stem-pack" | "sample-pack" | "preset-pack";

export type TrackCollaboration = {
  id: string;
  fromName: string;
  fromHandle: string;
  message: string;
  proposedSplit: number;
  status: "pending" | "accepted" | "declined";
  createdAt: number;
};

export type TrackListing = {
  id: string;
  title: string;
  description: string;
  producerName: string;
  producerHandle: string;
  kind: TrackKind;
  license: TrackLicense;
  pricing: TrackPricing;
  price: number;
  splitAvailable: boolean;
  bpm: number;
  key: string;
  genres: string[];
  audioUrl?: string;
  coverColor: string;
  status: TrackStatus;
  views: number;
  saves: number;
  collaborations: TrackCollaboration[];
  createdAt: number;
};

export type TrackPurchase = {
  id: string;
  listingId: string;
  listingTitle: string;
  producerName: string;
  price: number;
  license: TrackLicense;
  purchasedAt: number;
};

const LISTINGS_KEY = "grid:tracks:listings";
const PURCHASES_KEY = "grid:tracks:purchases";
const COLLABS_KEY = "grid:tracks:collabs";

export const SEED_LISTINGS: TrackListing[] = [
  {
    id: "t1",
    title: "Midnight Drive (Beat)",
    description: "Dark synthwave beat. 808s, warm pads, and a driving bassline. Perfect for a moody single.",
    producerName: "Late Night Drive",
    producerHandle: "@nightdrive",
    kind: "beat",
    license: "lease",
    pricing: "fixed",
    price: 45,
    splitAvailable: true,
    bpm: 92,
    key: "F minor",
    genres: ["Synthwave", "Trap", "Electronic"],
    coverColor: "#4f8cff",
    status: "available",
    views: 1240,
    saves: 87,
    collaborations: [],
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: "t2",
    title: "Brazilian Funk Groove",
    description: "Authentic Brazilian funk loop pack. 10 loops in 3 tempos. Ready to drag into your DAW.",
    producerName: "DJ Poxy",
    producerHandle: "@djpoxy",
    kind: "loop-pack",
    license: "non-exclusive",
    pricing: "fixed",
    price: 25,
    splitAvailable: false,
    bpm: 130,
    key: "A minor",
    genres: ["Brazilian Funk", "Funk", "Baile"],
    coverColor: "#00ff87",
    status: "available",
    views: 3200,
    saves: 240,
    collaborations: [],
    createdAt: Date.now() - 86400000 * 7,
  },
  {
    id: "t3",
    title: "Indie Rock Full Track",
    description: "Unreleased full track. Looking for a vocalist for a 50/50 split. Stems available.",
    producerName: "Paper Lions",
    producerHandle: "@paperslions",
    kind: "full-track",
    license: "exclusive",
    pricing: "split-only",
    price: 0,
    splitAvailable: true,
    bpm: 128,
    key: "D major",
    genres: ["Indie", "Rock", "Alternative"],
    coverColor: "#ffb800",
    status: "available",
    views: 890,
    saves: 120,
    collaborations: [],
    createdAt: Date.now() - 86400000 * 1,
  },
  {
    id: "t4",
    title: "Neo-Soul Drum Pack",
    description: "200+ neo-soul drum samples. Recorded live at Red Bull Studios. 24-bit WAV.",
    producerName: "Sonya Alexander",
    producerHandle: "@sonyalex",
    kind: "sample-pack",
    license: "non-exclusive",
    pricing: "fixed",
    price: 35,
    splitAvailable: false,
    bpm: 85,
    key: "C major",
    genres: ["Neo-Soul", "R&B", "Hip-Hop"],
    coverColor: "#a855f7",
    status: "available",
    views: 2100,
    saves: 180,
    collaborations: [],
    createdAt: Date.now() - 86400000 * 14,
  },
];

export function listTracks(): TrackListing[] {
  if (typeof window === "undefined") return SEED_LISTINGS;
  try {
    const raw = localStorage.getItem(LISTINGS_KEY);
    if (!raw) return SEED_LISTINGS;
    return JSON.parse(raw);
  } catch { return SEED_LISTINGS; }
}

export function getTrack(id: string): TrackListing | null {
  return listTracks().find(t => t.id === id) ?? null;
}

export function saveTrack(track: TrackListing) {
  if (typeof window === "undefined") return;
  const all = listTracks();
  const idx = all.findIndex(t => t.id === track.id);
  if (idx >= 0) all[idx] = track;
  else all.unshift(track);
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(all));
}

export function deleteTrack(id: string) {
  if (typeof window === "undefined") return;
  const all = listTracks().filter(t => t.id !== id);
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(all));
}

export function listPurchases(): TrackPurchase[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PURCHASES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function addPurchase(p: TrackPurchase) {
  if (typeof window === "undefined") return;
  const all = listPurchases();
  all.unshift(p);
  localStorage.setItem(PURCHASES_KEY, JSON.stringify(all));
}

export function listCollabs(): TrackCollaboration[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(COLLABS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function addCollab(c: TrackCollaboration) {
  if (typeof window === "undefined") return;
  const all = listCollabs();
  all.unshift(c);
  localStorage.setItem(COLLABS_KEY, JSON.stringify(all));
}

export const KIND_LABELS: Record<TrackKind, string> = {
  "beat": "Beat",
  "full-track": "Full track",
  "loop-pack": "Loop pack",
  "stem-pack": "Stem pack",
  "sample-pack": "Sample pack",
  "preset-pack": "Preset pack",
};

export const LICENSE_LABELS: Record<TrackLicense, string> = {
  "exclusive": "Exclusive",
  "non-exclusive": "Non-exclusive",
  "lease": "Lease",
  "stems": "Stems",
};

export const PRICING_LABELS: Record<TrackPricing, string> = {
  "fixed": "Fixed price",
  "pay-what-you-want": "Pay what you want",
  "split-only": "Split only",
};

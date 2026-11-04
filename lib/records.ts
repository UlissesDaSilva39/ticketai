// ============================================================
// GRID Records — virtual record label data model
// ============================================================

export type ContractType = "exclusive" | "non-exclusive" | "distribution-only" | "360" | "single-deal";
export type ApplicationStatus = "submitted" | "in-review" | "shortlisted" | "signed" | "declined";
export type ReleaseStatus = "draft" | "pending-approval" | "approved" | "live" | "rejected";

export type SignedArtist = {
  id: string;
  handle: string;
  name: string;
  genres: string[];
  signedAt: number;
  contractType: ContractType;
  artistSplit: number;      // percentage
  labelSplit: number;
  bio: string;
  color: string;
  totalReleases: number;
  totalStreams: number;
};

export type Application = {
  id: string;
  artistName: string;
  artistHandle: string;
  email: string;
  genres: string[];
  demoUrl: string;
  message: string;
  status: ApplicationStatus;
  submittedAt: number;
  reviewedAt?: number;
  reviewerNote?: string;
};

export type Release = {
  id: string;
  title: string;
  artistHandle: string;
  artistName: string;
  releaseDate: number;
  status: ReleaseStatus;
  coverColor: string;
  genre: string;
  tracks: number;
  submittedAt: number;
};

export type RoyaltyStatement = {
  id: string;
  period: string;
  artistHandle: string;
  artistName: string;
  grossRevenue: number;
  artistShare: number;
  labelShare: number;
  status: "pending" | "paid";
  paidAt?: number;
};

const ARTISTS_KEY = "grid:records:artists";
const APPLICATIONS_KEY = "grid:records:applications";
const RELEASES_KEY = "grid:records:releases";
const ROYALTIES_KEY = "grid:records:royalties";

export const SEED_ARTISTS: SignedArtist[] = [
  {
    id: "a1", handle: "sonyalex", name: "Sonya Alexander",
    genres: ["R&B", "Neo-Soul", "Pop"],
    signedAt: Date.now() - 86400000 * 365,
    contractType: "exclusive",
    artistSplit: 50, labelSplit: 50,
    bio: "Vocalist and songwriter. Two EPs, one album, touring Europe.",
    color: "#a855f7",
    totalReleases: 3, totalStreams: 1240000,
  },
  {
    id: "a2", handle: "paperslions", name: "Paper Lions",
    genres: ["Indie", "Rock"],
    signedAt: Date.now() - 86400000 * 240,
    contractType: "exclusive",
    artistSplit: 50, labelSplit: 50,
    bio: "Indie four-piece from Bristol. Debut album out now.",
    color: "#ffb800",
    totalReleases: 2, totalStreams: 890000,
  },
  {
    id: "a3", handle: "nightdrive", name: "Late Night Drive",
    genres: ["Synthwave", "Electronic"],
    signedAt: Date.now() - 86400000 * 90,
    contractType: "non-exclusive",
    artistSplit: 70, labelSplit: 30,
    bio: "Synthwave producer. Beats, remixes, film scores.",
    color: "#4f8cff",
    totalReleases: 1, totalStreams: 340000,
  },
];

export const SEED_APPLICATIONS: Application[] = [
  {
    id: "app1", artistName: "DJ Poxy", artistHandle: "djpoxy",
    email: "dj@example.com",
    genres: ["House", "Disco"],
    demoUrl: "https://example.com/demo",
    message: "Ready to sign. 3 unreleased EPs, 12k followers, tour support for major acts.",
    status: "shortlisted",
    submittedAt: Date.now() - 86400000 * 5,
  },
  {
    id: "app2", artistName: "Basement Collective", artistHandle: "basementcollective",
    email: "bc@example.com",
    genres: ["Funk", "Brazilian Funk"],
    demoUrl: "https://example.com/demo2",
    message: "We write, produce, and mix our own work. Looking for a label partner.",
    status: "in-review",
    submittedAt: Date.now() - 86400000 * 12,
  },
];

export const SEED_RELEASES: Release[] = [
  {
    id: "r1", title: "Analog Dreams (EP)",
    artistHandle: "sonyalex", artistName: "Sonya Alexander",
    releaseDate: Date.now() - 86400000 * 30,
    status: "live", coverColor: "#a855f7", genre: "R&B", tracks: 5,
    submittedAt: Date.now() - 86400000 * 60,
  },
  {
    id: "r2", title: "Paper Lions (Album)",
    artistHandle: "paperslions", artistName: "Paper Lions",
    releaseDate: Date.now() - 86400000 * 14,
    status: "live", coverColor: "#ffb800", genre: "Indie Rock", tracks: 10,
    submittedAt: Date.now() - 86400000 * 45,
  },
  {
    id: "r3", title: "Midnight Drive (Single)",
    artistHandle: "nightdrive", artistName: "Late Night Drive",
    releaseDate: Date.now() + 86400000 * 7,
    status: "approved", coverColor: "#4f8cff", genre: "Synthwave", tracks: 1,
    submittedAt: Date.now() - 86400000 * 3,
  },
];

export const SEED_ROYALTIES: RoyaltyStatement[] = [
  {
    id: "roy1", period: "September 2026",
    artistHandle: "sonyalex", artistName: "Sonya Alexander",
    grossRevenue: 1240, artistShare: 620, labelShare: 620,
    status: "paid", paidAt: Date.now() - 86400000 * 20,
  },
  {
    id: "roy2", period: "October 2026",
    artistHandle: "paperslions", artistName: "Paper Lions",
    grossRevenue: 890, artistShare: 445, labelShare: 445,
    status: "pending",
  },
];

export function listArtists(): SignedArtist[] {
  if (typeof window === "undefined") return SEED_ARTISTS;
  try {
    const raw = localStorage.getItem(ARTISTS_KEY);
    return raw ? JSON.parse(raw) : SEED_ARTISTS;
  } catch { return SEED_ARTISTS; }
}

export function getArtist(handle: string): SignedArtist | null {
  return listArtists().find(a => a.handle === handle) ?? null;
}

export function saveArtist(artist: SignedArtist) {
  if (typeof window === "undefined") return;
  const all = listArtists();
  const idx = all.findIndex(a => a.id === artist.id);
  if (idx >= 0) all[idx] = artist;
  else all.push(artist);
  localStorage.setItem(ARTISTS_KEY, JSON.stringify(all));
}

export function listApplications(): Application[] {
  if (typeof window === "undefined") return SEED_APPLICATIONS;
  try {
    const raw = localStorage.getItem(APPLICATIONS_KEY);
    return raw ? JSON.parse(raw) : SEED_APPLICATIONS;
  } catch { return SEED_APPLICATIONS; }
}

export function saveApplication(app: Application) {
  if (typeof window === "undefined") return;
  const all = listApplications();
  const idx = all.findIndex(a => a.id === app.id);
  if (idx >= 0) all[idx] = app;
  else all.unshift(app);
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(all));
}

export function listReleases(): Release[] {
  if (typeof window === "undefined") return SEED_RELEASES;
  try {
    const raw = localStorage.getItem(RELEASES_KEY);
    return raw ? JSON.parse(raw) : SEED_RELEASES;
  } catch { return SEED_RELEASES; }
}

export function saveRelease(r: Release) {
  if (typeof window === "undefined") return;
  const all = listReleases();
  const idx = all.findIndex(x => x.id === r.id);
  if (idx >= 0) all[idx] = r;
  else all.unshift(r);
  localStorage.setItem(RELEASES_KEY, JSON.stringify(all));
}

export function listRoyalties(): RoyaltyStatement[] {
  if (typeof window === "undefined") return SEED_ROYALTIES;
  try {
    const raw = localStorage.getItem(ROYALTIES_KEY);
    return raw ? JSON.parse(raw) : SEED_ROYALTIES;
  } catch { return SEED_ROYALTIES; }
}

export const CONTRACT_LABELS: Record<ContractType, string> = {
  "exclusive": "Exclusive (50/50)",
  "non-exclusive": "Non-exclusive (70/30)",
  "distribution-only": "Distribution only",
  "360": "360 deal",
  "single-deal": "Single deal",
};

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  "submitted": "Submitted",
  "in-review": "In review",
  "shortlisted": "Shortlisted",
  "signed": "Signed",
  "declined": "Declined",
};

export const RELEASE_STATUS_LABELS: Record<ReleaseStatus, string> = {
  "draft": "Draft",
  "pending-approval": "Pending approval",
  "approved": "Approved",
  "live": "Live",
  "rejected": "Rejected",
};

export type LicenceType = "preview" | "full";
export type LicenceStatus = "licensed" | "preview-only" | "pending" | "unlicensed";

export interface LicensedTrack {
  id: string;
  title: string;
  artistName: string;
  artistId: string;
  isrc: string;
  masterOwner: string;
  composer: string;
  publisher: string;
  territories: string[];
  licenceType: LicenceType;
  status: LicenceStatus;
  duration: string;
  plays: number;
  seedRank: number;
  genre: string;
  color: string;
}

export const LICENSED_TRACKS: LicensedTrack[] = [
  {
    id: "track-001",
    title: "Midnight",
    artistName: "Sarah Jenkins",
    artistId: "1",
    isrc: "GB-AYE-26-00001",
    masterOwner: "Toolroom Records",
    composer: "Sarah Jenkins",
    publisher: "PRS",
    territories: ["UK"],
    licenceType: "full",
    status: "licensed",
    duration: "3:45",
    plays: 24500,
    seedRank: 1,
    genre: "House",
    color: "bg-pink-500",
  },
  {
    id: "track-002",
    title: "Cold Matter",
    artistName: "Kai Andersen",
    artistId: "7",
    isrc: "GB-AYE-26-00002",
    masterOwner: "Cold Matter Records",
    composer: "Kai Andersen",
    publisher: "PRS",
    territories: ["UK"],
    licenceType: "full",
    status: "licensed",
    duration: "5:12",
    plays: 18200,
    seedRank: 2,
    genre: "Techno",
    color: "bg-teal-600",
  },
  {
    id: "track-003",
    title: "House Session Vol. 1",
    artistName: "Taimoor Khan",
    artistId: "2",
    isrc: "GB-AYE-26-00003",
    masterOwner: "Sellick",
    composer: "Taimoor Khan",
    publisher: "PRS",
    territories: ["UK"],
    licenceType: "preview",
    status: "preview-only",
    duration: "4:08",
    plays: 12800,
    seedRank: 3,
    genre: "Techno",
    color: "bg-emerald-600",
  },
  {
    id: "track-004",
    title: "Neo-Soul Sessions",
    artistName: "Nia Okafor",
    artistId: "6",
    isrc: "GB-AYE-26-00004",
    masterOwner: "Independent",
    composer: "Nia Okafor",
    publisher: "PRS",
    territories: ["UK"],
    licenceType: "full",
    status: "licensed",
    duration: "4:52",
    plays: 9400,
    seedRank: 4,
    genre: "Soul",
    color: "bg-rose-600",
  },
  {
    id: "track-005",
    title: "Industrial Noise",
    artistName: "Alex Rivera",
    artistId: "3",
    isrc: "GB-AYE-26-00005",
    masterOwner: "Berghain Records",
    composer: "Alex Rivera",
    publisher: "PRS",
    territories: ["UK"],
    licenceType: "full",
    status: "licensed",
    duration: "6:30",
    plays: 8700,
    seedRank: 5,
    genre: "Industrial",
    color: "bg-indigo-600",
  },
  {
    id: "track-006",
    title: "Dream Pop Dreams",
    artistName: "Luna Park",
    artistId: "4",
    isrc: "GB-AYE-26-00006",
    masterOwner: "Independent",
    composer: "Luna Park",
    publisher: "PRS",
    territories: ["UK"],
    licenceType: "preview",
    status: "preview-only",
    duration: "3:22",
    plays: 6200,
    seedRank: 6,
    genre: "Dream Pop",
    color: "bg-purple-600",
  },
  {
    id: "track-007",
    title: "Deep House Vibes",
    artistName: "Marco Bianchi",
    artistId: "5",
    isrc: "GB-AYE-26-00007",
    masterOwner: "Defected",
    composer: "Marco Bianchi",
    publisher: "PRS",
    territories: ["UK"],
    licenceType: "full",
    status: "licensed",
    duration: "5:45",
    plays: 15600,
    seedRank: 7,
    genre: "House",
    color: "bg-blue-600",
  },
  {
    id: "track-008",
    title: "Soulful Sunday",
    artistName: "Priya Sharma",
    artistId: "10",
    isrc: "GB-AYE-26-00008",
    masterOwner: "Independent",
    composer: "Priya Sharma",
    publisher: "PRS",
    territories: ["UK"],
    licenceType: "full",
    status: "licensed",
    duration: "4:20",
    plays: 5100,
    seedRank: 8,
    genre: "Soul",
    color: "bg-amber-500",
  },
  {
    id: "track-009",
    title: "Breakbeat Jungle",
    artistName: "Dmitri Volkov",
    artistId: "9",
    isrc: "GB-AYE-26-00009",
    masterOwner: "Jungle Babylon",
    composer: "Dmitri Volkov",
    publisher: "PRS",
    territories: ["UK"],
    licenceType: "preview",
    status: "preview-only",
    duration: "5:55",
    plays: 3800,
    seedRank: 9,
    genre: "Breakbeat",
    color: "bg-zinc-700",
  },
  {
    id: "track-010",
    title: "Indie Anthem",
    artistName: "Ivy Chen",
    artistId: "8",
    isrc: "GB-AYE-26-00010",
    masterOwner: "Independent",
    composer: "Ivy Chen",
    publisher: "PRS",
    territories: ["UK"],
    licenceType: "full",
    status: "pending",
    duration: "3:55",
    plays: 2900,
    seedRank: 10,
    genre: "Indie",
    color: "bg-fuchsia-600",
  },
];

export function getLicensedTrack(id: string): LicensedTrack | undefined {
  return LICENSED_TRACKS.find((t) => t.id === id);
}

export function getTracksByArtist(artistId: string): LicensedTrack[] {
  return LICENSED_TRACKS.filter((t) => t.artistId === artistId);
}
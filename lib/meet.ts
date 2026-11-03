// ============================================================
// GRID Meet — video meeting data model
// ============================================================

export type MeetKind = "one-to-one" | "group" | "audio-only";
export type MeetPurpose = "collaboration" | "audition" | "label-meeting" | "booking" | "review" | "rehearsal" | "general";

export type MeetParticipant = {
  id: string;
  name: string;
  handle?: string;
  role: "host" | "guest";
  joined: boolean;
};

export type MeetMessage = {
  id: string;
  author: string;
  body: string;
  at: number;
};

export type MeetRoom = {
  id: string;
  title: string;
  purpose: MeetPurpose;
  kind: MeetKind;
  hostName: string;
  hostHandle?: string;
  scheduledFor?: number;
  isPrivate: boolean;
  passcode?: string;
  createdAt: number;
  participants: MeetParticipant[];
  chat: MeetMessage[];
};

const MEET_KEY = "grid:meet:rooms";

export const SEED_MEETS: MeetRoom[] = [
  { id: "m1", title: "Production review — 'Safada de Berço'", purpose: "review", kind: "group", hostName: "Ulisses Bezerra", hostHandle: "@ulisses", scheduledFor: Date.now() + 3600000, isPrivate: true, passcode: "1234", createdAt: Date.now() - 86400000, participants: [ { id: "p1", name: "Ulisses Bezerra", handle: "@ulisses", role: "host", joined: false }, { id: "p2", name: "Tim Snell", role: "guest", joined: false } ], chat: [] },
  { id: "m2", title: "Vocal audition — Sonya Alexander", purpose: "audition", kind: "one-to-one", hostName: "Paper Lions", hostHandle: "@paperslions", scheduledFor: Date.now() + 86400000, isPrivate: false, createdAt: Date.now() - 3600000, participants: [ { id: "p1", name: "Paper Lions", handle: "@paperslions", role: "host", joined: false } ], chat: [] },
];

export function listMeets(): MeetRoom[] {
  if (typeof window === "undefined") return SEED_MEETS;
  try {
    const raw = localStorage.getItem(MEET_KEY);
    if (!raw) return SEED_MEETS;
    return JSON.parse(raw);
  } catch { return SEED_MEETS; }
}

export function getMeet(id: string): MeetRoom | null {
  return listMeets().find(m => m.id === id) ?? null;
}

export function saveMeet(meet: MeetRoom) {
  if (typeof window === "undefined") return;
  const all = listMeets();
  const idx = all.findIndex(m => m.id === meet.id);
  if (idx >= 0) all[idx] = meet;
  else all.unshift(meet);
  localStorage.setItem(MEET_KEY, JSON.stringify(all));
}

export function deleteMeet(id: string) {
  if (typeof window === "undefined") return;
  const all = listMeets().filter(m => m.id !== id);
  localStorage.setItem(MEET_KEY, JSON.stringify(all));
}

export function generateMeetId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const seg = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `${seg(3)}-${seg(4)}-${seg(3)}`;
}

export const PURPOSE_LABELS: Record<MeetPurpose, string> = {
  collaboration: "Collaboration",
  audition: "Audition",
  "label-meeting": "Label meeting",
  booking: "Booking / negotiation",
  review: "Project review",
  rehearsal: "Remote rehearsal",
  general: "General meeting",
};

// Plain module: paid demo submissions and priority messages ("Send your track").
export type SubmissionKind = "demo" | "message";
export const SUBMISSION_PRICE: Record<SubmissionKind, number> = { demo: 199, message: 299 };
/** Share of the fee the reviewer earns when they reply. */
export const REVIEWER_SHARE = 0.5;
export const REPLY_DAYS = 7;
export const VERDICTS = [
  { id: "love", label: "Love it", hint: "I want to talk about this" },
  { id: "maybe", label: "Promising", hint: "Not yet, but keep sending" },
  { id: "pass", label: "Not for us", hint: "Doesn't fit right now" },
] as const;
export type Verdict = (typeof VERDICTS)[number]["id"];
export const isVerdict = (v: unknown): v is Verdict => VERDICTS.some((x) => x.id === v);
export const isSubmissionKind = (v: unknown): v is SubmissionKind => v === "demo" || v === "message";
export const REVIEWER_GENRES = ["House", "Techno", "Drum & Bass", "Hip-Hop", "R&B", "Pop", "Afrobeats", "Indie", "Rock", "Electronic", "Jazz", "Other"];

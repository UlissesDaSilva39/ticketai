// "Open to…" badges shown on profile photos (the music version of "Open to work").
// Values must match the check constraint on profiles.open_to.

export const OPEN_TO = [
  { value: "collabs", label: "Open to collabs", short: "#COLLAB" },
  { value: "bookings", label: "Available for bookings", short: "#BOOKME" },
  { value: "session_work", label: "Open to session work", short: "#SESSIONS" },
  { value: "hiring", label: "Looking for talent", short: "#HIRING" },
] as const;

export type OpenTo = (typeof OPEN_TO)[number]["value"];

export function openToLabels(values: string[] | null | undefined) {
  return OPEN_TO.filter((o) => values?.includes(o.value));
}

export function cleanOpenTo(values: unknown[]): OpenTo[] {
  const allowed = OPEN_TO.map((o) => o.value as string);
  return [...new Set(values.map(String).filter((v) => allowed.includes(v)))] as OpenTo[];
}

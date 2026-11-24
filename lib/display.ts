// Plain display helpers, usable from BOTH server and client code.
// (Keep them out of "use client" files: a server page can't call functions
// exported from a client module.)

type NameSource = { full_name?: string | null; username?: string | null } | null | undefined;

export function displayName(p?: NameSource, email?: string | null) {
  // Old accounts may have their email saved as the name; don't show that.
  const name = p?.full_name && !p.full_name.includes("@") ? p.full_name : null;
  return name || p?.username || email?.split("@")[0] || "You";
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase() || "U";
}

const ROLE_LABELS: Record<string, string> = {
  artist: "Artist / Producer",
  industry: "Venue / A&R",
  record_company: "Record label",
  fan: "Music fan",
  attendee: "Music fan",
  admin: "GRID team",
  promoter: "Promoter",
  venue: "Venue",
  a_and_r: "A&R",
  label: "Label",
  dj: "DJ",
  producer: "Producer",
  manager: "Manager",
};

/** Readable role name; unknown codes like "sound_engineer" become "Sound engineer". */
export function roleLabel(role?: string | null, genre?: string | null) {
  let base = "Member";
  if (role) {
    const key = role.toLowerCase();
    const pretty = key.replace(/_and_/g, " & ").replace(/[_-]+/g, " ").trim();
    base = ROLE_LABELS[key] ?? (pretty ? pretty[0].toUpperCase() + pretty.slice(1) : "Member");
  }
  return genre ? `${base} · ${genre}` : base;
}

export function compactNumber(n: number) {
  return new Intl.NumberFormat("en-GB", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

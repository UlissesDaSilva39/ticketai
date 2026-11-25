// Ranks opportunities for one user. Pure function: easy to test and tweak.

export type Opportunity = {
  id: string;
  title: string;
  org: string;
  category: string | null;
  location: string | null;
  remote: boolean | null;
  compensation: string | null;
  description: string | null;
  deadline: string | null;
  created_by: string | null;
  created_at: string;
};

export type MatchProfile = { role: string | null; city: string | null; genre: string | null };

export type ScoredMatch = Opportunity & { score: number; reasons: string[] };

// Which opportunity categories suit which profile role.
const ROLE_CATEGORIES: Record<string, string[]> = {
  artist: ["gig", "booking", "collab", "session", "remix"],
  a_and_r: ["collab", "job", "booking"],
  record_company: ["collab", "job", "remix"],
  promoter: ["booking", "gig", "job"],
  venue: ["booking", "gig"],
  attendee: ["job"],
};

const ROLE_PLURAL: Record<string, string> = {
  artist: "artists",
  a_and_r: "A&R",
  record_company: "labels",
  promoter: "promoters",
  venue: "venues",
  attendee: "fans",
};

const DAY = 24 * 60 * 60 * 1000;

export function scoreOpportunity(o: Opportunity, me: MatchProfile, now = Date.now()): ScoredMatch {
  let score = 50;
  const reasons: string[] = [];
  const text = `${o.title} ${o.description ?? ""}`.toLowerCase();

  if (me.genre && text.includes(me.genre.toLowerCase())) {
    score += 20;
    reasons.push(`Mentions ${me.genre}`);
  }
  if (me.city && o.location && o.location.toLowerCase().includes(me.city.toLowerCase())) {
    score += 15;
    reasons.push(`In ${o.location}`);
  } else if (o.remote) {
    score += 10;
    reasons.push("Remote");
  }
  const suited = me.role ? ROLE_CATEGORIES[me.role] : undefined;
  if (o.category && suited?.includes(o.category)) {
    score += 10;
    reasons.push(`${o.category[0].toUpperCase()}${o.category.slice(1)} for ${ROLE_PLURAL[me.role ?? ""] ?? "you"}`);
  }
  if (o.compensation) {
    score += 3;
    reasons.push("Paid");
  }
  if (o.deadline) {
    const days = (new Date(o.deadline).getTime() - now) / DAY;
    if (days <= 7) {
      score += 2;
      reasons.push("Closes soon");
    }
  }
  if (now - new Date(o.created_at).getTime() < 3 * DAY) score += 2;

  return { ...o, score: Math.min(99, score), reasons: reasons.length ? reasons : ["New opportunity"] };
}

export function isOpen(o: Opportunity, now = Date.now()) {
  // Open until the end of the deadline day.
  return !o.deadline || new Date(o.deadline).getTime() + DAY > now;
}

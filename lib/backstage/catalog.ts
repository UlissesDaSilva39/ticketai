// Plain module: Backstage fan memberships.
export const BACKSTAGE_PRICES = [300, 500, 1000] as const;
export type BackstagePrice = (typeof BACKSTAGE_PRICES)[number];
export const isBackstagePrice = (v: unknown): v is BackstagePrice => BACKSTAGE_PRICES.includes(v as BackstagePrice);
/** Share of each paid month the artist keeps (GRID keeps the rest). */
export const ARTIST_SHARE = 0.9;
export const DEFAULT_TIER_NAMES: Record<BackstagePrice, string> = { 300: "Supporter", 500: "Insider", 1000: "Inner circle" };
export const ACTIVE_MEMBER_STATUSES = ["active", "trialing", "past_due"];

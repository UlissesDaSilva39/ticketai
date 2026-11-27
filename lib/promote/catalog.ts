// Plain module (safe in the browser): what can be promoted and for how much.

export type PromoKind = "post" | "listing" | "live" | "profile";
export type PromoPlan = "1d" | "3d" | "7d";

export const PROMO_PLANS: { id: PromoPlan; label: string; days: number; pence: number; tag?: string }[] = [
  { id: "1d", label: "24 hours", days: 1, pence: 299 },
  { id: "3d", label: "3 days", days: 3, pence: 699, tag: "Most popular" },
  { id: "7d", label: "7 days", days: 7, pence: 1299, tag: "Best value" },
];

export const PROMO_KINDS: Record<PromoKind, { label: string; where: string }> = {
  post: { label: "Post", where: "Pinned at the top of everyone's home feed" },
  listing: { label: "Marketplace listing", where: "First in the Marketplace with a Promoted label" },
  live: { label: "Live stream", where: "First in Live now on the home page and the GRID LIVE page" },
  profile: { label: "Profile", where: "First in People to follow across GRID" },
};

export const isPromoKind = (v: unknown): v is PromoKind => typeof v === "string" && v in PROMO_KINDS;
export const promoPlan = (id: unknown) => PROMO_PLANS.find((p) => p.id === id);

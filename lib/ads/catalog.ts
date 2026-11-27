// Plain module: self-serve ad plans (sponsored card on GRID).
export type AdPlan = "basic" | "premium";
export const AD_PLANS: Record<AdPlan, { name: string; pence: number; days: number; blurb: string }> = {
  basic: { name: "Basic", pence: 2500, days: 7, blurb: "Sponsored card on GRID for 7 days" },
  premium: { name: "Premium", pence: 15000, days: 30, blurb: "Sponsored card on GRID for 30 days, shown first" },
};
export const isAdPlan = (v: unknown): v is AdPlan => v === "basic" || v === "premium";

// Shared by the /licensing server page and the client hub (plain module: no "use client").
export const HUB_TABS = ["browse", "sell", "mine", "programme"] as const;
export type HubTab = (typeof HUB_TABS)[number];

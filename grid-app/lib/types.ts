export type CardKind = "person" | "venue" | "promoter" | "label" | "admin";

export interface NetworkCard {
  id: string;
  name: string;
  handle: string;
  role: string;        // raw role from source (e.g. "record_company")
  kind: CardKind;
  city: string;
  genres: string[];
  bio?: string;
  hidden?: boolean;    // admin/test accounts — not shown in public feed
}

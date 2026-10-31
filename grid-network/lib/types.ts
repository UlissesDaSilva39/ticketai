export type CardKind = "person" | "venue" | "promoter" | "label";

export interface NetworkCard {
  id: string;
  name: string;
  handle: string;
  role: string;
  kind: CardKind;
  city: string;
  genres: string[];
  bio?: string;
  trust?: string;
  price?: number;
  extra?: string;
}

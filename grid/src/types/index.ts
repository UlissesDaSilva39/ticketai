export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number | "infinity";
  sales: number;
  image: string;
  artistId: string;
  artistName: string;
  description?: string;
};

export type Artist = {
  id: string;
  slug: string;
  name: string;
  cover: string;
  avatar: string;
};

export type Promotion = {
  id: string;
  artistId: string;
  productId: string;
  placements: ("feed_sidebar" | "feed_inline" | "profile_banner")[];
  budget: number;
  durationDays: number;
  startDate: string;
  status: "draft" | "active" | "paused" | "ended";
  impressions: number;
  clicks: number;
  conversions: number;
};
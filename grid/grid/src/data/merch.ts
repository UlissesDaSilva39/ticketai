export interface Merch {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  artistSlug: string;
  artistName: string;
}

export const promotedMerch: Merch[] = [
  { id: "m1", slug: "logo-tee",   name: "Logo Tee",   price: 25, image: "/merch/tee.jpg",    artistSlug: "dj-poxy", artistName: "DJ Poxy" },
  { id: "m2", slug: "2026-vinyl", name: "2026 Vinyl", price: 30, image: "/merch/vinyl.jpg",  artistSlug: "dj-poxy", artistName: "DJ Poxy" },
  { id: "m3", slug: "tour-cap",   name: "Tour Cap",   price: 20, image: "/merch/cap.jpg",    artistSlug: "dj-poxy", artistName: "DJ Poxy" },
];
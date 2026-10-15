import type { Product, Artist } from "@/types";

export const artists: Artist[] = [
  { id: "a1", slug: "dj-poxy", name: "DJ Poxy", cover: "/covers/dj-poxy.jpg", avatar: "/avatars/dj-poxy.jpg" },
];

export const products: Product[] = [
  { id: "p1", name: "Logo Tee",   price: 25, stock: 12,         sales: 8,  image: "/merch/tee.jpg",    artistId: "a1", artistName: "DJ Poxy", description: "Heavyweight cotton tee." },
  { id: "p2", name: "2026 Vinyl", price: 30, stock: "infinity", sales: 3,  image: "/merch/vinyl.jpg",  artistId: "a1", artistName: "DJ Poxy", description: "Limited 12-inch pressing." },
  { id: "p3", name: "Tour Cap",   price: 20, stock: 0,          sales: 15, image: "/merch/cap.jpg",    artistId: "a1", artistName: "DJ Poxy", description: "Embroidered cap." },
  { id: "p4", name: "Poster A2",  price: 15, stock: 8,          sales: 2,  image: "/merch/poster.jpg", artistId: "a1", artistName: "DJ Poxy", description: "A2 tour poster." },
];
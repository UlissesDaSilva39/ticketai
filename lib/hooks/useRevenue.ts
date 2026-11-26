"use client";
import { useCallback, useEffect, useState } from "react";

const SALES_KEY = "grid:sales";
const BOOKINGS_KEY = "grid:bookings";
const FEATURED_GIGS_KEY = "grid:featuredGigs";

export const PLATFORM_COMMISSION = {
  marketplace: 0.10, // 10% on sales
  booking: 0.15,     // 15% on bookings
};

export const FEATURED_GIG_PRICE = 10; // £10 for 7 days
export const FEATURED_GIG_DAYS = 7;

export interface Sale {
  id: string;
  itemId: string;
  itemName: string;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  pricePence: number;
  commissionPence: number;
  at: number;
}

export interface Booking {
  id: string;
  artistId: string;
  artistName: string;
  bookerId: string;
  bookerName: string;
  pricePence: number;
  commissionPence: number;
  at: number;
  status: "pending" | "confirmed";
}

export interface FeaturedGig {
  gigId: string;
  featuredUntil: number;
  paidPence: number;
}

function readSales(): Sale[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SALES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeSales(sales: Sale[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SALES_KEY, JSON.stringify(sales));
    window.dispatchEvent(new CustomEvent("grid:revenueChanged"));
  } catch {}
}

function readBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BOOKINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeBookings(bookings: Booking[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    window.dispatchEvent(new CustomEvent("grid:revenueChanged"));
  } catch {}
}

function readFeatured(): FeaturedGig[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FEATURED_GIGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeFeatured(featured: FeaturedGig[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(FEATURED_GIGS_KEY, JSON.stringify(featured));
    window.dispatchEvent(new CustomEvent("grid:featuredChanged"));
  } catch {}
}

export function useRevenue() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [featured, setFeatured] = useState<FeaturedGig[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSales(readSales());
    setBookings(readBookings());
    setFeatured(readFeatured());
    setHydrated(true);
    const onChange = () => {
      setSales(readSales());
      setBookings(readBookings());
      setFeatured(readFeatured());
    };
    window.addEventListener("grid:revenueChanged", onChange);
    window.addEventListener("grid:featuredChanged", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("grid:revenueChanged", onChange);
      window.removeEventListener("grid:featuredChanged", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const recordSale = useCallback((input: Omit<Sale, "id" | "at" | "commissionPence">) => {
    const commissionPence = Math.round(input.pricePence * PLATFORM_COMMISSION.marketplace);
    const sale: Sale = {
      ...input,
      id: `sale-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      commissionPence,
      at: Date.now(),
    };
    const next = [sale, ...readSales()];
    writeSales(next);
    setSales(next);
    return sale;
  }, []);

  const recordBooking = useCallback((input: Omit<Booking, "id" | "at" | "commissionPence" | "status">) => {
    const commissionPence = Math.round(input.pricePence * PLATFORM_COMMISSION.booking);
    const booking: Booking = {
      ...input,
      id: `booking-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      commissionPence,
      at: Date.now(),
      status: "pending",
    };
    const next = [booking, ...readBookings()];
    writeBookings(next);
    setBookings(next);
    return booking;
  }, []);

  const confirmBooking = useCallback((bookingId: string) => {
    const current = readBookings();
    const next = current.map((b) => b.id === bookingId ? { ...b, status: "confirmed" as const } : b);
    writeBookings(next);
    setBookings(next);
  }, []);

  const featureGig = useCallback((gigId: string, days: number = FEATURED_GIG_DAYS) => {
    const featuredUntil = Date.now() + days * 24 * 60 * 60 * 1000;
    const entry: FeaturedGig = {
      gigId,
      featuredUntil,
      paidPence: FEATURED_GIG_PRICE * 100,
    };
    const current = readFeatured().filter((f) => f.gigId !== gigId);
    const next = [entry, ...current];
    writeFeatured(next);
    setFeatured(next);
    return entry;
  }, []);

  const isGigFeatured = useCallback((gigId: string) => {
    const entry = readFeatured().find((f) => f.gigId === gigId);
    return entry ? entry.featuredUntil > Date.now() : false;
  }, []);

  const totals = {
    marketplaceRevenuePence: sales.reduce((s, x) => s + x.commissionPence, 0),
    bookingRevenuePence: bookings.filter((b) => b.status === "confirmed").reduce((s, x) => s + x.commissionPence, 0),
    featuredRevenuePence: featured.reduce((s, x) => s + x.paidPence, 0),
    platformTotalPence: 0,
  };
  totals.platformTotalPence = totals.marketplaceRevenuePence + totals.bookingRevenuePence + totals.featuredRevenuePence;

  return {
    sales,
    bookings,
    featured,
    totals,
    hydrated,
    recordSale,
    recordBooking,
    confirmBooking,
    featureGig,
    isGigFeatured,
  };
}
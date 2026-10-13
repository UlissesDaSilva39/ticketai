import Link from "next/link";
import type { Metadata } from "next";
import { CITIES } from "@/lib/cities";

export const metadata: Metadata = {
  title: "Cities",
  description: "Browse events, venues, and artists by city on GRID.",
};

export default function CitiesIndexPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1
          className="text-5xl font-bold tracking-tight mb-3"
          style={{ fontFamily: "var(--font-antonio)" }}
          data-testid="cities-heading"
        >
          Cities
        </h1>
        <p className="text-gray-600 mb-10 max-w-2xl">
          Discover events, venues, and artists in each city on GRID.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {CITIES.map((c) => (
            <Link
              key={c.slug}
              href={"/" + c.slug}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
              data-testid="city-tile"
            >
              <div className="font-semibold text-sm">{c.name}</div>
              <div className="text-xs text-gray-500">{c.country}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

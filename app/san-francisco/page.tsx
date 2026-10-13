import type { Metadata } from "next";
import CityPage from "@/components/city/CityPage";

export const metadata: Metadata = {
  title: "Events in San Francisco",
  description: "Discover live music events, venues, and artists in San Francisco.",
};

export default function Page() {
  return <CityPage city="San Francisco" slug="san-francisco" />;
}

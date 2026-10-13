import type { Metadata } from "next";
import CityPage from "@/components/city/CityPage";

export const metadata: Metadata = {
  title: "Events in New York",
  description: "Discover live music events, venues, and artists in New York.",
};

export default function Page() {
  return <CityPage city="New York" slug="new-york" />;
}

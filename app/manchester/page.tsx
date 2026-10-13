import type { Metadata } from "next";
import CityPage from "@/components/city/CityPage";

export const metadata: Metadata = {
  title: "Events in Manchester",
  description: "Discover live music events, venues, and artists in Manchester.",
};

export default function Page() {
  return <CityPage city="Manchester" slug="manchester" />;
}

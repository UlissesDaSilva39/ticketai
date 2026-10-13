import type { Metadata } from "next";
import CityPage from "@/components/city/CityPage";

export const metadata: Metadata = {
  title: "Events in London",
  description: "Discover live music events, venues, and artists in London.",
};

export default function Page() {
  return <CityPage city="London" slug="london" />;
}

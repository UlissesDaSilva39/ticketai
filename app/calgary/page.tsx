import type { Metadata } from "next";
import CityPage from "@/components/city/CityPage";

export const metadata: Metadata = {
  title: "Events in Calgary",
  description: "Discover live music events, venues, and artists in Calgary.",
};

export default function Page() {
  return <CityPage city="Calgary" slug="calgary" />;
}

import type { Metadata } from "next";
import CityPage from "@/components/city/CityPage";

export const metadata: Metadata = {
  title: "Events in Barcelona",
  description: "Discover live music events, venues, and artists in Barcelona.",
};

export default function Page() {
  return <CityPage city="Barcelona" slug="barcelona" />;
}

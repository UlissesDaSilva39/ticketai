import type { Metadata } from "next";
import CityPage from "@/components/city/CityPage";

export const metadata: Metadata = {
  title: "Events in Paris",
  description: "Discover live music events, venues, and artists in Paris.",
};

export default function Page() {
  return <CityPage city="Paris" slug="paris" />;
}

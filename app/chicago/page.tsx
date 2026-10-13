import type { Metadata } from "next";
import CityPage from "@/components/city/CityPage";

export const metadata: Metadata = {
  title: "Events in Chicago",
  description: "Discover live music events, venues, and artists in Chicago.",
};

export default function Page() {
  return <CityPage city="Chicago" slug="chicago" />;
}

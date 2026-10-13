import type { Metadata } from "next";
import CityPage from "@/components/city/CityPage";

export const metadata: Metadata = {
  title: "Events in Dublin",
  description: "Discover live music events, venues, and artists in Dublin.",
};

export default function Page() {
  return <CityPage city="Dublin" slug="dublin" />;
}

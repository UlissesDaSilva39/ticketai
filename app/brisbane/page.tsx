import type { Metadata } from "next";
import CityPage from "@/components/city/CityPage";

export const metadata: Metadata = {
  title: "Events in Brisbane",
  description: "Discover live music events, venues, and artists in Brisbane.",
};

export default function Page() {
  return <CityPage city="Brisbane" slug="brisbane" />;
}

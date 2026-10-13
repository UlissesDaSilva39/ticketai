import type { Metadata } from "next";
import CityPage from "@/components/city/CityPage";

export const metadata: Metadata = {
  title: "Events in Berlin",
  description: "Discover live music events, venues, and artists in Berlin.",
};

export default function Page() {
  return <CityPage city="Berlin" slug="berlin" />;
}

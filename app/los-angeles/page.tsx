import type { Metadata } from "next";
import CityPage from "@/components/city/CityPage";

export const metadata: Metadata = {
  title: "Events in Los Angeles",
  description: "Discover live music events, venues, and artists in Los Angeles.",
};

export default function Page() {
  return <CityPage city="Los Angeles" slug="los-angeles" />;
}

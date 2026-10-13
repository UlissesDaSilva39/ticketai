import type { Metadata } from "next";
import CityPage from "@/components/city/CityPage";

export const metadata: Metadata = {
  title: "Events in Sydney",
  description: "Discover live music events, venues, and artists in Sydney.",
};

export default function Page() {
  return <CityPage city="Sydney" slug="sydney" />;
}

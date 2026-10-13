import type { Metadata } from "next";
import CityPage from "@/components/city/CityPage";

export const metadata: Metadata = {
  title: "Events in Melbourne",
  description: "Discover live music events, venues, and artists in Melbourne.",
};

export default function Page() {
  return <CityPage city="Melbourne" slug="melbourne" />;
}

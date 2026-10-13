import type { Metadata } from "next";
import CityPage from "@/components/city/CityPage";

export const metadata: Metadata = {
  title: "Events in Montreal",
  description: "Discover live music events, venues, and artists in Montreal.",
};

export default function Page() {
  return <CityPage city="Montreal" slug="montreal" />;
}

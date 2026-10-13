import type { Metadata } from "next";
import CityPage from "@/components/city/CityPage";

export const metadata: Metadata = {
  title: "Events in Miami",
  description: "Discover live music events, venues, and artists in Miami.",
};

export default function Page() {
  return <CityPage city="Miami" slug="miami" />;
}

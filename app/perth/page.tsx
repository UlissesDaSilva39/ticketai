import type { Metadata } from "next";
import CityPage from "@/components/city/CityPage";

export const metadata: Metadata = {
  title: "Events in Perth",
  description: "Discover live music events, venues, and artists in Perth.",
};

export default function Page() {
  return <CityPage city="Perth" slug="perth" />;
}

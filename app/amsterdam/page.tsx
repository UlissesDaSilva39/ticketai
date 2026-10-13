import type { Metadata } from "next";
import CityPage from "@/components/city/CityPage";

export const metadata: Metadata = {
  title: "Events in Amsterdam",
  description: "Discover live music events, venues, and artists in Amsterdam.",
};

export default function Page() {
  return <CityPage city="Amsterdam" slug="amsterdam" />;
}

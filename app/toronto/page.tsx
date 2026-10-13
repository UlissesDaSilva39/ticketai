import type { Metadata } from "next";
import CityPage from "@/components/city/CityPage";

export const metadata: Metadata = {
  title: "Events in Toronto",
  description: "Discover live music events, venues, and artists in Toronto.",
};

export default function Page() {
  return <CityPage city="Toronto" slug="toronto" />;
}

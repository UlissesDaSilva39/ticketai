import type { Metadata } from "next";
import CityPage from "@/components/city/CityPage";

export const metadata: Metadata = {
  title: "Events in Bristol",
  description: "Discover live music events, venues, and artists in Bristol.",
};

export default function Page() {
  return <CityPage city="Bristol" slug="bristol" />;
}

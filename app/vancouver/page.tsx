import type { Metadata } from "next";
import CityPage from "@/components/city/CityPage";

export const metadata: Metadata = {
  title: "Events in Vancouver",
  description: "Discover live music events, venues, and artists in Vancouver.",
};

export default function Page() {
  return <CityPage city="Vancouver" slug="vancouver" />;
}

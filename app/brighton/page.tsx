import type { Metadata } from "next";
import CityPage from "@/components/city/CityPage";

export const metadata: Metadata = {
  title: "Events in Brighton",
  description: "Discover live music events, venues, and artists in Brighton.",
};

export default function Page() {
  return <CityPage city="Brighton" slug="brighton" />;
}

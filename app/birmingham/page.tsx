import type { Metadata } from "next";
import CityPage from "@/components/city/CityPage";

export const metadata: Metadata = {
  title: "Events in Birmingham",
  description: "Discover live music events, venues, and artists in Birmingham.",
};

export default function Page() {
  return <CityPage city="Birmingham" slug="birmingham" />;
}

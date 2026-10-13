import type { Metadata } from "next";
import CityPage from "@/components/city/CityPage";

export const metadata: Metadata = {
  title: "Events in Leeds",
  description: "Discover live music events, venues, and artists in Leeds.",
};

export default function Page() {
  return <CityPage city="Leeds" slug="leeds" />;
}

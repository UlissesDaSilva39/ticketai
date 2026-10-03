import { CityEventsPage, cityMetadata, type CityMeta } from "@/components/CityPage";

const city: CityMeta = {
  slug: "brisbane",
  name: "Brisbane",
  region: "Australia",
  blurb:
    "River-side venues, live music, and the best of Brisbane's nightlife.",
};

export const metadata = cityMetadata(city);

export default function Page() {
  return <CityEventsPage city={city} />;
}
import { CityEventsPage, cityMetadata, type CityMeta } from "@/components/CityPage";

const city: CityMeta = {
  slug: "los-angeles",
  name: "Los Angeles",
  region: "United States",
  blurb:
    "Rooftop parties, warehouse shows, and the best of LA's music and nightlife.",
};

export const metadata = cityMetadata(city);

export default function Page() {
  return <CityEventsPage city={city} />;
}
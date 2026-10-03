import { CityEventsPage, cityMetadata, type CityMeta } from "@/components/CityPage";

const city: CityMeta = {
  slug: "san-francisco",
  name: "San Francisco",
  region: "United States",
  blurb:
    "Warehouse parties, intimate venues, and the best of SF's music scene.",
};

export const metadata = cityMetadata(city);

export default function Page() {
  return <CityEventsPage city={city} />;
}
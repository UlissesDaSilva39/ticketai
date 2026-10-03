import { CityEventsPage, cityMetadata, type CityMeta } from "@/components/CityPage";

const city: CityMeta = {
  slug: "vancouver",
  name: "Vancouver",
  region: "Canada",
  blurb:
    "Downtown clubs, mountain views, and the best of Vancouver's music and nightlife.",
};

export const metadata = cityMetadata(city);

export default function Page() {
  return <CityEventsPage city={city} />;
}
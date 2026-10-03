import { CityEventsPage, cityMetadata, type CityMeta } from "@/components/CityPage";

const city: CityMeta = {
  slug: "barcelona",
  name: "Barcelona",
  region: "Spain",
  blurb:
    "Beach clubs, rooftop parties, and the best of Barcelona's music scene.",
};

export const metadata = cityMetadata(city);

export default function Page() {
  return <CityEventsPage city={city} />;
}
import { CityEventsPage, cityMetadata, type CityMeta } from "@/components/CityPage";

const city: CityMeta = {
  slug: "paris",
  name: "Paris",
  region: "France",
  blurb:
    "From Le Marais to Montmartre — Paris's best nightlife, concerts, and cultural events.",
};

export const metadata = cityMetadata(city);

export default function Page() {
  return <CityEventsPage city={city} />;
}
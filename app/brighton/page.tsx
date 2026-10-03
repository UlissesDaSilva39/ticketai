import { CityEventsPage, cityMetadata, type CityMeta } from "@/components/CityPage";

const city: CityMeta = {
  slug: "brighton",
  name: "Brighton",
  region: "United Kingdom",
  blurb:
    "Seafront gigs, beach parties, and the best of Brighton's music and nightlife.",
};

export const metadata = cityMetadata(city);

export default function Page() {
  return <CityEventsPage city={city} />;
}
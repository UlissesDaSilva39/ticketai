import { CityEventsPage, cityMetadata, type CityMeta } from "@/components/CityPage";

const city: CityMeta = {
  slug: "perth",
  name: "Perth",
  region: "Australia",
  blurb:
    "From Northbridge to the beach — the best events and nightlife in Perth.",
};

export const metadata = cityMetadata(city);

export default function Page() {
  return <CityEventsPage city={city} />;
}
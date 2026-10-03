import { CityEventsPage, cityMetadata, type CityMeta } from "@/components/CityPage";

const city: CityMeta = {
  slug: "manchester",
  name: "Manchester",
  region: "United Kingdom",
  blurb:
    "Northern soul, house, indie, and everything in between — Manchester's best events, all in one place.",
};

export const metadata = cityMetadata(city);

export default function Page() {
  return <CityEventsPage city={city} />;
}
import { CityEventsPage, cityMetadata, type CityMeta } from "@/components/CityPage";

const city: CityMeta = {
  slug: "amsterdam",
  name: "Amsterdam",
  region: "Netherlands",
  blurb:
    "Canal-side clubs, warehouse parties, and world-class live music in Amsterdam.",
};

export const metadata = cityMetadata(city);

export default function Page() {
  return <CityEventsPage city={city} />;
}
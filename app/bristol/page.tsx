
import { CityEventsPage, cityMetadata, type CityMeta } from "@/components/CityPage";

const city: CityMeta = {
  slug: "bristol",
  name: "Bristol",
  region: "United Kingdom",
  blurb:
    "From Stokes Croft to the Harbourside — Bristol's independent music and nightlife scene, all in one place.",
};

export const metadata = cityMetadata(city);

export default function Page() {
  return <CityEventsPage city={city} />;
}
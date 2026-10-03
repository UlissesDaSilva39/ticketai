import { CityEventsPage, cityMetadata, type CityMeta } from "@/components/CityPage";

const city: CityMeta = {
  slug: "miami",
  name: "Miami",
  region: "United States",
  blurb:
    "Beach clubs, electronic music festivals, and the best of Miami's nightlife.",
};

export const metadata = cityMetadata(city);

export default function Page() {
  return <CityEventsPage city={city} />;
}
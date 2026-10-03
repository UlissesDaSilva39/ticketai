import { CityEventsPage, cityMetadata, type CityMeta } from "@/components/CityPage";

const city: CityMeta = {
  slug: "calgary",
  name: "Calgary",
  region: "Canada",
  blurb:
    "Stampede City — from the Saddledome to 17th Avenue, find what's on in Calgary.",
};

export const metadata = cityMetadata(city);

export default function Page() {
  return <CityEventsPage city={city} />;
}
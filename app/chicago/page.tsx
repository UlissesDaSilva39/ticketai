import { CityEventsPage, cityMetadata, type CityMeta } from "@/components/CityPage";

const city: CityMeta = {
  slug: "chicago",
  name: "Chicago",
  region: "United States",
  blurb:
    "The birthplace of house music — clubs, live venues, and everything in between.",
};

export const metadata = cityMetadata(city);

export default function Page() {
  return <CityEventsPage city={city} />;
}
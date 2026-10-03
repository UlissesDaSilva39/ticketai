import { CityEventsPage, cityMetadata, type CityMeta } from "@/components/CityPage";

const city: CityMeta = {
  slug: "dublin",
  name: "Dublin",
  region: "Ireland",
  blurb:
    "Temple Bar, live gigs, and the best of Dublin's famous nightlife.",
};

export const metadata = cityMetadata(city);

export default function Page() {
  return <CityEventsPage city={city} />;
}
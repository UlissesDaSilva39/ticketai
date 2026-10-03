import { CityEventsPage, cityMetadata, type CityMeta } from "@/components/CityPage";

const city: CityMeta = {
  slug: "toronto",
  name: "Toronto",
  region: "Canada",
  blurb:
    "From Kensington Market to the Entertainment District — Toronto's best nightlife and live events.",
};

export const metadata = cityMetadata(city);

export default function Page() {
  return <CityEventsPage city={city} />;
}
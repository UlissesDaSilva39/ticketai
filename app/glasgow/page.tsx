import { CityEventsPage, cityMetadata, type CityMeta } from "@/components/CityPage";

const city: CityMeta = {
  slug: "glasgow",
  name: "Glasgow",
  region: "Scotland",
  blurb:
    "From the Sub Club to King Tut's — Glasgow's legendary nightlife and live music scene.",
};

export const metadata = cityMetadata(city);

export default function Page() {
  return <CityEventsPage city={city} />;
}
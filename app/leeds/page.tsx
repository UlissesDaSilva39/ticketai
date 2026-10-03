import { CityEventsPage, cityMetadata, type CityMeta } from "@/components/CityPage";

const city: CityMeta = {
  slug: "leeds",
  name: "Leeds",
  region: "United Kingdom",
  blurb:
    "House, indie, and everything in between — discover what's happening across Leeds.",
};

export const metadata = cityMetadata(city);

export default function Page() {
  return <CityEventsPage city={city} />;
}
import { CityEventsPage, cityMetadata, type CityMeta } from "@/components/CityPage";

const city: CityMeta = {
  slug: "london",
  name: "London",
  region: "United Kingdom",
  blurb:
    "From warehouse raves in Hackney to jazz nights in Soho — find every London event on TicketAI.",
};

export const metadata = cityMetadata(city);

export default function Page() {
  return <CityEventsPage city={city} />;
}
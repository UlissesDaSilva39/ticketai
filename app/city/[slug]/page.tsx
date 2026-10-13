import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCity } from "@/lib/cities";
import { loadCityData } from "@/lib/city-data";
import CityLanding from "@/components/city/CityLanding";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) return { title: "City not found" };
  return {
    title: city.name + " events, venues & artists",
    description: city.blurb,
    openGraph: {
      title: city.name + " on GRID",
      description: city.blurb,
      type: "website",
    },
  };
}

export default async function CityPage({ params }: Props) {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();

  const { venues, events, artists } = await loadCityData(city);

  return <CityLanding city={city} venues={venues} events={events} artists={artists} />;
}

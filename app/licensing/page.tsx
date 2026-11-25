import LicensingHub from "@/components/licensing/LicensingHub";
import { HUB_TABS, type HubTab } from "@/components/licensing/tabs";

export const metadata = {
  title: "Music Licensing | GRID",
  description: "Licence cleared music from independent artists with a signed agreement in seconds, or licence your own tracks and get paid.",
};

// /licensing: one hub for everything licensing.
//   ?tab=browse (default) find & licence music
//   ?tab=sell             list your tracks
//   ?tab=mine             my licences, listings and earnings
//   ?tab=programme        licence your catalogue to GRID + rights info
export default async function LicensingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const t = (await searchParams).tab;
  const initialTab: HubTab = typeof t === "string" && (HUB_TABS as readonly string[]).includes(t) ? (t as HubTab) : "browse";
  return <LicensingHub initialTab={initialTab} />;
}

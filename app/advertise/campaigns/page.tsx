import { Suspense } from "react";
import Campaigns from "./Campaigns";

export const metadata = { title: "My ad campaigns | GRID" };

export default function CampaignsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-zinc-950" />}>
      <Campaigns />
    </Suspense>
  );
}

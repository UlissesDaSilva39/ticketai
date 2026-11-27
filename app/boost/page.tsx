import { Suspense } from "react";
import BoostHub from "./BoostHub";

export const metadata = { title: "Boost | GRID" };

export default function BoostPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-zinc-950" />}>
      <BoostHub />
    </Suspense>
  );
}

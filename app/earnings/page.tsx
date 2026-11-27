import { Suspense } from "react";
import Earnings from "./Earnings";

export const metadata = { title: "Earnings | GRID" };

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-zinc-950" />}>
      <Earnings />
    </Suspense>
  );
}

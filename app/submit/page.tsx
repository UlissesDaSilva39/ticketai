import { Suspense } from "react";
import SubmitHub from "./SubmitHub";

export const metadata = { title: "Send your track | GRID" };

export default function SubmitPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-zinc-950" />}>
      <SubmitHub />
    </Suspense>
  );
}

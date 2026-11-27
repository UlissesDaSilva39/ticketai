import { Suspense } from "react";
import ArtistBackstage from "./ArtistBackstage";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return { title: `@${username} Backstage | GRID`, description: "Exclusive posts, early tracks and a direct line to the artist." };
}

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-zinc-950" />}>
      <ArtistBackstage username={username} />
    </Suspense>
  );
}

"use client";

import { useSavedEvents } from "@/components/wallet/useSavedEvents";
import { SavedIndicator } from "@/components/wallet/SavedIndicator";

// Use inside EventCard:
//   <DiscoverSavedLayer eventId={event.id} />
// It renders a small "saved" pill on the card if the event is in
// the user's saved list.

export function DiscoverSavedLayer({ eventId }: { eventId: string }) {
  const { saved, ready } = useSavedEvents();
  if (!ready) return null;
  return <SavedIndicator saved={saved.has(eventId)} />;
}
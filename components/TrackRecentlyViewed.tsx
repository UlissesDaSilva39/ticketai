"use client";

import { useEffect } from "react";
import { useRecentlyViewed, RecentlyViewedItem } from "@/lib/hooks/useRecentlyViewed";

type TrackProps = Omit<RecentlyViewedItem, "viewedAt">;

export default function TrackRecentlyViewed(props: TrackProps) {
  const { add } = useRecentlyViewed();

  useEffect(() => {
    if (!props.id || !props.href) return;
    add(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.id, props.type]);

  return null;
}
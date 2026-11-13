"use client";
import { useEffect } from "react";
import { useRecentlyViewed, RecentlyViewedItem } from "@/lib/hooks/useRecentlyViewed";
import { useBadges } from "@/lib/hooks/useBadges";

type TrackProps = Omit<RecentlyViewedItem, "viewedAt">;

export default function TrackRecentlyViewed(props: TrackProps) {
  const { add } = useRecentlyViewed();
  const { increment } = useBadges();

  useEffect(() => {
    if (!props.id || !props.href) return;
    add(props);
    if (props.type === "artist") increment("artistViews");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.id, props.type]);

  return null;
}
"use client";

import { useEffect } from "react";
import { refreshMe } from "@/lib/hooks/useMe";

/** After a conversation is opened (and marked read), update the navbar's unread badge. */
export default function RefreshUnread({ conversationId }: { conversationId: string }) {
  useEffect(() => {
    refreshMe();
  }, [conversationId]);
  return null;
}

"use client";
import { useCallback, useEffect, useState } from "react";

const KEY = "grid:notifications";
const READ_KEY = "grid:notificationsRead";

export type NotificationKind = "badge" | "referral" | "booking" | "sale" | "gig";

export interface Notification {
  id: string;
  kind: NotificationKind;
  title: string;
  body?: string;
  href?: string;
  at: number;
}

function read(): Notification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function write(items: Notification[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("grid:notificationsChanged"));
  } catch {}
}

function readRead(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(READ_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeRead(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(READ_KEY, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent("grid:notificationsReadChanged"));
  } catch {}
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setNotifications(read());
    setReadIds(readRead());
    setHydrated(true);
    const onChange = () => {
      setNotifications(read());
      setReadIds(readRead());
    };
    window.addEventListener("grid:notificationsChanged", onChange);
    window.addEventListener("grid:notificationsReadChanged", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("grid:notificationsChanged", onChange);
      window.removeEventListener("grid:notificationsReadChanged", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const add = useCallback((input: Omit<Notification, "id" | "at">) => {
    const n: Notification = {
      ...input,
      id: "notif-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
      at: Date.now(),
    };
    const next = [n, ...read()].slice(0, 50);
    write(next);
    setNotifications(next);
    return n;
  }, []);

  const markAllRead = useCallback(() => {
    const all = read().map((n) => n.id);
    writeRead(all);
    setReadIds(all);
  }, []);

  const clearAll = useCallback(() => {
    write([]);
    writeRead([]);
    setNotifications([]);
    setReadIds([]);
  }, []);

  const unread = notifications.filter((n) => !readIds.includes(n.id));
  const unreadCount = unread.length;

  return { notifications, unread, unreadCount, hydrated, add, markAllRead, clearAll };
}
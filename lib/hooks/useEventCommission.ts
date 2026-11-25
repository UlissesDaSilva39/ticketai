"use client";
import { useCallback, useEffect, useState } from "react";

const COMMISSIONS_KEY = "grid:eventCommissions";
export const EVENT_COMMISSION_RATE = 0.05;

export interface EventCommission {
  id: string;
  eventId: string;
  eventTitle: string;
  buyerName: string;
  quantity: number;
  pricePerTicketPence: number;
  totalPence: number;
  commissionPence: number;
  artistPence: number;
  recordedAt: number;
}

function read(): EventCommission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(COMMISSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function write(commissions: EventCommission[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(COMMISSIONS_KEY, JSON.stringify(commissions));
    window.dispatchEvent(new CustomEvent("grid:eventCommissionsChanged"));
  } catch {}
}

export function useEventCommission() {
  const [commissions, setCommissions] = useState<EventCommission[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCommissions(read());
    setHydrated(true);
    const onChange = () => setCommissions(read());
    window.addEventListener("grid:eventCommissionsChanged", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("grid:eventCommissionsChanged", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const recordCommission = useCallback((input: {
    eventId: string;
    eventTitle: string;
    buyerName: string;
    quantity: number;
    pricePerTicketPence: number;
  }) => {
    const totalPence = input.pricePerTicketPence * input.quantity;
    const commissionPence = Math.round(totalPence * EVENT_COMMISSION_RATE);
    const artistPence = totalPence - commissionPence;

    const commission: EventCommission = {
      id: "comm-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
      eventId: input.eventId,
      eventTitle: input.eventTitle,
      buyerName: input.buyerName,
      quantity: input.quantity,
      pricePerTicketPence: input.pricePerTicketPence,
      totalPence,
      commissionPence,
      artistPence,
      recordedAt: Date.now(),
    };

    const next = [commission, ...read()];
    write(next);
    setCommissions(next);
    return commission;
  }, []);

  const getEventTotals = useCallback((eventId: string) => {
    const eventCommissions = commissions.filter((c) => c.eventId === eventId);
    return {
      ticketsSold: eventCommissions.reduce((sum, c) => sum + c.quantity, 0),
      grossPence: eventCommissions.reduce((sum, c) => sum + c.totalPence, 0),
      commissionPence: eventCommissions.reduce((sum, c) => sum + c.commissionPence, 0),
      artistPence: eventCommissions.reduce((sum, c) => sum + c.artistPence, 0),
    };
  }, [commissions]);

  const getOverallTotals = useCallback(() => {
    return {
      totalSales: commissions.length,
      ticketsSold: commissions.reduce((sum, c) => sum + c.quantity, 0),
      grossPence: commissions.reduce((sum, c) => sum + c.totalPence, 0),
      commissionPence: commissions.reduce((sum, c) => sum + c.commissionPence, 0),
      artistPence: commissions.reduce((sum, c) => sum + c.artistPence, 0),
    };
  }, [commissions]);

  return { commissions, hydrated, recordCommission, getEventTotals, getOverallTotals };
}
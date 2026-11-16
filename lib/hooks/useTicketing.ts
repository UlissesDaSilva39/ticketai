"use client";
import { useCallback, useEffect, useState } from "react";

const SALES_KEY = "grid:ticketSales";
const MY_TICKETS_KEY = "grid:myTickets";

export const TICKET_COMMISSION = 0.05;

export interface TicketSale {
  id: string;
  eventId: string;
  eventTitle: string;
  buyerName: string;
  buyerEmail: string;
  quantity: number;
  pricePerTicketPence: number;
  totalPence: number;
  commissionPence: number;
  artistPence: number;
  purchasedAt: number;
}

export interface MyTicket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  quantity: number;
  totalPence: number;
  purchasedAt: number;
  ticketCode: string;
}

function readSales(): TicketSale[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SALES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeSales(sales: TicketSale[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SALES_KEY, JSON.stringify(sales));
    window.dispatchEvent(new CustomEvent("grid:ticketsChanged"));
  } catch {}
}

function readMyTickets(): MyTicket[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(MY_TICKETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeMyTickets(tickets: MyTicket[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MY_TICKETS_KEY, JSON.stringify(tickets));
    window.dispatchEvent(new CustomEvent("grid:myTicketsChanged"));
  } catch {}
}

function generateTicketCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "GRID-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function useTicketing() {
  const [sales, setSales] = useState<TicketSale[]>([]);
  const [myTickets, setMyTickets] = useState<MyTicket[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSales(readSales());
    setMyTickets(readMyTickets());
    setHydrated(true);
    const onChange = () => {
      setSales(readSales());
      setMyTickets(readMyTickets());
    };
    window.addEventListener("grid:ticketsChanged", onChange);
    window.addEventListener("grid:myTicketsChanged", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("grid:ticketsChanged", onChange);
      window.removeEventListener("grid:myTicketsChanged", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const purchaseTickets = useCallback((input: {
    eventId: string;
    eventTitle: string;
    eventDate: string;
    eventVenue: string;
    buyerName: string;
    buyerEmail: string;
    quantity: number;
    pricePerTicketPence: number;
  }) => {
    const totalPence = input.pricePerTicketPence * input.quantity;
    const commissionPence = Math.round(totalPence * TICKET_COMMISSION);
    const artistPence = totalPence - commissionPence;

    const sale: TicketSale = {
      id: "sale-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
      eventId: input.eventId,
      eventTitle: input.eventTitle,
      buyerName: input.buyerName,
      buyerEmail: input.buyerEmail,
      quantity: input.quantity,
      pricePerTicketPence: input.pricePerTicketPence,
      totalPence,
      commissionPence,
      artistPence,
      purchasedAt: Date.now(),
    };

    const nextSales = [sale, ...readSales()];
    writeSales(nextSales);
    setSales(nextSales);

    const myTicket: MyTicket = {
      id: "ticket-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
      eventId: input.eventId,
      eventTitle: input.eventTitle,
      eventDate: input.eventDate,
      eventVenue: input.eventVenue,
      quantity: input.quantity,
      totalPence,
      purchasedAt: Date.now(),
      ticketCode: generateTicketCode(),
    };

    const nextTickets = [myTicket, ...readMyTickets()];
    writeMyTickets(nextTickets);
    setMyTickets(nextTickets);

    return myTicket;
  }, []);

  const totals = {
    totalSalesPence: sales.reduce((sum, s) => sum + s.totalPence, 0),
    totalCommissionPence: sales.reduce((sum, s) => sum + s.commissionPence, 0),
    totalArtistPence: sales.reduce((sum, s) => sum + s.artistPence, 0),
    ticketsSold: sales.reduce((sum, s) => sum + s.quantity, 0),
  };

  return { sales, myTickets, totals, hydrated, purchaseTickets };
}
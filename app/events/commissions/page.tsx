"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Commission {
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

export default function EventCommissionsPage() {
  const [items, setItems] = useState<Commission[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("grid:eventCommissions");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {}
  }, []);

  const totalTickets = items.reduce(function(sum, c) { return sum + (c.quantity || 0); }, 0);
  const totalGross = items.reduce(function(sum, c) { return sum + (c.totalPence || 0); }, 0);
  const totalCommission = items.reduce(function(sum, c) { return sum + (c.commissionPence || 0); }, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/events" className="text-xs font-semibold text-gray-500 hover:text-emerald-600 mb-6 inline-block">
          Back to events
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Event Commissions</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Your revenue from ticket sales on GRID. Every ticket = 5% commission.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-8 text-center">
            <div className="text-5xl mb-4">💰</div>
            <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">No commissions yet</p>
            <p className="text-xs text-gray-500 mb-4">Commissions are recorded when someone buys a ticket.</p>
            <Link href="/events" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg">
              Browse events
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Tickets Sold</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalTickets}</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Gross</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">£{(totalGross / 100).toFixed(2)}</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">GRID Fee (5%)</p>
                <p className="text-2xl font-bold text-emerald-600">£{(totalCommission / 100).toFixed(2)}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4">
              <h2 className="font-bold text-gray-900 dark:text-white mb-3">Recent commissions</h2>
              {items.map(function(c) {
                return (
                  <div key={c.id} className="py-2 border-b border-gray-100 dark:border-zinc-800 last:border-0">
                    <p className="font-bold text-sm text-gray-900 dark:text-white">{c.eventTitle}</p>
                    <p className="text-xs text-gray-500">{c.quantity} tickets · {c.buyerName}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
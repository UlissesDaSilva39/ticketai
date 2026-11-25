"use client";
import Link from "next/link";
import { useTicketing } from "@/lib/hooks/useTicketing";

export default function MyTicketsPage() {
  const { myTickets, hydrated } = useTicketing();
  if (!hydrated) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/events" className="text-xs font-semibold text-gray-500 hover:text-emerald-600 mb-6 inline-block">
          ← Back to events
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Tickets</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            All your purchased tickets on GRID.
          </p>
        </div>

        {myTickets.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-zinc-800 mx-auto mb-4 flex items-center justify-center text-2xl">
              🎫
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">No tickets yet</p>
            <p className="text-xs text-gray-500 mb-4">Browse events and get your first ticket.</p>
            <Link href="/events" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg">
              Browse events →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myTickets.map((ticket) => (
              <div key={ticket.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{ticket.eventTitle}</p>
                    <p className="text-xs text-gray-500">{ticket.eventVenue} · {ticket.eventDate}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    CONFIRMED
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-t border-b border-gray-100 dark:border-zinc-800">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Ticket code</p>
                    <p className="font-mono font-bold text-sm text-gray-900 dark:text-white">{ticket.ticketCode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase">Quantity</p>
                    <p className="font-bold text-sm text-gray-900 dark:text-white">{ticket.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase">Paid</p>
                    <p className="font-bold text-sm text-emerald-600">£{(ticket.totalPence / 100).toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Link href={"/events/" + ticket.eventId} className="text-xs font-bold text-emerald-600 hover:underline">
                    View event →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
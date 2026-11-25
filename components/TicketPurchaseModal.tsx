"use client";
import { useState } from "react";
import { useTicketing, TICKET_COMMISSION } from "@/lib/hooks/useTicketing";
import { GridEvent } from "@/lib/data/events";

interface Props {
  event: GridEvent;
  open: boolean;
  onClose: () => void;
}

export default function TicketPurchaseModal({ event, open, onClose }: Props) {
  const { purchaseTickets } = useTicketing();
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("Ulisses Silva");
  const [email, setEmail] = useState("ulisses@example.com");
  const [success, setSuccess] = useState<{ code: string } | null>(null);

  if (!open) return null;

  const totalPence = event.pricePence * quantity;
  const commissionPence = Math.round(totalPence * TICKET_COMMISSION);
  const artistPence = totalPence - commissionPence;

  const handlePurchase = () => {
    if (!name.trim() || !email.trim()) return;
    const ticket = purchaseTickets({
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      eventVenue: event.venue + ", " + event.city,
      buyerName: name,
      buyerEmail: email,
      quantity,
      pricePerTicketPence: event.pricePence,
    });
    setSuccess({ code: ticket.ticketCode });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Tickets confirmed!</h2>
            <p className="text-sm text-gray-500 mb-4">Check your email for the ticket.</p>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 mb-4">
              <p className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-bold mb-1">Your ticket code</p>
              <p className="font-mono font-bold text-emerald-800 dark:text-emerald-300 text-lg">{success.code}</p>
            </div>
            <button onClick={onClose} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg">
              Done
            </button>
          </div>
        ) : (
          <>
            <div className={"bg-gradient-to-br " + event.color + " p-5 text-white"}>
              <h2 className="text-lg font-bold mb-1">{event.title}</h2>
              <p className="text-xs opacity-90">{event.venue} · {event.city} · {event.date}</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600 dark:text-zinc-400">Quantity</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full border border-gray-300 dark:border-zinc-700 grid place-items-center text-gray-700 dark:text-zinc-300">−</button>
                  <span className="w-8 text-center font-bold text-gray-900 dark:text-white">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-8 h-8 rounded-full border border-gray-300 dark:border-zinc-700 grid place-items-center text-gray-700 dark:text-zinc-300">+</button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Full name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm" />
                </div>
              </div>

              {event.pricePence > 0 ? (
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3 mb-4 text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-zinc-400">Tickets ({quantity} × £{(event.pricePence / 100).toFixed(0)})</span>
                    <span className="font-bold text-gray-900 dark:text-white">£{(totalPence / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-1 text-gray-500">
                    <span>Artist receives</span>
                    <span>£{(artistPence / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>GRID fee (5%)</span>
                    <span>£{(commissionPence / 100).toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 mb-4 text-center">
                  <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Free event — no payment required</p>
                </div>
              )}

              <button 
                onClick={handlePurchase}
                disabled={!name.trim() || !email.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors"
              >
                {event.pricePence === 0 ? "Reserve my spot →" : "Pay £" + (totalPence / 100).toFixed(2) + " →"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
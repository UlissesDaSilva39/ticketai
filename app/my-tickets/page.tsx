import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Ticket, Event } from "@/lib/types";
import ReturnButton from "./ReturnButton";
import WalletButton from "@/components/WalletButton";

export const dynamic = "force-dynamic";

export default async function MyTicketsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tickets } = await supabase
    .from("tickets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const ticketList = (tickets as Ticket[]) || [];
  const eventIds = [...new Set(ticketList.map((t) => t.event_id))];
  let eventsMap: Record<string, Event> = {};
  if (eventIds.length > 0) {
    const { data: events } = await supabase.from("events").select("*").in("id", eventIds);
    if (events) {
      eventsMap = (events as Event[]).reduce((acc, e) => {
        acc[e.id] = e;
        return acc;
      }, {} as Record<string, Event>);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-2" style={{ fontFamily: "var(--font-antonio)" }}>MY TICKETS</h1>
        <p className="text-gray-500">Signed in as {user.email}</p>
      </div>
      {ticketList.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-lg text-gray-500 mb-6">You do not have any tickets yet.</p>
          <Link href="/" className="inline-block px-8 py-4 bg-black text-white font-medium rounded-full hover:bg-gray-800">Browse Events</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {ticketList.map((ticket) => {
            const event = eventsMap[ticket.event_id];
            const isUsed = ticket.status === "used";
            const isReturned = ticket.status === "returned";
            const isResold = ticket.status === "resold";
            return (
              <div key={ticket.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="font-bold text-xl">{event?.title || "Event"}</h3>
                      <span className={"inline-block px-3 py-1 text-xs font-medium rounded-full " + (isUsed ? "bg-gray-200 text-gray-600" : isReturned ? "bg-yellow-100 text-yellow-800" : isResold ? "bg-red-100 text-red-800" : "bg-[#00FF87] text-black")}>
                        {isUsed ? "USED" : isReturned ? "RETURNED" : isResold ? "RESOLD" : "VALID"}
                      </span>
                    </div>
                    {event && (
                      <p className="text-sm text-gray-500 mb-2">
                        {new Date(event.start_date).toLocaleDateString("en-GB", {
                          weekday: "long", day: "numeric", month: "long", year: "numeric",
                        })}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mb-4">
                      {ticket.ticket_type} · £{Number(ticket.price).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400 font-mono break-all mb-4">
                      {ticket.qr_code}
                    </p>
                    {ticket.seat_label && (<p className="text-sm font-bold mb-2">Seat {ticket.seat_label}</p>)}
                    {ticket.checked_in_at && (
                      <p className="text-xs text-gray-500 mb-4">
                        Checked in {new Date(ticket.checked_in_at).toLocaleString("en-GB")}
                      </p>
                    )}
                    {isReturned && (
                      <p className="text-xs text-yellow-700 bg-yellow-50 p-2 rounded mb-4">
                        Returned to waitlist. You will get a refund if someone claims it.
                      </p>
                    )}
                    {ticket.status === "valid" && (
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={"/my-tickets/print/" + ticket.id}
                          className="inline-block px-5 py-2 border border-black text-sm font-medium rounded-full hover:bg-gray-50"
                        >
                          Print Ticket
                        </Link>
                        <WalletButton ticketId={ticket.id} />
                        <ReturnButton ticketId={ticket.id} />
                      </div>
                    )}
                  </div>
                  <div className="md:w-48 md:border-l border-t md:border-t-0 border-gray-200 flex items-center justify-center p-6 bg-gray-50">
                    {ticket.status === "valid" ? (
                      <img
                        src={"https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=" + encodeURIComponent(ticket.qr_code)}
                        alt="Ticket QR code"
                        width={180}
                        height={180}
                        className="bg-white p-2 rounded-lg"
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <p className="text-4xl mb-2">{isUsed ? "Y" : isReturned ? "↩" : "X"}</p>
                        <p className="text-xs uppercase tracking-widest">
                          {isUsed ? "Used" : isReturned ? "Returned" : "Resold"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

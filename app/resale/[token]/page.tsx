import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import ResaleCheckoutButton from "./ResaleCheckoutButton";

export const dynamic = "force-dynamic";

export default async function ResalePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: ticket } = await supabase
    .from("tickets")
    .select("*")
    .eq("resale_claim_token", token)
    .maybeSingle();

  if (!ticket) return notFound();
  if (ticket.status !== "returned") return notFound();

  const expired = ticket.resale_claim_expires_at
    ? new Date(ticket.resale_claim_expires_at) < new Date()
    : false;

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", ticket.event_id)
    .maybeSingle();

  if (!event) return notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Face Value Resale</p>
        <h1 className="text-5xl md:text-6xl font-bold uppercase" style={{ fontFamily: "var(--font-antonio)" }}>
          A Ticket Is Available
        </h1>
      </div>
      <div className="bg-gray-50 rounded-lg p-8 mb-8">
        <h2 className="text-3xl font-bold mb-2 uppercase" style={{ fontFamily: "var(--font-antonio)" }}>
          {event.title}
        </h2>
        <p className="text-gray-500 mb-6">
          {new Date(event.start_date).toLocaleDateString("en-GB", {
            weekday: "long", day: "numeric", month: "long", year: "numeric",
          })}
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Ticket Type</p>
            <p className="font-bold">{ticket.ticket_type}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Face Value Price</p>
            <p className="font-bold text-xl">£{Number(ticket.price).toFixed(2)}</p>
          </div>
        </div>
        {expired ? (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg">
            <p className="font-bold mb-1">This claim has expired</p>
            <p className="text-sm">The ticket may have been claimed already or returned to the original owner.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              This ticket was returned by its original owner at face value. First come, first served.
            </p>
            <ResaleCheckoutButton token={token} price={Number(ticket.price)} />
          </>
        )}
      </div>
      <p className="text-center text-sm text-gray-500">
        Prices are capped at face value. No markups. No scalping.
      </p>
      <div className="text-center mt-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-black">← Back to events</Link>
      </div>
    </div>
  );
}

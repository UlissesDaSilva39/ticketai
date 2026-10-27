type EventStatus = "on_sale" | "sold_out" | "unavailable";

export function TicketCTA({
  status,
  ticketUrl,
}: {
  status: EventStatus;
  ticketUrl?: string;
}) {
  if (status === "on_sale" && ticketUrl) {
    return (
      <a
        href={ticketUrl}
        className="block w-full rounded-xl bg-purple-600 py-3 text-center font-semibold"
      >
        Get tickets
      </a>
    );
  }
  if (status === "sold_out") {
    return (
      <div className="space-y-2">
        <button className="block w-full rounded-xl border border-white/20 py-3 text-center font-semibold">
          Join waiting list
        </button>
        <p className="text-center text-xs text-white/50">
          If a ticket holder returns their ticket, you&apos;ll be notified.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <button className="block w-full rounded-xl border border-white/20 py-3 text-center font-semibold">
        Notify me
      </button>
      <p className="text-center text-xs text-white/50">Tickets not yet available.</p>
    </div>
  );
}

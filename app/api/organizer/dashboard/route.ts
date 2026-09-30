import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type TicketRow = {
  id: string;
  event_id: string;
  order_id: string | null;
  ticket_type: string | null;
  price: number | string | null;
  status: string | null;
  qr_code?: string | null;
  created_at: string | null;
};

type EventRow = {
  id: string;
  title: string;
  start_date: string | null;
  status: string | null;
  ticket_types: unknown;
};

type TicketType = {
  name?: string;
  quantity?: number;
  price?: number;
};

function getCapacity(ticketTypes: unknown): number {
  if (!Array.isArray(ticketTypes)) {
    return 0;
  }

  return ticketTypes.reduce((total: number, type: unknown) => {
    if (!type || typeof type !== "object") {
      return total;
    }

    const ticketType = type as TicketType;
    const quantity = Number(ticketType.quantity || 0);

    return total + (Number.isFinite(quantity) ? quantity : 0);
  }, 0);
}

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select("*")
      .eq("organizer_id", user.id)
      .order("start_date", { ascending: true });

    if (eventsError) {
      console.error("Organizer events error:", eventsError);

      return NextResponse.json(
        {
          error: "Unable to load organizer events",
          details: eventsError.message,
        },
        { status: 500 }
      );
    }

    const eventList = (events || []) as EventRow[];
    const eventIds = eventList.map((event) => event.id);

    let tickets: TicketRow[] = [];

    if (eventIds.length > 0) {
      const { data: ticketData, error: ticketsError } = await supabase
        .from("tickets")
        .select(
          "id,event_id,order_id,ticket_type,price,status,qr_code,created_at"
        )
        .in("event_id", eventIds);

      if (ticketsError) {
        console.error("Organizer tickets error:", ticketsError);

        return NextResponse.json(
          {
            error: "Unable to load ticket data",
            details: ticketsError.message,
          },
          { status: 500 }
        );
      }

      tickets = (ticketData || []) as TicketRow[];
    }

    // Only count valid tickets.
    const validTickets = tickets.filter(
      (ticket) =>
        ticket.status !== "cancelled" &&
        ticket.status !== "refunded"
    );

    // ------------------------------------------------------------
    // TICKET TOTALS
    // ------------------------------------------------------------

    const totalTicketsSold = validTickets.length;

    const totalRevenue = validTickets.reduce(
      (sum, ticket) => sum + Number(ticket.price || 0),
      0
    );

    // ------------------------------------------------------------
    // ORDER AGGREGATION
    //
    // Multiple tickets can belong to the same order.
    // We therefore group tickets by order_id.
    // ------------------------------------------------------------

    const orderMap = new Map<
      string,
      {
        order_id: string;
        ticketCount: number;
        amount: number;
        created_at: string | null;
        ticketTypes: Set<string>;
        eventIds: Set<string>;
      }
    >();

    for (const ticket of validTickets) {
      const orderId =
        ticket.order_id?.trim() ||
        `ticket-${ticket.id}`;

      const existing = orderMap.get(orderId);

      if (existing) {
        existing.ticketCount += 1;
        existing.amount += Number(ticket.price || 0);

        if (ticket.ticket_type) {
          existing.ticketTypes.add(ticket.ticket_type);
        }

        if (ticket.event_id) {
          existing.eventIds.add(ticket.event_id);
        }

        if (
          ticket.created_at &&
          (!existing.created_at ||
            new Date(ticket.created_at).getTime() >
              new Date(existing.created_at).getTime())
        ) {
          existing.created_at = ticket.created_at;
        }
      } else {
        orderMap.set(orderId, {
          order_id: orderId,
          ticketCount: 1,
          amount: Number(ticket.price || 0),
          created_at: ticket.created_at,
          ticketTypes: new Set(
            ticket.ticket_type ? [ticket.ticket_type] : []
          ),
          eventIds: new Set(
            ticket.event_id ? [ticket.event_id] : []
          ),
        });
      }
    }

    const orders = Array.from(orderMap.values());

    const totalOrders = orders.length;

    const averageOrderValue =
      totalOrders > 0
        ? totalRevenue / totalOrders
        : 0;

    // ------------------------------------------------------------
    // TOTAL CAPACITY
    // ------------------------------------------------------------

    const totalCapacity = eventList.reduce(
      (sum, event) => {
        return sum + getCapacity(event.ticket_types);
      },
      0
    );

    const occupancy =
      totalCapacity > 0
        ? (totalTicketsSold / totalCapacity) * 100
        : 0;

    // ------------------------------------------------------------
    // EVENT STATISTICS
    // ------------------------------------------------------------

    const eventsWithStats = eventList.map((event) => {
      const eventTickets = validTickets.filter(
        (ticket) => ticket.event_id === event.id
      );

      const revenue = eventTickets.reduce(
        (sum, ticket) => sum + Number(ticket.price || 0),
        0
      );

      const capacity = getCapacity(event.ticket_types);

      const sold = eventTickets.length;

      const eventOrderIds = new Set(
        eventTickets
          .map((ticket) => ticket.order_id)
          .filter(
            (orderId): orderId is string =>
              Boolean(orderId)
          )
      );

      const eventOrders = eventOrderIds.size;

      const eventAov =
        eventOrders > 0
          ? revenue / eventOrders
          : 0;

      return {
        id: event.id,
        title: event.title,
        start_date: event.start_date,
        status: event.status || "active",
        capacity,
        sold,
        available: Math.max(capacity - sold, 0),
        revenue,
        orders: eventOrders,
        averageOrderValue: eventAov,
        occupancy:
          capacity > 0
            ? (sold / capacity) * 100
            : 0,
      };
    });

    // ------------------------------------------------------------
    // RECENT ORDERS
    //
    // One row per order rather than one row per ticket.
    // ------------------------------------------------------------

    const eventTitleMap = new Map(
      eventList.map((event) => [
        event.id,
        event.title,
      ])
    );

    const recentOrders = orders
      .sort((a, b) => {
        return (
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
        );
      })
      .slice(0, 10)
      .map((order) => {
        const eventId = Array.from(order.eventIds)[0];

        return {
          order_id: order.order_id,
          ticketCount: order.ticketCount,
          amount: order.amount,
          created_at: order.created_at,
          ticket_type:
            order.ticketTypes.size === 1
              ? Array.from(order.ticketTypes)[0]
              : "Multiple ticket types",
          event_id: eventId || null,
          event_title: eventId
            ? eventTitleMap.get(eventId) || null
            : null,
        };
      });

    // ------------------------------------------------------------
    // RETURN DASHBOARD DATA
    // ------------------------------------------------------------

    return NextResponse.json({
      summary: {
        totalTicketsSold,
        totalRevenue,
        totalOrders,
        averageOrderValue,
        totalEvents: eventList.length,
        totalCapacity,
        availableCapacity: Math.max(
          totalCapacity - totalTicketsSold,
          0
        ),
        occupancy,
      },

      events: eventsWithStats,

      recentOrders,
    });
  } catch (error) {
    console.error("Organizer dashboard error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Dashboard error",
      },
      { status: 500 }
    );
  }
}
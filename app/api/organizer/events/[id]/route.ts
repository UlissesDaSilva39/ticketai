import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

function getCapacity(event: any) {
  const ticketTypes = Array.isArray(event.ticket_types)
    ? event.ticket_types
    : [];

  return ticketTypes.reduce(
    (sum: number, ticket: any) =>
      sum + Number(ticket.quantity || 0),
    0
  );
}

function getStartOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function getDaysBetween(start: Date, end: Date) {
  const ms = getStartOfDay(end).getTime() - getStartOfDay(start).getTime();
  return Math.max(Math.floor(ms / 86400000), 0);
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const supabase = await createServerSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .eq("organizer_id", user.id)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    const { data: tickets, error: ticketsError } = await supabase
      .from("tickets")
      .select(
        "id,event_id,order_id,ticket_type,price,status,created_at,qr_code"
      )
      .eq("event_id", id)
      .order("created_at", { ascending: false });

    if (ticketsError) {
      return NextResponse.json(
        {
          error: "Unable to load event tickets",
          details: ticketsError.message,
        },
        { status: 500 }
      );
    }

    const validTickets = (tickets || []).filter(
      (ticket) =>
        ticket.status !== "cancelled" &&
        ticket.status !== "refunded"
    );

    const capacity = getCapacity(event);
    const sold = validTickets.length;
    const available = Math.max(capacity - sold, 0);

    const revenue = validTickets.reduce(
      (sum, ticket) => sum + Number(ticket.price || 0),
      0
    );

    const orderMap = new Map<
      string,
      {
        orderId: string;
        tickets: number;
        revenue: number;
        created_at: string | null;
      }
    >();

    for (const ticket of validTickets) {
      const orderId = ticket.order_id || `ticket-${ticket.id}`;

      const existing = orderMap.get(orderId);

      if (existing) {
        existing.tickets += 1;
        existing.revenue += Number(ticket.price || 0);

        if (
          ticket.created_at &&
          (!existing.created_at ||
            new Date(ticket.created_at).getTime() <
              new Date(existing.created_at).getTime())
        ) {
          existing.created_at = ticket.created_at;
        }
      } else {
        orderMap.set(orderId, {
          orderId,
          tickets: 1,
          revenue: Number(ticket.price || 0),
          created_at: ticket.created_at,
        });
      }
    }

    const orderAnalytics = Array.from(orderMap.values()).sort(
      (a, b) => b.revenue - a.revenue
    );

    const orders = orderAnalytics.length;

    const averageOrderValue =
      orders > 0 ? revenue / orders : 0;

    const averageTicketsPerOrder =
      orders > 0 ? sold / orders : 0;

    const largestOrder =
      orderAnalytics.length > 0
        ? Math.max(...orderAnalytics.map((order) => order.revenue))
        : 0;

    const smallestOrder =
      orderAnalytics.length > 0
        ? Math.min(...orderAnalytics.map((order) => order.revenue))
        : 0;

    const occupancy =
      capacity > 0
        ? (sold / capacity) * 100
        : 0;

    const ticketTypes = Array.isArray(event.ticket_types)
      ? event.ticket_types
      : [];

    const ticketTypeStats = ticketTypes.map((type: any) => {
      const name = type.name || "Ticket";

      const matching = validTickets.filter(
        (ticket) => ticket.ticket_type === name
      );

      const typeRevenue = matching.reduce(
        (sum, ticket) =>
          sum + Number(ticket.price || 0),
        0
      );

      const quantity = Number(type.quantity || 0);

      return {
        name,
        price: Number(type.price || 0),
        capacity: quantity,
        sold: matching.length,
        available: Math.max(quantity - matching.length, 0),
        revenue: typeRevenue,
        occupancy:
          quantity > 0
            ? (matching.length / quantity) * 100
            : 0,
      };
    });

    const salesByDay: Record<
      string,
      {
        date: string;
        tickets: number;
        revenue: number;
      }
    > = {};

    for (const ticket of validTickets) {
      if (!ticket.created_at) continue;

      const date = new Date(ticket.created_at);

      if (Number.isNaN(date.getTime())) continue;

      const key = date.toISOString().slice(0, 10);

      if (!salesByDay[key]) {
        salesByDay[key] = {
          date: key,
          tickets: 0,
          revenue: 0,
        };
      }

      salesByDay[key].tickets += 1;
      salesByDay[key].revenue += Number(ticket.price || 0);
    }

    const salesTimeline = Object.values(salesByDay).sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    );

    let cumulativeTickets = 0;
    let cumulativeRevenue = 0;

    const timelineWithCumulative = salesTimeline.map((day) => {
      cumulativeTickets += day.tickets;
      cumulativeRevenue += day.revenue;

      return {
        ...day,
        cumulativeTickets,
        cumulativeRevenue,
      };
    });

    const now = new Date();

    const getWindowStats = (days: number) => {
      const cutoff = new Date(
        now.getTime() - days * 86400000
      );

      const windowTickets = validTickets.filter((ticket) => {
        if (!ticket.created_at) return false;

        const created = new Date(ticket.created_at);

        return (
          !Number.isNaN(created.getTime()) &&
          created >= cutoff
        );
      });

      const windowRevenue = windowTickets.reduce(
        (sum, ticket) =>
          sum + Number(ticket.price || 0),
        0
      );

      return {
        tickets: windowTickets.length,
        revenue: windowRevenue,
        ticketsPerDay: windowTickets.length / days,
        revenuePerDay: windowRevenue / days,
      };
    };

    const last7Days = getWindowStats(7);
    const last14Days = getWindowStats(14);

    const sortedSales = [...validTickets]
      .filter((ticket) => ticket.created_at)
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime()
      );

    const firstSaleDate =
      sortedSales.length > 0 && sortedSales[0].created_at
        ? new Date(sortedSales[0].created_at)
        : null;

    const lastSaleDate =
      sortedSales.length > 0 &&
      sortedSales[sortedSales.length - 1].created_at
        ? new Date(
            sortedSales[sortedSales.length - 1].created_at
          )
        : null;

    const daysSinceFirstSale = firstSaleDate
      ? Math.max(getDaysBetween(firstSaleDate, now), 1)
      : 0;

    const daysSinceLastSale = lastSaleDate
      ? getDaysBetween(lastSaleDate, now)
      : null;

    const lifetimeTicketsPerDay =
      daysSinceFirstSale > 0
        ? sold / daysSinceFirstSale
        : 0;

    const lifetimeRevenuePerDay =
      daysSinceFirstSale > 0
        ? revenue / daysSinceFirstSale
        : 0;

    const currentSalesPace =
      last7Days.ticketsPerDay;

    const eventDate = event.start_date
      ? new Date(event.start_date)
      : null;

    const validEventDate =
      eventDate && !Number.isNaN(eventDate.getTime())
        ? eventDate
        : null;

    const daysUntilEvent = validEventDate
      ? Math.ceil(
          (validEventDate.getTime() - now.getTime()) /
            86400000
        )
      : null;

    const daysAvailableForSales =
      validEventDate && validEventDate > now
        ? Math.max(
            (validEventDate.getTime() - now.getTime()) /
              86400000,
            1
          )
        : null;

    const requiredSalesPerDay =
      daysAvailableForSales && available > 0
        ? available / daysAvailableForSales
        : 0;

    const salesPaceGap =
      currentSalesPace - requiredSalesPerDay;

    const paceRatio =
      requiredSalesPerDay > 0
        ? currentSalesPace / requiredSalesPerDay
        : null;

    const scenarioTicketsPerDay = {
      conservative:
        Math.max(last14Days.ticketsPerDay, 0),
      current:
        Math.max(last7Days.ticketsPerDay, 0),
      higher:
        Math.max(last7Days.ticketsPerDay * 1.25, 0),
    };

    const scenarioRevenue = Object.entries(
      scenarioTicketsPerDay
    ).map(([name, ticketsPerDay]) => {
      const days =
        daysAvailableForSales || 0;

      const additionalTickets = Math.min(
        available,
        Math.max(ticketsPerDay * days, 0)
      );

      const additionalRevenue =
        additionalTickets * averageOrderValue /
        Math.max(averageTicketsPerOrder, 1);

      return {
        name,
        ticketsPerDay,
        additionalTickets,
        additionalRevenue,
        totalRevenue:
          revenue + additionalRevenue,
      };
    });

    const bestSalesDay =
      salesTimeline.length > 0
        ? [...salesTimeline].sort(
            (a, b) => b.tickets - a.tickets
          )[0]
        : null;

    return NextResponse.json({
      event: {
        id: event.id,
        title: event.title,
        description: event.description,
        start_date: event.start_date,
        status: event.status || "active",
        venue_id: event.venue_id,
        hero_image: event.hero_image,
      },

      summary: {
        capacity,
        sold,
        available,
        revenue,
        orders,
        averageOrderValue,
        occupancy,
      },

      salesVelocity: {
        last7Days,
        last14Days,
        lifetimeTicketsPerDay,
        lifetimeRevenuePerDay,
        currentSalesPace,
        bestSalesDay,
        firstSaleDate: firstSaleDate?.toISOString() || null,
        lastSaleDate: lastSaleDate?.toISOString() || null,
        daysSinceFirstSale,
        daysSinceLastSale,
      },

      countdown: {
        eventDate: validEventDate?.toISOString() || null,
        daysUntilEvent,
        ticketsRemaining: available,
      },

      salesPace: {
        currentSalesPace,
        requiredSalesPerDay,
        salesPaceGap,
        paceRatio,
        daysAvailableForSales,
      },

      revenueScenarios: scenarioRevenue,

      ticketTypes: ticketTypeStats,
      ticketTypeStats,

      salesTimeline: timelineWithCumulative,

      orderAnalytics: {
        orders,
        averageTicketsPerOrder,
        largestOrder,
        smallestOrder,
      },

      recentTickets: validTickets.slice(0, 20),
    });
  } catch (error) {
    console.error("Event analytics error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load event analytics",
      },
      { status: 500 }
    );
  }
}

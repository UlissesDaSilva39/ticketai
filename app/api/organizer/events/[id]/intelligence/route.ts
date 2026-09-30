import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function getCapacity(event: any) {
  const ticketTypes = Array.isArray(event.ticket_types)
    ? event.ticket_types
    : [];

  return ticketTypes.reduce(
    (sum: number, type: any) =>
      sum + Number(type.quantity || 0),
    0
  );
}

function daysBetween(start: Date, end: Date) {
  const startDay = new Date(start);
  const endDay = new Date(end);

  startDay.setHours(0, 0, 0, 0);
  endDay.setHours(0, 0, 0, 0);

  return Math.max(
    Math.floor(
      (endDay.getTime() - startDay.getTime()) /
        86400000
    ),
    0
  );
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { data: event, error: eventError } =
      await supabase
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

    const { data: tickets, error: ticketsError } =
      await supabase
        .from("tickets")
        .select(
          "id,event_id,order_id,ticket_type,price,status,created_at"
        )
        .eq("event_id", id)
        .order("created_at", {
          ascending: false,
        });

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

    const now = new Date();

    const capacity = getCapacity(event);
    const sold = validTickets.length;
    const remaining = Math.max(
      capacity - sold,
      0
    );

    const revenue = validTickets.reduce(
      (sum, ticket) =>
        sum + Number(ticket.price || 0),
      0
    );

    const eventDate = event.start_date
      ? new Date(event.start_date)
      : null;

    const validEventDate =
      eventDate &&
      !Number.isNaN(eventDate.getTime())
        ? eventDate
        : null;

    const daysToEvent = validEventDate
      ? Math.ceil(
          (validEventDate.getTime() -
            now.getTime()) /
            86400000
        )
      : null;

    const last7Cutoff = new Date(
      now.getTime() -
        7 * 86400000
    );

    const previous7Cutoff = new Date(
      now.getTime() -
        14 * 86400000
    );

    const last7Tickets =
      validTickets.filter((ticket) => {
        if (!ticket.created_at) return false;

        return (
          new Date(ticket.created_at) >=
          last7Cutoff
        );
      });

    const previous7Tickets =
      validTickets.filter((ticket) => {
        if (!ticket.created_at) return false;

        const date = new Date(
          ticket.created_at
        );

        return (
          date >= previous7Cutoff &&
          date < last7Cutoff
        );
      });

    const last7Revenue =
      last7Tickets.reduce(
        (sum, ticket) =>
          sum + Number(ticket.price || 0),
        0
      );

    const previous7Revenue =
      previous7Tickets.reduce(
        (sum, ticket) =>
          sum + Number(ticket.price || 0),
        0
      );

    const currentPace =
      last7Tickets.length / 7;

    const previousPace =
      previous7Tickets.length / 7;

    const revenuePace =
      last7Revenue / 7;

    let salesTrend:
      | "accelerating"
      | "stable"
      | "slowing"
      | "no_recent_sales" =
      "stable";

    if (last7Tickets.length === 0) {
      salesTrend = "no_recent_sales";
    } else if (
      currentPace >
      previousPace * 1.15
    ) {
      salesTrend = "accelerating";
    } else if (
      previousPace > 0 &&
      currentPace <
        previousPace * 0.85
    ) {
      salesTrend = "slowing";
    }

    const occupancy =
      capacity > 0
        ? (sold / capacity) * 100
        : 0;

    let inventoryPressure:
      | "low"
      | "medium"
      | "high" =
      "low";

    if (
      daysToEvent !== null &&
      daysToEvent <= 7 &&
      remaining > 0
    ) {
      inventoryPressure = "high";
    } else if (
      daysToEvent !== null &&
      daysToEvent <= 21 &&
      remaining > 0
    ) {
      inventoryPressure = "medium";
    }

    let eventUrgency:
      | "low"
      | "medium"
      | "high" =
      "low";

    if (
      daysToEvent !== null &&
      daysToEvent <= 3 &&
      remaining > 0
    ) {
      eventUrgency = "high";
    } else if (
      daysToEvent !== null &&
      daysToEvent <= 14 &&
      remaining > 0
    ) {
      eventUrgency = "medium";
    }

    const requiredSalesPerDay =
      daysToEvent !== null &&
      daysToEvent > 0
        ? remaining / daysToEvent
        : 0;

    const paceGap =
      currentPace -
      requiredSalesPerDay;

    let paceStatus:
      | "ahead"
      | "on_track"
      | "behind"
      | "insufficient_data" =
      "insufficient_data";

    if (
      daysToEvent !== null &&
      daysToEvent > 0
    ) {
      if (
        currentPace >
        requiredSalesPerDay * 1.1
      ) {
        paceStatus = "ahead";
      } else if (
        currentPace >=
        requiredSalesPerDay * 0.9
      ) {
        paceStatus = "on_track";
      } else {
        paceStatus = "behind";
      }
    }

    const ticketTypes = Array.isArray(
      event.ticket_types
    )
      ? event.ticket_types
      : [];

    const ticketPerformance =
      ticketTypes.map((type: any) => {
        const name =
          type.name || "Ticket";

        const quantity = Number(
          type.quantity || 0
        );

        const matching =
          validTickets.filter(
            (ticket) =>
              ticket.ticket_type === name
          );

        const typeRevenue =
          matching.reduce(
            (sum, ticket) =>
              sum +
              Number(
                ticket.price || 0
              ),
            0
          );

        const typeOccupancy =
          quantity > 0
            ? (matching.length /
                quantity) *
              100
            : 0;

        return {
          name,
          price: Number(
            type.price || 0
          ),
          capacity: quantity,
          sold: matching.length,
          remaining: Math.max(
            quantity -
              matching.length,
            0
          ),
          revenue: typeRevenue,
          occupancy: typeOccupancy,
        };
      });

    const sortedTypes = [
      ...ticketPerformance,
    ].sort(
      (a, b) =>
        b.occupancy -
        a.occupancy
    );

    const strongestTicketType =
      sortedTypes[0] || null;

    const weakestTicketType =
      sortedTypes.length > 1
        ? sortedTypes[
            sortedTypes.length - 1
          ]
        : null;

    const lastSale =
      validTickets.find(
        (ticket) =>
          ticket.created_at
      );

    const daysSinceLastSale =
      lastSale?.created_at
        ? daysBetween(
            new Date(
              lastSale.created_at
            ),
            now
          )
        : null;

    const recommendations: {
      priority: "high" | "medium" | "low";
      category:
        | "sales"
        | "marketing"
        | "inventory"
        | "conversion"
        | "monitoring";
      title: string;
      description: string;
      action: string;
    }[] = [];

    if (
      daysToEvent !== null &&
      daysToEvent <= 7 &&
      remaining > 0
    ) {
      recommendations.push({
        priority: "high",
        category: "sales",
        title:
          "Increase sales activity",
        description:
          `The event is ${daysToEvent} day(s) away with ${remaining} ticket(s) remaining.`,
        action:
          "Launch or increase promotional activity immediately.",
      });
    }

    if (
      paceStatus === "behind"
    ) {
      recommendations.push({
        priority: "high",
        category: "sales",
        title:
          "Sales pace is below the required rate",
        description:
          `Current sales pace is ${currentPace.toFixed(
            1
          )} tickets/day versus ${requiredSalesPerDay.toFixed(
            1
          )} required.`,
        action:
          "Increase traffic, promotion or audience reach.",
      });
    }

    if (
      salesTrend ===
      "slowing"
    ) {
      recommendations.push({
        priority: "high",
        category: "marketing",
        title:
          "Sales momentum is slowing",
        description:
          "Ticket sales during the last 7 days are lower than the previous 7-day period.",
        action:
          "Review campaign activity and introduce a new promotional push.",
      });
    }

    if (
      salesTrend ===
      "no_recent_sales"
    ) {
      recommendations.push({
        priority: "high",
        category: "marketing",
        title:
          "No recent ticket sales",
        description:
          "No valid ticket sales were recorded during the last 7 days.",
        action:
          "Increase event visibility and review the current marketing funnel.",
      });
    }

    if (
      weakestTicketType &&
      weakestTicketType.capacity >
        0 &&
      weakestTicketType.occupancy <
        25
    ) {
      recommendations.push({
        priority: "medium",
        category: "inventory",
        title:
          "Review slow-selling ticket type",
        description:
          `${weakestTicketType.name} is at ${weakestTicketType.occupancy.toFixed(
            1
          )}% occupancy.`,
        action:
          "Review pricing, positioning and promotion for this ticket type.",
      });
    }

    if (
      occupancy < 25 &&
      remaining > 0
    ) {
      recommendations.push({
        priority: "medium",
        category: "conversion",
        title:
          "Event occupancy is still low",
        description:
          `Only ${occupancy.toFixed(
            1
          )}% of available inventory has been sold.`,
        action:
          "Improve event discovery, traffic and conversion.",
      });
    }

    if (
      daysSinceLastSale !== null &&
      daysSinceLastSale >= 3 &&
      remaining > 0
    ) {
      recommendations.push({
        priority: "medium",
        category: "monitoring",
        title:
          "Monitor sales inactivity",
        description:
          `The last ticket sale was ${daysSinceLastSale} day(s) ago.`,
        action:
          "Review traffic and campaign performance before the next sales cycle.",
      });
    }

    if (
      salesTrend ===
        "accelerating" &&
      paceStatus !== "behind"
    ) {
      recommendations.push({
        priority: "low",
        category: "sales",
        title:
          "Sales momentum is improving",
        description:
          "Recent sales activity is higher than the previous period.",
        action:
          "Maintain promotional activity and monitor inventory.",
      });
    }

    if (
      recommendations.length === 0
    ) {
      recommendations.push({
        priority: "low",
        category: "monitoring",
        title:
          "Continue monitoring",
        description:
          "There are currently no major rule-based warning signals.",
        action:
          "Continue monitoring sales velocity and inventory.",
      });
    }

    const scoreFactors = {
      salesPace:
        paceStatus === "ahead"
          ? 100
          : paceStatus === "on_track"
          ? 75
          : paceStatus ===
            "behind"
          ? 35
          : 50,

      momentum:
        salesTrend ===
        "accelerating"
          ? 100
          : salesTrend ===
            "stable"
          ? 70
          : salesTrend ===
            "slowing"
          ? 35
          : 20,

      occupancy: Math.min(
        occupancy,
        100
      ),

      recentActivity:
        last7Tickets.length > 0
          ? Math.min(
              last7Tickets.length *
                10,
              100
            )
          : 0,
    };

    const eventHealth =
      Math.round(
        scoreFactors.salesPace *
          0.35 +
          scoreFactors.momentum *
            0.25 +
          scoreFactors.occupancy *
            0.2 +
          scoreFactors.recentActivity *
            0.2
      );

    return NextResponse.json({
      event: {
        id: event.id,
        title: event.title,
        start_date:
          event.start_date,
        status:
          event.status ||
          "active",
      },

      intelligence: {
        eventHealth,
        salesTrend,
        salesPace: {
          current:
            currentPace,
          required:
            requiredSalesPerDay,
          gap: paceGap,
          status:
            paceStatus,
        },

        inventory: {
          capacity,
          sold,
          remaining,
          occupancy,
          pressure:
            inventoryPressure,
        },

        urgency: eventUrgency,

        recentActivity: {
          last7Tickets:
            last7Tickets.length,
          last7Revenue,
          previous7Tickets:
            previous7Tickets.length,
          previous7Revenue,
          daysSinceLastSale,
        },

        ticketPerformance: {
          strongest:
            strongestTicketType,
          weakest:
            weakestTicketType,
          types:
            ticketPerformance,
        },

        eventTiming: {
          daysToEvent,
          eventDate:
            validEventDate?.toISOString() ||
            null,
        },
      },

      recommendations,
    });
  } catch (error) {
    console.error(
      "Event intelligence error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate event intelligence",
      },
      { status: 500 }
    );
  }
}
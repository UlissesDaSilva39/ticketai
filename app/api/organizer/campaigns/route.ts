import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID_OBJECTIVES = [
  "ticket_sales",
  "traffic",
  "awareness",
  "engagement",
];

const VALID_STATUSES = [
  "draft",
  "active",
  "paused",
  "completed",
  "cancelled",
];

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: campaigns, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("organizer_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Campaign GET error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const eventIds = [
      ...new Set(
        (campaigns || [])
          .map((campaign) => campaign.event_id)
          .filter(Boolean)
      ),
    ];

    let events: any[] = [];

    if (eventIds.length > 0) {
      const { data: eventData } = await supabase
        .from("events")
        .select("*")
        .in("id", eventIds);

      events = eventData || [];
    }

    const eventMap = new Map(
      events.map((event) => [event.id, event])
    );

    const enrichedCampaigns = (campaigns || []).map((campaign) => ({
      ...campaign,
      event: eventMap.get(campaign.event_id) || null,
    }));

    return NextResponse.json({
      campaigns: enrichedCampaigns,
    });
  } catch (error) {
    console.error("Campaign GET exception:", error);

    return NextResponse.json(
      { error: "Failed to load campaigns" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      name,
      eventId,
      objective = "ticket_sales",
      status = "draft",
      budget = 0,
      dailyBudget = null,
      audience = {},
      channels = [],
      startDate = null,
      endDate = null,
    } = body;

    if (!name || !eventId) {
      return NextResponse.json(
        { error: "Campaign name and event are required" },
        { status: 400 }
      );
    }

    if (!VALID_OBJECTIVES.includes(objective)) {
      return NextResponse.json(
        { error: "Invalid campaign objective" },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid campaign status" },
        { status: 400 }
      );
    }

    const numericBudget = Number(budget);
    const numericDailyBudget =
      dailyBudget === null ||
      dailyBudget === "" ||
      dailyBudget === undefined
        ? null
        : Number(dailyBudget);

    if (
      Number.isNaN(numericBudget) ||
      numericBudget < 0
    ) {
      return NextResponse.json(
        { error: "Budget must be a valid positive number" },
        { status: 400 }
      );
    }

    if (
      numericDailyBudget !== null &&
      (Number.isNaN(numericDailyBudget) ||
        numericDailyBudget < 0)
    ) {
      return NextResponse.json(
        { error: "Daily budget must be valid" },
        { status: 400 }
      );
    }

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, title, organizer_id")
      .eq("id", eventId)
      .eq("organizer_id", user.id)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: "Event not found or not owned by organizer" },
        { status: 404 }
      );
    }

    const trackingCode =
      "tk_" +
      crypto
        .randomUUID()
        .replace(/-/g, "")
        .slice(0, 12);

    const { data: campaign, error } = await supabase
      .from("campaigns")
      .insert({
        organizer_id: user.id,
        event_id: eventId,
        name: String(name).trim(),
        objective,
        status,
        budget: numericBudget,
        daily_budget: numericDailyBudget,
        audience,
        channels,
        start_date: startDate || null,
        end_date: endDate || null,
        tracking_code: trackingCode,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Campaign POST error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        campaign: {
          ...campaign,
          event,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Campaign POST exception:", error);

    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}
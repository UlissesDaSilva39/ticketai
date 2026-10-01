import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

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

async function getUser() {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return {
    supabase,
    user,
  };
}

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    const { supabase, user } = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: campaign, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", id)
      .eq("organizer_id", user.id)
      .single();

    if (error || !campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    const { data: event } = await supabase
      .from("events")
      .select("*")
      .eq("id", campaign.event_id)
      .eq("organizer_id", user.id)
      .single();

    return NextResponse.json({
      campaign: {
        ...campaign,
        event: event || null,
      },
    });
  } catch (error) {
    console.error("Campaign detail GET error:", error);

    return NextResponse.json(
      { error: "Failed to load campaign" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    const { supabase, user } = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: existing, error: existingError } =
      await supabase
        .from("campaigns")
        .select("*")
        .eq("id", id)
        .eq("organizer_id", user.id)
        .single();

    if (existingError || !existing) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const updates: Record<string, any> = {};

    if (body.name !== undefined) {
      updates.name = String(body.name).trim();
    }

    if (body.objective !== undefined) {
      if (!VALID_OBJECTIVES.includes(body.objective)) {
        return NextResponse.json(
          { error: "Invalid campaign objective" },
          { status: 400 }
        );
      }

      updates.objective = body.objective;
    }

    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json(
          { error: "Invalid campaign status" },
          { status: 400 }
        );
      }

      updates.status = body.status;
    }

    if (body.budget !== undefined) {
      const value = Number(body.budget);

      if (Number.isNaN(value) || value < 0) {
        return NextResponse.json(
          { error: "Invalid budget" },
          { status: 400 }
        );
      }

      updates.budget = value;
    }

    if (body.dailyBudget !== undefined) {
      if (
        body.dailyBudget === null ||
        body.dailyBudget === ""
      ) {
        updates.daily_budget = null;
      } else {
        const value = Number(body.dailyBudget);

        if (Number.isNaN(value) || value < 0) {
          return NextResponse.json(
            { error: "Invalid daily budget" },
            { status: 400 }
          );
        }

        updates.daily_budget = value;
      }
    }

    if (body.audience !== undefined) {
      updates.audience = body.audience;
    }

    if (body.channels !== undefined) {
      updates.channels = body.channels;
    }

    if (body.startDate !== undefined) {
      updates.start_date = body.startDate || null;
    }

    if (body.endDate !== undefined) {
      updates.end_date = body.endDate || null;
    }

    if (body.eventId !== undefined) {
      const { data: event } = await supabase
        .from("events")
        .select("id")
        .eq("id", body.eventId)
        .eq("organizer_id", user.id)
        .single();

      if (!event) {
        return NextResponse.json(
          { error: "Selected event is invalid" },
          { status: 400 }
        );
      }

      updates.event_id = body.eventId;
    }

    updates.updated_at = new Date().toISOString();

    const { data: campaign, error } = await supabase
      .from("campaigns")
      .update(updates)
      .eq("id", id)
      .eq("organizer_id", user.id)
      .select("*")
      .single();

    if (error) {
      console.error("Campaign PATCH error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      campaign,
    });
  } catch (error) {
    console.error("Campaign PATCH exception:", error);

    return NextResponse.json(
      { error: "Failed to update campaign" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    const { supabase, user } = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { error } = await supabase
      .from("campaigns")
      .delete()
      .eq("id", id)
      .eq("organizer_id", user.id);

    if (error) {
      console.error("Campaign DELETE error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Campaign DELETE exception:", error);

    return NextResponse.json(
      { error: "Failed to delete campaign" },
      { status: 500 }
    );
  }
}

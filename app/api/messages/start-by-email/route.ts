import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "email required" }, { status: 400 });
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    // Look up the recipient user by email
    const admin = createAdminClient();
    const { data: users, error: listErr } = await admin.auth.admin.listUsers({
      perPage: 200,
    });

    if (listErr) {
      return NextResponse.json({ error: listErr.message }, { status: 500 });
    }

    const match = users.users.find(
      (u) => (u.email ?? "").toLowerCase() === email.toLowerCase()
    );

    if (!match) {
      return NextResponse.json(
        { error: "not_on_grid", message: "This person isn't on GRID yet" },
        { status: 404 }
      );
    }

    if (match.id === user.id) {
      return NextResponse.json(
        { error: "Cannot message yourself" },
        { status: 400 }
      );
    }

    // Create/find conversation
    const a = user.id < match.id ? user.id : match.id;
    const b = user.id < match.id ? match.id : user.id;

    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("participant_a", a)
      .eq("participant_b", b)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ conversationId: existing.id });
    }

    const { data: created, error } = await supabase
      .from("conversations")
      .insert({ participant_a: a, participant_b: b })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ conversationId: created.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

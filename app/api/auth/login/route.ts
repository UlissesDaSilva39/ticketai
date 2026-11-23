import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

// Checks the email and password against Supabase Auth. On success the Supabase
// session cookies are set on the response by createServerSupabase().
export async function POST(req: Request) {
  let body: { email?: string; password?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Bad JSON" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  if (!email || !password) {
    return NextResponse.json({ message: "Email and password required" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    const unconfirmed = error?.code === "email_not_confirmed";
    return NextResponse.json(
      {
        message: unconfirmed
          ? "Please confirm your email first. Check your inbox for the link."
          : "Wrong email or password.",
      },
      { status: 401 }
    );
  }

  return NextResponse.json({
    data: {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.full_name ?? data.user.email?.split("@")[0],
      },
    },
  });
}

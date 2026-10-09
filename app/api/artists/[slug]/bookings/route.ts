import { NextResponse } from "next/server";

type Params = { params: Promise<{ slug: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const body = await request.json();

    console.log("[booking request]", {
      artistSlug: slug,
      date: body.date,
      name: body.name,
      email: body.email,
      venue: body.venue,
      message: body.message,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, message: "Booking request received" });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid payload" },
      { status: 400 }
    );
  }
}

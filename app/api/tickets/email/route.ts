import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Ticket email not implemented yet" },
    { status: 501 }
  );
}

export async function GET() {
  return NextResponse.json(
    { error: "Ticket email not implemented yet" },
    { status: 501 }
  );
}
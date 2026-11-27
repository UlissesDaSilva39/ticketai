import { NextRequest, NextResponse } from "next/server";
import { refundOverdue } from "@/lib/submissions/server";

export const dynamic = "force-dynamic";

// Daily: refund paid demos/messages that weren't answered within 7 days.
export async function GET(req: NextRequest) {
  if (!process.env.CRON_SECRET && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 503 });
  }
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const refunded = await refundOverdue(100);
  return NextResponse.json({ refunded });
}

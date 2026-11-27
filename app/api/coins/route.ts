import { NextResponse } from "next/server";
import { currentUser } from "@/lib/live/server";

export const dynamic = "force-dynamic";

// GET /api/coins: the signed-in member's coin balance.
export async function GET() {
  const { supabase, user } = await currentUser();
  if (!user) return NextResponse.json({ balance: 0, signedIn: false });
  const { data } = await supabase.from("coin_wallets").select("balance_coins").eq("user_id", user.id).maybeSingle();
  return NextResponse.json({ balance: data?.balance_coins ?? 0, signedIn: true }, { headers: { "cache-control": "no-store" } });
}

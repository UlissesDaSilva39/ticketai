import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const kind = String(formData.get("kind") || "avatar");

  if (!file) {
    return NextResponse.json({ error: "file required" }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Max 5MB" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = user.id + "/" + kind + "-" + Date.now() + "." + ext;

  const arrayBuffer = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from("chat-attachments")
    .upload(path, arrayBuffer, { contentType: file.type, cacheControl: "3600" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: pub } = supabase.storage.from("chat-attachments").getPublicUrl(path);

  return NextResponse.json({ url: pub.publicUrl });
}
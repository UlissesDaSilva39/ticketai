import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ ok: false, error: "No file" }, { status: 400 });
    }

    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const filename = user.id + "-" + Date.now() + "." + ext;

    const { error: uploadError } = await supabase.storage
      .from("artist-covers")
      .upload(filename, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      console.error("upload failed:", uploadError);
      return NextResponse.json({ ok: false, error: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from("artist-covers")
      .getPublicUrl(filename);

    return NextResponse.json({ ok: true, url: urlData.publicUrl });
  } catch (err) {
    console.error("upload route error:", err);
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }
}

import { createClient } from "@/lib/supabase/client";

export async function uploadChatAttachment(
  file: File,
  userId: string
): Promise<{ url: string; type: string } | { error: string }> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() || "bin";
  const path = userId + "/" + Date.now() + "-" + Math.random().toString(36).slice(2) + "." + ext;

  const { error } = await supabase.storage
    .from("chat-attachments")
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) return { error: error.message };

  const { data } = supabase.storage.from("chat-attachments").getPublicUrl(path);
  return { url: data.publicUrl, type: file.type };
}
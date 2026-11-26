import { notFound, redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import ReleaseEditor from "./ReleaseEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Release builder | GRID Distribution" };

export default async function ReleaseEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=${encodeURIComponent(`/distribution/releases/${id}`)}`);
  return <ReleaseEditor id={id} />;
}

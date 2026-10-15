import { createServerSupabase } from "@/lib/supabase/server";

type TargetType = "artist" | "promoter" | "venue" | "user";

export default async function FollowCount({
  targetType,
  targetId,
  className,
}: {
  targetType: TargetType;
  targetId: string;
  className?: string;
}) {
  const supabase = await createServerSupabase();
  const { count } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("target_type", targetType)
    .eq("target_id", targetId);

  const n = count ?? 0;
  return (
    <span className={className}>
      {n.toLocaleString("en-GB")} {n === 1 ? "follower" : "followers"}
    </span>
  );
}
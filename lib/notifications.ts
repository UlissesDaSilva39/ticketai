type NotifyParams = {
  userId: string;
  type: string;
  title: string;
  body?: string;
  href?: string;
};

export async function notifyUser(
  supabase: any,
  params: NotifyParams
) {
  const { error } = await supabase.from("notifications").insert({
    user_id: params.userId,
    type: params.type,
    title: params.title,
    body: params.body ?? null,
    href: params.href ?? null,
  });
  if (error) {
    console.error("notifyUser failed:", error);
  }
}

import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { getInbox } from "@/lib/inbox";
import InboxShell from "@/components/messages/InboxShell";

// Two-panel inbox: conversation list on the left, the open conversation on the right.
export const dynamic = "force-dynamic";

export default async function MessagesLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/messages");

  const rows = await getInbox(supabase, user.id);
  return <InboxShell rows={rows}>{children}</InboxShell>;
}

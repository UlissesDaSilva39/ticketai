import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Campaign = {
  id: string;
  subject: string;
  body: string;
  recipient_count: number;
  successful_sends: number;
  failed_sends: number;
  status: string;
  created_at: string;
  sent_at: string | null;
};

export default async function CampaignsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("organizer_id", user.id)
    .order("created_at", { ascending: false });

  const list = (campaigns as Campaign[]) || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/organizer" className="text-sm text-gray-500 hover:text-black">Back to Dashboard</Link>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-5xl font-bold" style={{ fontFamily: "var(--font-antonio)" }}>CAMPAIGNS</h1>
          <p className="text-gray-500 mt-2">Email your past attendees</p>
        </div>
        <Link href="/organizer/campaigns/new" className="px-6 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800">
          + New Campaign
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-lg text-gray-500 mb-6">No campaigns yet.</p>
          <Link href="/organizer/campaigns/new" className="inline-block px-8 py-4 bg-black text-white font-medium rounded-full hover:bg-gray-800">Create Your First Campaign</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((c) => (
            <div key={c.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
                <div className="flex-1 min-w-[200px]">
                  <h3 className="font-bold text-lg mb-1">{c.subject}</h3>
                  <p className="text-sm text-gray-500">
                    {c.sent_at
                      ? "Sent " + new Date(c.sent_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                      : "Created " + new Date(c.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <span className={"px-4 py-2 text-xs font-medium rounded-full " + (c.status === "sent" ? "bg-[#00FF87] text-black" : c.status === "failed" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800")}>
                  {c.status.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mt-2">{c.body}</p>
              <p className="text-xs text-gray-400 mt-3">
                {c.recipient_count} recipients · {c.successful_sends} delivered · {c.failed_sends} failed
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

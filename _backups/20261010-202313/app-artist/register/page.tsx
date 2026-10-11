import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import ArtistRegisterForm from "@/components/ArtistRegisterForm";

export const metadata: Metadata = {
  title: "Artist Registration",
  description:
    "Register as an artist on TicketAI. Get discovered by promoters, venues, and fans.",
};

export default async function ArtistRegisterPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/artist/register");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <section className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-3">
            Join the stage
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-3"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            Artist Registration
          </h1>
          <p className="text-gray-600 max-w-xl">
            Register as an artist on TicketAI and add your details. Get discovered
            by promoters, venues, and fans all in one place.
          </p>
        </section>

        <ArtistRegisterForm
        defaultName={profile?.full_name ?? ""}
        defaultHandle={profile?.username ?? ""}
        defaultEmail={user.email ?? ""}
      />
      </div>
    </div>
  );
}

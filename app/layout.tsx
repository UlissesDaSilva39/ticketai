import type { Metadata } from "next";
import { Inter, Antonio } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import InstallPrompt from "@/components/InstallPrompt";
import { Toaster } from "sonner";
import { createServerSupabase } from "@/lib/supabase/server";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const antonio = Antonio({ subsets: ["latin"], variable: "--font-antonio" });

export const metadata: Metadata = {
  title: "GRID",
  description: "The social and professional network for live music",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  let username: string | null = null;
  let role: string | null = null;
  let artistSlug: string | null = null;
  let pendingRequestCount = 0;
  let notificationCount = 0;

  if (user) {
    const { data: profileRow } = await supabase
      .from("profiles")
      .select("username, role")
      .eq("id", user.id)
      .maybeSingle();
    username = profileRow?.username ?? null;
    role = profileRow?.role ?? null;

    const { data: artistRow } = await supabase
      .from("artists")
      .select("slug")
      .eq("owner_id", user.id)
      .eq("status", "active")
      .maybeSingle();
    artistSlug = artistRow?.slug ?? null;

    const { count } = await supabase
      .from("friendships")
      .select("*", { count: "exact", head: true })
      .eq("friend_id", user.id)
      .eq("status", "pending");
    pendingRequestCount = count ?? 0;

    const { count: nc } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .is("read_at", null);
    notificationCount = nc ?? 0;
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${antonio.variable} font-sans antialiased bg-white text-black`}>
        <Navbar
          user={
            user
              ? {
                  email: user.email ?? null,
                  username,
                  role,
                  artistSlug,
                  displayName: username,
                  pendingRequestCount,
                }
              : null
          }
          notificationCount={notificationCount}
        />
        <main>{children}</main>
                <InstallPrompt />
        <footer className="border-t border-gray-200 mt-24 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
              <a href="/terms" className="text-gray-500 hover:text-black">Terms of Service</a>
              <a href="/privacy" className="text-gray-500 hover:text-black">Privacy Policy</a>
              <a href="/refunds" className="text-gray-500 hover:text-black">Refund Policy</a>
              <a href="/contact" className="text-gray-500 hover:text-black">Contact</a>
            </div>
            <p className="text-center text-sm text-gray-500">
              <span
                className="block text-sm uppercase tracking-[0.3em] text-gray-400 mb-4"
                style={{ fontFamily: "var(--font-antonio)" }}
              >
                Discover · Connect · Create · Book · Grow
              </span>
              {"© " + new Date().getFullYear() + " GRID. All rights reserved."}
            </p>
          </div>
        </footer>
        <MobileNav isSignedIn={!!user} />
        <div className="h-14 sm:hidden" />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
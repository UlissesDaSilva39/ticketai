import type { Metadata } from "next";
import { Inter, Antonio } from "next/font/google";
import { createServerSupabase } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";
import ProfileDropdown from "@/components/ProfileDropdown";
import InstallPrompt from "@/components/InstallPrompt";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const antonio = Antonio({
  variable: "--font-antonio",
  subsets: ["latin"],
  weight: ["400", "700"],
});
export const viewport = {
  themeColor: "#00FF87",
};

const SITE_URL = process.env.NEXT_PUBLIC_ROOT_URL || "https://ticketai.org.uk";

export const metadata: Metadata = {
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TicketAI",
  },
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TicketAI - Find Your Next Event",
    template: "%s | TicketAI",
  },
  
  description:
    "AI-powered event discovery and ticketing. Find live events, buy tickets, and support venues and promoters.",
  openGraph: {
    type: "website",
    siteName: "TicketAI",
    title: "TicketAI - Find Your Next Event",
    description: "AI-powered event discovery and ticketing.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "TicketAI - Find Your Next Event",
    description: "AI-powered event discovery and ticketing.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: string | null = null;
  let username: string | null = null;
  let pendingRequestCount = 0;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, username")
      .eq("id", user.id)
      .maybeSingle();
    role = profile?.role ?? null;
    username = profile?.username ?? null;

    const { count } = await supabase
      .from("friendships")
      .select("*", { count: "exact", head: true })
      .eq("friend_id", user.id)
      .eq("status", "pending");
    pendingRequestCount = count ?? 0;
  }

  const isAdmin = role === "admin";
  const isPromoter = role === "promoter" || isAdmin;
  const isVenue = role === "venue" || isAdmin;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${antonio.variable} font-sans antialiased bg-white text-black`}
      >
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <a
              href="/"
              className="text-2xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-antonio)" }}
            >
              TICKETAI
            </a>
            <nav className="flex items-center gap-6">
              <a
                href="/"
                className="text-sm font-medium hover:opacity-70 hidden sm:inline"
              >
                Discover
              </a>
              <a
                href="/search"
                className="text-sm font-medium hover:opacity-70 hidden sm:inline"
              >
                Search
              </a>
              <a
                href="/friends"
                className="text-sm font-medium hover:opacity-70 hidden sm:inline"
              >
                Social
              </a>
              {user && (
                <a
                  href="/feed"
                  className="text-sm font-medium hover:opacity-70 hidden sm:inline"
                >
                  Feed
                </a>
              )}
              {user && (
                <a
                  href="/following"
                  className="text-sm font-medium hover:opacity-70 hidden sm:inline"
                >
                  Following
                </a>
              )}
              {user && (
                <a
                  href="/messages"
                  className="text-sm font-medium hover:opacity-70 hidden sm:inline"
                >
                  Messages
                </a>
              )}
              <a
                href="/people"
                className="text-sm font-medium hover:opacity-70 hidden sm:inline"
              >
                People
              </a>

              <a
                href="/venues"
                className="text-sm font-medium hover:opacity-70 hidden sm:inline"
              >
                Venues
              </a>
              <a
                href="/promoters"
                className="text-sm font-medium hover:opacity-70 hidden sm:inline"
              >
                Promoters
              </a>

              {!user && (
                <>
                  <a
                    href="/for-promoters"
                    className="text-sm font-medium hover:opacity-70 hidden sm:inline"
                  >
                    Become a promoter
                  </a>
                  <a
                    href="/for-venues"
                    className="text-sm font-medium hover:opacity-70 hidden sm:inline"
                  >
                    List your venue
                  </a>
                </>
              )}

              {user && (
                <a
                  href="/my-tickets"
                  className="text-sm font-medium hover:opacity-70 hidden sm:inline"
                >
                  My Tickets
                </a>
              )}

              {user ? (
                <ProfileDropdown
                  username={username}
                  email={user?.email ?? null}
                  role={role}
                  pendingRequestCount={pendingRequestCount}
                />
              ) : (
                <a
                  href="/login"
                  className="px-5 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800"
                >
                  Sign In
                </a>
              )}
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <InstallPrompt />
        <footer className="border-t border-gray-200 mt-24 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
              <a href="/terms" className="text-gray-500 hover:text-black">
                Terms of Service
              </a>
              <a href="/privacy" className="text-gray-500 hover:text-black">
                Privacy Policy
              </a>
              <a href="/refunds" className="text-gray-500 hover:text-black">
                Refund Policy
              </a>
              <a href="/contact" className="text-gray-500 hover:text-black">
                Contact
              </a>
            </div>
            <p className="text-center text-sm text-gray-500">
              <span
                className="block text-sm uppercase tracking-[0.3em] text-gray-400 mb-4"
                style={{ fontFamily: "var(--font-antonio)" }}
              >
                Discover. Connect. Experience.
              </span>
              {"\u00A9 " +
                new Date().getFullYear() +
                " TicketAI. All rights reserved."}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
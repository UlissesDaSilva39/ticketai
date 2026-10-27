import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Navbar } from "@/components/nav/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GRID | The Network for Live Music",
  description: "Artists get booked. Promoters fill rooms. Venues get discovered.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("username, display_name, role")
      .eq("id", user.id)
      .maybeSingle();
    profile = data;
  }

  const navUser = user
    ? {
        id: user.id,
        email: user.email,
        name: profile?.display_name || profile?.username || user.email?.split("@")[0] || "User",
        role: profile?.role || "fan",
      }
    : null;

  return (
    <html lang="en">
      <body className={`${inter.className} font-sans antialiased bg-white text-black`}>
        <Navbar user={navUser} />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
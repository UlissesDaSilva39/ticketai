import ChatBot from '@/components/ChatBot';
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/studio.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/records.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/studio.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import type { Metadata } from "next";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/studio.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/records.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/studio.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import { Inter } from "next/font/google";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/studio.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/records.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/studio.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "./globals.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/studio.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/records.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/studio.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/stream-meet.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/studio.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/records.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/studio.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/tracks.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/studio.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/records.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/studio.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import { createServerClient } from "@supabase/ssr";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/studio.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/records.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/studio.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import { cookies } from "next/headers";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/studio.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/records.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/studio.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import { Navbar } from "@/components/nav/Navbar";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/studio.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/records.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/studio.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import { ThemeProvider } from '@/components/theme/ThemeProvider'

const inter = Inter({ subsets: ["latin"] });

import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/studio.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/records.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
import "@/app/styles/studio.css";
import "@/app/styles/nav.css";
import "@/app/styles/meta.css";
import "@/app/styles/nav.css";
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
      <ThemeProvider>
        <Navbar user={navUser} />
        <main className="min-h-screen">{children}</main>
      </ThemeProvider>
      <ChatBot />
    </body>
    </html>
  );
}











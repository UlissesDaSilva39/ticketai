"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/nav/Navbar";
import GuestNav from "@/components/nav/GuestNav";
import GuideAssistant from "@/components/guide/GuideAssistant";
import { useMe } from "@/lib/hooks/useMe";

// Pages with their own full-screen design and no top bar: landing and the account screens.
const BARE_ROUTES = ["/", "/login", "/signup", "/forgot-password", "/reset-password"];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { me, loading } = useMe();

  const bare = BARE_ROUTES.includes(pathname) || pathname.startsWith("/auth/");

  // Members get the full app menu; logged-out visitors (only ever on public
  // pages, see lib/access.ts) get a simple Log in / Sign up bar.
  let topBar: React.ReactNode = null;
  if (!bare) topBar = me ? <Navbar /> : loading ? <div className="h-14 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950" aria-hidden="true" /> : <GuestNav />;

  return (
    <>
      {topBar}
      {children}
      {/* In-app guide for logged-in members only */}
      {!bare && me && <GuideAssistant />}
    </>
  );
}

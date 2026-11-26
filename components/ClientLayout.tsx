"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/nav/Navbar";
import GuideAssistant from "@/components/guide/GuideAssistant";

// Pages that hide the member navbar: landing and the account (log in / sign up / password) screens.
const PUBLIC_ROUTES = ["/", "/login", "/signup", "/forgot-password", "/reset-password"];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide navbar on public routes OR dynamic public routes (e.g. /artists/*, /auth/*)
  const isPublic =
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith("/artists/") ||
    pathname.startsWith("/auth/");

  return (
    <>
      {!isPublic && <Navbar />}
      {children}
      {/* In-app guide on member pages only (not landing / log in / sign up) */}
      {!isPublic && <GuideAssistant />}
    </>
  );
}
"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/nav/Navbar";

const PUBLIC_ROUTES = ["/", "/login", "/signup"];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide navbar on public routes OR dynamic public routes (e.g. /artists/*)
  const isPublic = PUBLIC_ROUTES.includes(pathname) || pathname.startsWith("/artists/");

  return (
    <>
      {!isPublic && <Navbar />}
      {children}
    </>
  );
}
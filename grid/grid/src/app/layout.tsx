import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "GRID",
  description: "Discover · Connect · Create · Book · Grow",
};

const nav = [
  ["Home",           "/feed"],
  ["Discover",       "/discover"],
  ["Search",         "/search"],
  ["Artists",        "/artists"],
  ["Social",         "/social"],
  ["Network",        "/network"],
  ["My Tickets",     "/tickets"],
  ["My artist page", "/artist/dj-poxy"],
] as const;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
        <header className="sticky top-0 z-30 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur">
          <div className="mx-auto flex h-[72px] max-w-[1400px] items-center gap-6 px-4">
            <Link href="/feed" className="text-lg font-bold tracking-tight">GRID</Link>
            <nav className="hidden gap-5 text-sm md:flex">
              {nav.map(([label, href]) => (
                <Link key={href} href={href} className="text-neutral-300 hover:text-white">{label}</Link>
              ))}
            </nav>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
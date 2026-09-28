import type { Metadata } from "next";
import { Inter, Antonio } from "next/font/google";
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

const SITE_URL = process.env.NEXT_PUBLIC_ROOT_URL || "https://ticketai.org.uk";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TicketAI - Find Your Next Event",
    template: "%s | TicketAI",
  },
  description: "AI-powered event discovery and ticketing. Find live events, buy tickets, and support venues and promoters.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${antonio.variable} font-sans antialiased bg-white text-black`}>
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-antonio)" }}>
              TICKETAI
            </a>
            <nav className="flex items-center gap-6">
              <a href="/" className="text-sm font-medium hover:opacity-70 hidden sm:inline">Discover</a>
              <a href="/promoters" className="text-sm font-medium hover:opacity-70 hidden sm:inline">Promoters</a>
              <a href="/my-tickets" className="text-sm font-medium hover:opacity-70 hidden sm:inline">My Tickets</a>
              <a href="/organizer" className="text-sm font-medium hover:opacity-70 hidden sm:inline">Organizer</a>
              <a href="/login" className="px-5 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800">Sign In</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-gray-200 mt-24 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
              <a href="/terms" className="text-gray-500 hover:text-black">Terms of Service</a>
              <a href="/privacy" className="text-gray-500 hover:text-black">Privacy Policy</a>
              <a href="/refunds" className="text-gray-500 hover:text-black">Refund Policy</a>
            </div>
            <p className="text-center text-sm text-gray-500">
              {"\u00A9 " + new Date().getFullYear() + " TicketAI. All rights reserved."}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

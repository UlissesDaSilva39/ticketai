import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/app/styles/nav.css";
import Navbar from "@/components/nav/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GRID | The Network for Live Music",
  description: "Discover, stream, create, connect, and get paid.",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en"><body className={inter.className}>
        <Navbar user={null} />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/nav/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GRID | The Network for Live Music",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans antialiased bg-white text-black`}>
        <Navbar user={null} />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}

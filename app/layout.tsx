import type { Metadata } from "next";
import "./globals.css";
import "@/app/styles/nav.css";
import Navbar from "@/components/nav/Navbar";

export const metadata: Metadata = {
  title: "GRID | The Network for Live Music",
  description: "Discover, stream, create, connect, and get paid.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar user={null} />
        <div className="app-content-wrapper">
          {children}
        </div>
      </body>
    </html>
  );
}

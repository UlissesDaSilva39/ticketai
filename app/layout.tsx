import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClientLayout } from "@/components/ClientLayout";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "GRID | The #1 Music Industry Network",
  description: "Get booked. Get paid. Find collabs, book gigs, and get paid via secure Escrow.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#f4f2ee] dark:bg-black text-gray-900 dark:text-gray-100">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ThemeProvider>
        <Footer />
</body>
    </html>
  );
}
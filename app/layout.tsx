import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClientLayout } from "@/components/ClientLayout";
import Footer from "@/components/Footer";
import "./theme-dark.css";
import ThemeBinder from "@/components/ThemeBinder";

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
      <head>
        <script dangerouslySetInnerHTML={{ __html: "try{if(localStorage.getItem('grid-theme')==='dark'){var r=document.documentElement;r.classList.add('dark');r.setAttribute('data-theme','dark');}}catch(e){}" }} />
      </head>
      <body className="bg-[#f4f2ee] dark:bg-black text-gray-900 dark:text-gray-100">
        <ThemeBinder />
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
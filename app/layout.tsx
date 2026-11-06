import './globals.css';
import Navbar from '@/components/Navbar';
import MessagingPopup from '@/components/MessagingPopup';

export const metadata = {
  title: 'GRID',
  description: 'AI-powered event ticketing platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <MessagingPopup />
      </body>
    </html>
  );
}
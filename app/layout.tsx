import './globals.css';
import Navbar from '@/components/Navbar';
import AppLauncher from '@/components/AppLauncher';
import MessagingPopup from '@/components/MessagingPopup';

export const metadata = {
  title: {
    default: 'GRID - MUSIC SOCIAL NETWORK',
    template: '%s | GRID'
  },
  description: 'GRID is a professional music social network connecting artists, promoters, and fans.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f4f2ee] dark:bg-black text-gray-900 dark:text-gray-100 antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <MessagingPopup />
      </body>
    </html>
  );
}
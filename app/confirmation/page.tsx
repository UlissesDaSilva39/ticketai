import Link from "next/link";

export default function ConfirmationPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#00FF87] px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-7xl md:text-9xl font-bold leading-none tracking-tight mb-8" style={{ fontFamily: "var(--font-antonio)" }}>
          YOU ARE IN!
        </h1>
        <p className="text-lg mb-10">Your tickets have been confirmed.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/my-tickets" className="px-8 py-4 bg-black text-white font-medium rounded-full hover:bg-gray-800">View My Tickets</Link>
          <Link href="/" className="px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-gray-100">Back to Events</Link>
        </div>
      </div>
    </div>
  );
}

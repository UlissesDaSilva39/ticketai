import Link from "next/link";
import { Sidebar } from "@/components/sidebar/Sidebar";

export const metadata = { title: "Checkout cancelled" };

export default function MerchCancelPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      <div className="mx-auto max-w-[1400px] px-6 py-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <Sidebar />
        </div>
        <main className="col-span-12 lg:col-span-9 min-w-0">
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-3xl">
              !
            </div>
            <h1 className="text-3xl font-bold mt-4" style={{ fontFamily: "var(--font-antonio)" }}>
              Checkout cancelled
            </h1>
            <p className="text-gray-600 mt-2 text-sm">
              Your order was not completed. You can try again any time.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/artists" className="rounded-full bg-black text-white text-sm font-semibold px-6 py-2 hover:bg-gray-800">
                Back to artists
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
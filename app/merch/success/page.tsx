import Link from 'next/link';

export default function MerchSuccessPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
        ✓
      </div>
      <h1 className="mt-6 text-3xl font-black tracking-tight">Order confirmed</h1>
      <p className="mt-3 text-base text-neutral-600">
        You&apos;ll receive a confirmation email shortly with tracking information.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/artists" className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800">
          Keep browsing
        </Link>
        <Link href="/" className="rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:border-neutral-900">
          Go home
        </Link>
      </div>
    </div>
  );
}
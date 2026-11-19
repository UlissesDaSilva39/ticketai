import Link from "next/link";

export default function PostCollabButton() {
  return (
    <Link
      href="/jobs"
      data-cta="post-collab"
      className="mt-3 block rounded-lg border border-emerald-700 py-2 text-center text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
    >
      + Post a collab
    </Link>
  );
}
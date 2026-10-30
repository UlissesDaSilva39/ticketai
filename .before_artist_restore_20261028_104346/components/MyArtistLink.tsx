import Link from "next/link";

type Props = { slug: string | null };

export default function MyArtistLink({ slug }: Props) {
  if (!slug) return null;

  return (
    <Link
      href={`/artist/${slug}`}
      className="text-sm font-medium hover:opacity-70 hidden sm:inline"
    >
      My artist page
    </Link>
  );
}

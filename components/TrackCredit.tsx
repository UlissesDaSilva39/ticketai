interface Props {
  isrc?: string;
  masterOwner?: string;
  composer?: string;
  publisher?: string;
  territory?: string;
  compact?: boolean;
}

export default function TrackCredit({
  isrc,
  masterOwner,
  composer,
  publisher,
  territory,
  compact = false,
}: Props) {
  const parts: string[] = [];
  if (masterOwner) parts.push(`℗ ${masterOwner}`);
  if (composer) parts.push(`© ${composer}`);
  if (publisher) parts.push(publisher);
  if (isrc) parts.push(`ISRC ${isrc}`);
  if (territory) parts.push(territory);

  if (parts.length === 0) return null;

  return (
    <p className={`text-[10px] text-gray-500 dark:text-zinc-500 ${compact ? "truncate" : ""}`}>
      {parts.join(" · ")}
    </p>
  );
}
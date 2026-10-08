export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export function uniqueSlug(base: string, suffix: string): string {
  const rand = suffix.replace(/[^a-z0-9]/gi, "").slice(0, 6).toLowerCase();
  return `${base}-${rand}`;
}

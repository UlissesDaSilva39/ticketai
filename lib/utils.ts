export function priceFrom(ticketTypes: any[] | null | undefined): string {
  if (!Array.isArray(ticketTypes) || ticketTypes.length === 0) return "TBA";

  const prices = ticketTypes
    .map((t) => Number(t?.price))
    .filter((n) => Number.isFinite(n) && n > 0);

  if (prices.length === 0) return "Free";

  const min = Math.min(...prices);
  return `From £${min.toFixed(2)}`;
}

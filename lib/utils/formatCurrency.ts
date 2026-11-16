export function formatCurrency(pence: number): string {
  if (!Number.isFinite(pence)) return "£0";
  const pounds = pence / 100;
  if (pounds >= 1000) {
    return "£" + pounds.toLocaleString("en-GB", { maximumFractionDigits: 0 });
  }
  if (pounds >= 100) {
    return "£" + pounds.toFixed(0);
  }
  if (pounds >= 1) {
    return "£" + pounds.toFixed(2);
  }
  return "£" + pounds.toFixed(2);
}

export function formatPounds(pence: number): number {
  return Math.round(pence / 100);
}
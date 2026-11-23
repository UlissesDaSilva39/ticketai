import { redirect } from "next/navigation";

// /premium used to show a separate £10/month offer with a fake "Pay" button
// that charged nothing. GRID Pro now lives on /pro (real Stripe checkout).
export default function PremiumPage() {
  redirect("/pro");
}

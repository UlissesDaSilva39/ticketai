import { redirect } from "next/navigation";

export default function TrailingPeriodRedirect() {
  // Redirects /discover/artists. to /discover/artists
  redirect("/discover/artists");
}